package handlers

import (
	"net/http"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/nicholas301205/Unklab_Hub/tree/master/backend/config"
	"github.com/nicholas301205/Unklab_Hub/tree/master/backend/models"
	"github.com/nicholas301205/Unklab_Hub/tree/master/backend/utils" // 🔥 KITA PAKE UTILS PUNYA LU AJA BIAR SAMA KAYAK LOGIN 🔥
)

// Struct untuk nangkep input ganti password dari React
type ChangePasswordInput struct {
	CurrentPassword string `json:"current_password" binding:"required"`
	NewPassword     string `json:"new_password" binding:"required"`
}

// GetProfile (Mengambil profil user berdasarkan ID)
func GetProfile(c *gin.Context) {
	id := c.Param("id")
	var user models.User

	if err := config.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User tidak ditemukan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": user})
}

// UpdateProfile (Mengupdate profil user berdasarkan ID, yang bisa cuma owner yang update)
func UpdateProfile(c *gin.Context) {
	id := c.Param("id")
	userID, _ := c.Get("userID")

	paramID, _ := strconv.Atoi(id)
	if uint(paramID) != userID.(uint) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Tidak bisa edit profil orang lain"})
		return
	}

	var user models.User
	if err := config.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User tidak ditemukan"})
		return
	}

	username := c.PostForm("username")
	bio := c.PostForm("bio")

	if username != "" {
		user.Username = username
	}
	if bio != "" {
		user.Bio = bio
	}

	file, err := c.FormFile("avatar")
	if err == nil {
		filename := strconv.FormatInt(time.Now().Unix(), 10) + filepath.Ext(file.Filename)
		savePath := "uploads/" + filename
		if err := c.SaveUploadedFile(file, savePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal upload avatar"})
			return
		}
		user.Avatar = "/" + savePath
	}

	config.DB.Save(&user)
	c.JSON(http.StatusOK, gin.H{"message": "Profil berhasil diupdate", "data": user})
}

// ChangePassword (Mengubah password user)
func ChangePassword(c *gin.Context) {
	// Ambil ID user dari token JWT yang lagi login
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Tidak diizinkan, silakan login ulang"})
		return
	}

	var input ChangePasswordInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Semua field harus diisi"})
		return
	}

	// Cari user di database
	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User tidak ditemukan"})
		return
	}

	// 🔥 UBAH 1: Pake utils.CheckPassword biar sinkron sama login 🔥
	if !utils.CheckPassword(input.CurrentPassword, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Password saat ini salah!"})
		return
	}

	// 🔥 UBAH 2: Pake utils.HashPassword biar formatnya cocok 🔥
	hashedPassword, err := utils.HashPassword(input.NewPassword)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengenkripsi password baru"})
		return
	}

	// Update password di database menggunakan cara yang paling aman (Save)
	user.Password = hashedPassword
	if err := config.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan password ke database"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password berhasil diubah!"})
}

// GetAllUsers (Mengambil semua user, hanya untuk admin)
func GetAllUsers(c *gin.Context) {
	var users []models.User
	config.DB.Find(&users)
	c.JSON(http.StatusOK, gin.H{"data": users})
}

// DeleteUser (hapus user admin only)
func DeleteUser(c *gin.Context) {
	id := c.Param("id")

	// 1. Ambil semua post milik user
	var posts []models.Post
	config.DB.Where("user_id = ?", id).Find(&posts)

	// 2. Loop setiap post
	for _, post := range posts {
		// hapus bookmarks yang terkait post
		config.DB.Where("post_id = ?", post.ID).Delete(&models.Bookmark{})

		// hapus reports berdasarkan post_id (bukan user_id!)
		config.DB.Where("post_id = ?", post.ID).Delete(&models.Report{})

		// (kalau ada comment)
		config.DB.Where("post_id = ?", post.ID).Delete(&models.Comment{})
	}

	// 3. Baru hapus posts
	config.DB.Where("user_id = ?", id).Delete(&models.Post{})

	// 4. Baru hapus user
	config.DB.Delete(&models.User{}, id)

	c.JSON(http.StatusOK, gin.H{
		"message": "User dan semua data terkait berhasil dihapus",
	})
}

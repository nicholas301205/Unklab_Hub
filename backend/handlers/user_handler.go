package handlers

import (
	"net/http"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/nicholas301205/Unklab_Hub/tree/master/backend/config"
	"github.com/nicholas301205/Unklab_Hub/tree/master/backend/models"
)

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

// GetAllUsers (Mengambil semua user, hanya untuk admin)
func GetAllUsers(c *gin.Context) {
	var users []models.User
	config.DB.Find(&users)
	c.JSON(http.StatusOK, gin.H{"data": users})
}

// hapus user (admin only)
func DeleteUser(c *gin.Context) {
	id := c.Param("id")
	var user models.User

	if err := config.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User tidak ditemukan"})
		return
	}

	config.DB.Delete(&user)
	c.JSON(http.StatusOK, gin.H{"message": "User berhasil dihapus"})
}

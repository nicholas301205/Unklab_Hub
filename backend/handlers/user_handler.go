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

// GET /api/users/:id → get profil user
func GetProfile(c *gin.Context) {
	id := c.Param("id")
	var user models.User

	if err := config.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User tidak ditemukan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": user})
}

// PUT /api/users/:id → edit profil
func UpdateProfile(c *gin.Context) {
	id := c.Param("id")
	userID, _ := c.Get("userID")

	// Hanya bisa edit profil sendiri
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

	// Handle upload avatar
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

// GET /api/admin/users → list semua user (admin only)
func GetAllUsers(c *gin.Context) {
	var users []models.User
	config.DB.Find(&users)
	c.JSON(http.StatusOK, gin.H{"data": users})
}

// DELETE /api/admin/users/:id → hapus user (admin only)
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

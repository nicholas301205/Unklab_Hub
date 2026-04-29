package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nicholas301205/Unklab_Hub/tree/master/backend/config"
	"github.com/nicholas301205/Unklab_Hub/tree/master/backend/models"
)

func AddComment(c *gin.Context) {
	// 1. Ambil ID user yang lagi login dari middleware
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Harap login terlebih dahulu"})
		return
	}

	// 2. Siapkan penangkap data dari React
	var input struct {
		PostID  uint   `json:"post_id"`
		Content string `json:"content"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format data salah"})
		return
	}

	// 3. Simpan ke database
	comment := models.Comment{
		PostID:  input.PostID,
		UserID:  userID.(uint),
		Content: input.Content,
	}

	if err := config.DB.Create(&comment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan komentar"})
		return
	}

	// 4. Preload data User biar nama & avatar langsung ke-kirim balik ke React
	config.DB.Preload("User").First(&comment, comment.ID)

	c.JSON(http.StatusCreated, gin.H{"message": "Komentar berhasil ditambahkan", "data": comment})
}

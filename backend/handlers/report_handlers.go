package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nicholas301205/Unklab_Hub/tree/master/backend/config"
	"github.com/nicholas301205/Unklab_Hub/tree/master/backend/models"
)

// CreateReport allows authenticated users to report a post
func CreateReport(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Harap login terlebih dahulu"})
		return
	}

	var input struct {
		PostID uint   `json:"post_id"`
		Reason string `json:"reason"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format data salah"})
		return
	}

	// Pastikan post ada
	var post models.Post
	if err := config.DB.First(&post, input.PostID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post tidak ditemukan"})
		return
	}

	report := models.Report{
		PostID:     input.PostID,
		ReporterID: userID.(uint),
		Reason:     input.Reason,
	}

	if err := config.DB.Create(&report).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan laporan"})
		return
	}

	// preload relations for response
	config.DB.Preload("Post").Preload("Reporter").First(&report, report.ID)

	c.JSON(http.StatusCreated, gin.H{"message": "Laporan berhasil dikirim", "data": report})
}

// GetReports returns all reports for admin review
func GetReports(c *gin.Context) {
	var reports []models.Report
	if err := config.DB.Preload("Post").Preload("Reporter").Order("created_at DESC").Find(&reports).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal ambil laporan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reports})
}

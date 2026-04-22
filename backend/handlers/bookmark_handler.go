package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nicholas301205/Unklab_Hub/tree/master/backend/config"
	"github.com/nicholas301205/Unklab_Hub/tree/master/backend/models"
)

// GET /api/bookmarks → ambil semua bookmark milik user
func GetBookmarks(c *gin.Context) {
	userID, _ := c.Get("userID")
	var bookmarks []models.Bookmark

	if err := config.DB.Preload("Post.User").
		Where("user_id = ?", userID).
		Find(&bookmarks).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal ambil bookmark"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": bookmarks})
}

// POST /api/bookmarks → tambah bookmark
func AddBookmark(c *gin.Context) {
	userID, _ := c.Get("userID")

	var input struct {
		PostID uint `json:"post_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Cek sudah pernah bookmark
	var existing models.Bookmark
	if err := config.DB.Where("user_id = ? AND post_id = ?", userID, input.PostID).
		First(&existing).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Post sudah di-bookmark"})
		return
	}

	bookmark := models.Bookmark{
		UserID: userID.(uint),
		PostID: input.PostID,
	}

	if err := config.DB.Create(&bookmark).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menambah bookmark"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Berhasil bookmark post"})
}

// DELETE /api/bookmarks/:postId → hapus bookmark
func DeleteBookmark(c *gin.Context) {
	userID, _ := c.Get("userID")
	postID := c.Param("postId")

	if err := config.DB.Where("user_id = ? AND post_id = ?", userID, postID).
		Delete(&models.Bookmark{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal hapus bookmark"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Bookmark berhasil dihapus"})
}

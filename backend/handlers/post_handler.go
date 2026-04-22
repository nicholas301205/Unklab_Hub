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

// GET /api/posts → semua post + sort + search
func GetAllPosts(c *gin.Context) {
	var posts []models.Post

	query := config.DB.Preload("User")

	// Search
	if search := c.Query("q"); search != "" {
		query = query.Where("title LIKE ? OR content LIKE ?", "%"+search+"%", "%"+search+"%")
	}

	// Sort
	sort := c.Query("sort")
	switch sort {
	case "oldest":
		query = query.Order("created_at ASC")
	default:
		query = query.Order("created_at DESC") // default: terbaru
	}

	if err := query.Find(&posts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal ambil data post"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": posts})
}

// GET /api/posts/:id → detail post
func GetPostByID(c *gin.Context) {
	id := c.Param("id")
	var post models.Post

	if err := config.DB.Preload("User").First(&post, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post tidak ditemukan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": post})
}

// POST /api/posts → buat post baru
func CreatePost(c *gin.Context) {
	userID, _ := c.Get("userID")

	title := c.PostForm("title")
	content := c.PostForm("content")

	if title == "" || content == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Title dan content wajib diisi"})
		return
	}

	post := models.Post{
		UserID:  userID.(uint),
		Title:   title,
		Content: content,
	}

	// Handle upload gambar (opsional)
	file, err := c.FormFile("image")
	if err == nil {
		filename := strconv.FormatInt(time.Now().Unix(), 10) + filepath.Ext(file.Filename)
		savePath := "uploads/" + filename
		if err := c.SaveUploadedFile(file, savePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal upload gambar"})
			return
		}
		post.ImageURL = "/" + savePath
	}

	if err := config.DB.Create(&post).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat post"})
		return
	}

	config.DB.Preload("User").First(&post, post.ID)
	c.JSON(http.StatusCreated, gin.H{"message": "Post berhasil dibuat", "data": post})
}

// PUT /api/posts/:id → edit post
func UpdatePost(c *gin.Context) {
	id := c.Param("id")
	userID, _ := c.Get("userID")
	role, _ := c.Get("role")

	var post models.Post
	if err := config.DB.First(&post, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post tidak ditemukan"})
		return
	}

	// Hanya owner atau admin yang boleh edit
	if post.UserID != userID.(uint) && role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Tidak punya akses"})
		return
	}

	var input struct {
		Title   string `json:"title"`
		Content string `json:"content"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	config.DB.Model(&post).Updates(models.Post{
		Title:   input.Title,
		Content: input.Content,
	})

	c.JSON(http.StatusOK, gin.H{"message": "Post berhasil diupdate", "data": post})
}

// DELETE /api/posts/:id → hapus post
func DeletePost(c *gin.Context) {
	id := c.Param("id")
	userID, _ := c.Get("userID")
	role, _ := c.Get("role")

	var post models.Post
	if err := config.DB.First(&post, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post tidak ditemukan"})
		return
	}

	// Hanya owner atau admin yang boleh hapus
	if post.UserID != userID.(uint) && role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Tidak punya akses"})
		return
	}

	config.DB.Delete(&post)
	c.JSON(http.StatusOK, gin.H{"message": "Post berhasil dihapus"})
}

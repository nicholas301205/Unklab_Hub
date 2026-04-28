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

// GetAllPosts (Mengambil semua post dengan opsi search dan sort)
// GetAllPosts (Mengambil semua post dengan opsi search dan sort)
func GetAllPosts(c *gin.Context) {
	var posts []models.Post

	// 🔥 UBAH BARIS INI: Tambahin Preload buat bawa Komentar dan User yang komen 🔥
	query := config.DB.Preload("User").Preload("Comments").Preload("Comments.User")

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
		query = query.Order("created_at DESC")
	}

	if err := query.Find(&posts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal ambil data post"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": posts})
}

// GetPostByID (Mengambil post berdasarkan ID)
func GetPostByID(c *gin.Context) {
	id := c.Param("id")
	var post models.Post

	// 🔥 UBAH BARIS INI JUGA 🔥
	if err := config.DB.Preload("User").Preload("Comments").Preload("Comments.User").First(&post, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post tidak ditemukan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": post})
}

// CreatePost (Membuat post baru dengan upload gambar(Optional))
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

// UpdatePost (Mengupdate post berdasarkan ID, yang bisa cuma owner atau admin yang update)
func UpdatePost(c *gin.Context) {
	id := c.Param("id")
	userID, _ := c.Get("userID")
	role, _ := c.Get("role")

	var post models.Post
	if err := config.DB.First(&post, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post tidak ditemukan"})
		return
	}

	// Cuma owner atau admin yang boleh edit
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

// DeletePost (Menghapus post berdasarkan ID, yang bisa cuma owner atau admin yang hapus)
// DeletePost (Menghapus post berdasarkan ID, yang bisa cuma owner atau admin yang hapus)
func DeletePost(c *gin.Context) {
	id := c.Param("id")
	userID, _ := c.Get("userID")
	role, _ := c.Get("role")

	var post models.Post
	if err := config.DB.First(&post, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post tidak ditemukan"})
		return
	}

	// Cuma owner atau admin yang boleh hapus
	if post.UserID != userID.(uint) && role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Tidak punya akses"})
		return
	}

	// 🔥 1. Hapus SEMUA komentar yang nyangkut di post ini biar Database gak ngamuk
	config.DB.Where("post_id = ?", post.ID).Delete(&models.Comment{})

	// 🔥 2. Hapus SEMUA bookmark yang nyangkut di post ini
	config.DB.Where("post_id = ?", post.ID).Delete(&models.Bookmark{})

	// 🔥 3. Baru hapus post utamanya (Tambah pengecekan error!)
	// Catatan: Pakai .Unscoped() kalau lu pengen bener-bener hilang dari tabel MySQL lu
	// (Kalau nggak pake Unscoped, GORM biasanya cuma ngisi kolom deleted_at / soft delete)
	if err := config.DB.Unscoped().Delete(&post).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghapus post dari database"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Post beserta interaksinya berhasil dihapus"})
}

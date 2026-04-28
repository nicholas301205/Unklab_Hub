package handlers

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/nicholas301205/Unklab_Hub/tree/master/backend/config"
	"github.com/nicholas301205/Unklab_Hub/tree/master/backend/models"
	"github.com/nicholas301205/Unklab_Hub/tree/master/backend/utils"
)

// Register (Membuat akun baru)
func Register(c *gin.Context) {
	var input struct {
		Username string `json:"username" binding:"required"`
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=6"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var existing models.User
	if err := config.DB.Where("email = ?", input.Email).First(&existing).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email sudah terdaftar"})
		return
	}

	hashedPassword, err := utils.HashPassword(input.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal hash password"})
		return
	}

	user := models.User{
		Username: input.Username,
		Email:    input.Email,
		Password: hashedPassword,
		Role:     "user",
	}

	if err := config.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat akun"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Registrasi berhasil!",
		"user": gin.H{
			"id":       user.ID,
			"username": user.Username,
			"email":    user.Email,
			"role":     user.Role,
		},
	})
}

// Login (Membuat cookie token)
func Login(c *gin.Context) {
	// 1. TAMBAHAN: Kita tambahkan Role di struct ini agar backend menangkap role dari dropdown frontend
	var input struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
		Role     string `json:"role" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := config.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Email atau password salah"})
		return
	}

	if !utils.CheckPassword(input.Password, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Email atau password salah"})
		return
	}

	// 2. TAMBAHAN: Cek kecocokan role yang dipilih di web dengan role asli di database
	if input.Role != user.Role {
		c.JSON(http.StatusForbidden, gin.H{"error": "Akses ditolak: Pilihan role tidak sesuai dengan data akun Anda!"})
		return
	}

	token, err := utils.GenerateToken(user.ID, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal generate token"})
		return
	}

	isProduction := os.Getenv("APP_ENV") == "production"

	c.SetCookie(
		"token",
		token,
		24*60*60,
		"/",
		"",
		isProduction,
		true,
	)

	c.JSON(http.StatusOK, gin.H{
		"message": "Login berhasil!",
		"token":   token,
		"user": gin.H{
			"id":       user.ID,
			"username": user.Username,
			"email":    user.Email,
			"role":     user.Role,
			"avatar":   user.Avatar,
		},
	})
}

// Logout (Menghapus cookie token)
func Logout(c *gin.Context) {
	isProduction := os.Getenv("APP_ENV") == "production"

	c.SetCookie(
		"token",
		"",
		-1,
		"/",
		"",
		isProduction,
		true,
	)

	c.JSON(http.StatusOK, gin.H{"message": "Logout berhasil!"})
}

package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file")
	}

	r := gin.Default()

	// Test route
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong - server is running!"})
	})

	r.Run(":8081")
}

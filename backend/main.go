package main

import (
	"fmt"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/nicholas301205/Unklab_Hub/tree/master/backend/config"
	"github.com/nicholas301205/Unklab_Hub/tree/master/backend/routes"
)

func main() {
	godotenv.Load()

	config.ConnectDB()
	config.MigrateDB()

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// Setup semua routes
	routes.SetupRoutes(r)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	fmt.Println("🚀 Server berjalan di port", port)
	r.Run(":" + port)
}

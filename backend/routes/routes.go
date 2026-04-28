package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/nicholas301205/Unklab_Hub/tree/master/backend/handlers"
	"github.com/nicholas301205/Unklab_Hub/tree/master/backend/middleware"
)

func SetupRoutes(r *gin.Engine) {
	r.Static("/uploads", "./uploads")

	api := r.Group("/api")
	{

		api.GET("/", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"message": "API is running",
			})
		})

		auth := api.Group("/auth")
		{
			auth.POST("/register", handlers.Register)
			auth.POST("/login", handlers.Login)
			auth.POST("/logout", handlers.Logout)
		}

		posts := api.Group("/posts")
		{
			posts.GET("", handlers.GetAllPosts)                                    // public
			posts.GET("/:id", handlers.GetPostByID)                                // public
			posts.POST("", middleware.AuthMiddleware(), handlers.CreatePost)       // auth
			posts.PUT("/:id", middleware.AuthMiddleware(), handlers.UpdatePost)    // auth
			posts.DELETE("/:id", middleware.AuthMiddleware(), handlers.DeletePost) // auth
		}

		bookmarks := api.Group("/bookmarks", middleware.AuthMiddleware())
		{
			bookmarks.GET("", handlers.GetBookmarks)
			bookmarks.POST("", handlers.AddBookmark)
			bookmarks.DELETE("/:postId", handlers.DeleteBookmark)
		}

		// Tambahin ini di bawah blok bookmarks
		comments := api.Group("/comments", middleware.AuthMiddleware())
		{
			comments.POST("", handlers.AddComment)
		}

		users := api.Group("/users", middleware.AuthMiddleware())
		{
			users.GET("/:id", handlers.GetProfile)
			users.PUT("/:id", handlers.UpdateProfile)
		}

		admin := api.Group("/admin", middleware.AuthMiddleware(), middleware.AdminMiddleware())
		{
			admin.GET("/users", handlers.GetAllUsers)
			admin.DELETE("/users/:id", handlers.DeleteUser)
		}
	}
}

package router

import (
	"aitu.cn/internal/handler"
	"aitu.cn/internal/middleware"
	"github.com/gin-gonic/gin"
)

func Router(addr string) error {
	router := gin.Default()

	api := router.Group("/api")
	{

		auth := api.Group("/auth")
		{
			var handler handler.User
			auth.POST("/signIn", handler.SignIn)
			auth.POST("/signUp", handler.SignUp)
			auth.GET("/active", handler.Active)
		}

		aigc := api.Group("/aigc")
		{
			var handler handler.Aigc
			aigc.POST("/text2image", handler.Text2image)
			aigc.GET("/task", handler.Task)
			aigc.POST("/recommend", handler.Recommend)
		}

		task := api.Group("/task")
		{
			var handler handler.Task
			task.GET("/info", handler.Info)
			task.POST("/list", handler.List)
		}

		user := api.Group("/user", middleware.Token())
		{
			var handler handler.User
			user.GET("/info", handler.Info)
			user.POST("/list", handler.List)
			user.GET("/logout", handler.Logout)
		}

		node := api.Group("/node", middleware.Token())
		{
			var handler handler.Node
			node.POST("/create", handler.Create)
			node.POST("/delete", handler.Delete)
			node.POST("/update", handler.Update)
			node.POST("/list", handler.List)
			node.POST("/setSort", handler.SetSort)
			node.POST("/setStatus", handler.SetStatus)
		}

		file := api.Group("/file")
		{
			var handler handler.File
			file.POST("/upload", handler.Upload)
		}

	}

	return router.Run(addr)
}

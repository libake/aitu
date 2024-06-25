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

		category := api.Group("/category", middleware.Token())
		{
			var handler handler.Category
			category.POST("/create", handler.Create)
			category.POST("/delete", handler.Delete)
			category.POST("/update", handler.Update)
			category.POST("/list", handler.List)
			category.POST("/setSort", handler.SetSort)
			category.POST("/setStatus", handler.SetStatus)
		}

		template := api.Group("/template", middleware.Token())
		{
			var handler handler.Template
			template.POST("/create", handler.Create)
			template.POST("/delete", handler.Delete)
			template.POST("/update", handler.Update)
			template.POST("/list", handler.List)
			template.POST("/setSort", handler.SetSort)
			template.POST("/setStatus", handler.SetStatus)
		}

		task := api.Group("/task", middleware.Token())
		{
			var handler handler.Task
			task.POST("/create", handler.Create)
			task.POST("/wordArt", handler.WordArt)
			task.POST("/delete", handler.Delete)
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

		common := api.Group("/common")
		{
			var com handler.Common
			common.POST("/sendSms", com.SendSms)
			var task handler.Task
			common.POST("/recommend", task.Recommend)
		}

	}

	return router.Run(addr)
}

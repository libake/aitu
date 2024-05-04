package middleware

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"

	db "aitu.cn/internal/database"
	"aitu.cn/internal/model"
)

// Token中间件:解析token
func Token() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var (
			user model.User
		)

		// 验证token
		header := ctx.Request.Header
		if v, ok := header["Access-Token"]; ok {
			sToken, err := db.NewRedis().HGet("user", v[0]).Result()
			if err != nil {
				ctx.Abort()
				ctx.JSON(http.StatusOK, gin.H{
					"code": 3070,
					"desc": "非法 Token",
				})
			}
			json.Unmarshal([]byte(sToken), &user)
		} else {
			ctx.Abort()
			ctx.JSON(http.StatusOK, gin.H{
				"code": 3070,
				"desc": "Token 不存在",
			})
		}

		ctx.Next()
	}
}

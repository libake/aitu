package middleware

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	db "aitu.cn/internal/database"
	"aitu.cn/internal/model"
)

// Token中间件:解析token
func Token() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var (
			user  model.User
			token string
		)

		// 验证token
		header := ctx.Request.Header
		if v, ok := header["Access-Token"]; ok {
			token = v[0]
			sToken, err := db.NewRedis().HGet("token", token).Result()
			if err != nil {
				ctx.Abort()
				ctx.JSON(http.StatusOK, gin.H{
					"code": 3073,
					"desc": "非法 token",
				})
				return
			}
			json.Unmarshal([]byte(sToken), &user)
			// 校验 token
			t := user.UpdateAt.Unix()
			if time.Now().Unix()-t > 86400 {
				db.NewRedis().HDel("token", token)
				ctx.Abort()
				ctx.JSON(http.StatusOK, gin.H{
					"code": 3071,
					"desc": "token 已过期",
				})
				return
			}
		} else {
			ctx.Abort()
			ctx.JSON(http.StatusOK, gin.H{
				"code": 3072,
				"desc": "token 不存在",
			})
			return
		}

		// 时间刷新
		user.UpdateAt = time.Now()
		s, _ := json.Marshal(user)
		db.NewRedis().HSet("token", token, string(s))

		ctx.Next()
	}
}

// 解析 token
func ParseToken(ctx *gin.Context) (user model.User, err error) {
	token := ctx.Request.Header.Get("Access-Token")
	sToken, err := db.NewRedis().HGet("token", token).Result()
	if err != nil {
		return
	}
	json.Unmarshal([]byte(sToken), &user)
	return
}

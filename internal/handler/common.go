package handler

import (
	"net/http"
	"time"

	db "aitu.cn/internal/database"
	"aitu.cn/internal/model"
	"github.com/gin-gonic/gin"
)

type Common struct {
}

func (c Common) SendSms(ctx *gin.Context) {
	var (
		captcha int16 = 4444
		params  struct {
			Mobile string `json:"mobile"`
			Scene  int    `json:"scene"`
		}
		user model.User
	)

	err := ctx.BindJSON(&params)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 4010,
			"desc": `参数错误：` + err.Error(),
		})
		return
	}

	switch params.Scene {
	case 1: // 短信登录
		user.Mobile = params.Mobile
		err = user.AccountExist()
		if err != nil {
			ctx.JSON(http.StatusOK, gin.H{
				"code": 4015,
				"desc": "不存在此手机号",
			})
			return
		}
	}

	err = db.NewRedis().Set(params.Mobile, captcha, 5*time.Minute).Err()
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3062,
			"desc": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code": 1000,
		"data": captcha,
		"desc": "Success",
	})
}

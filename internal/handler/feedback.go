package handler

import (
	"net/http"

	"aitu.cn/internal/dto"
	"aitu.cn/internal/middleware"
	"aitu.cn/internal/model"
	"aitu.cn/util"
	"github.com/gin-gonic/gin"
)

// 反馈
type Feedback struct {
}

// 新增
func (t *Feedback) Create(ctx *gin.Context) {
	var (
		feedback model.Feedback
	)

	err := ctx.BindJSON(&feedback)
	if nil != err {
		util.Fail(3040, err.Error(), ctx)
		return
	}

	user, err := middleware.ParseToken(ctx)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3040,
			"desc": err.Error(),
		})
		return
	}
	feedback.UserID = user.ID

	err = feedback.Create()
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3051,
			"desc": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code": 1000,
		"desc": "success",
	})
}

// 反馈列表
func (t *Feedback) List(ctx *gin.Context) {
	var (
		feedback model.Feedback
		param    dto.Request
	)

	err := ctx.BindJSON(&param)
	if nil != err {
		util.Fail(3040, err.Error(), ctx)
		return
	}

	ret, cnt, err := feedback.List(param)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3010,
			"desc": err.Error(),
		})
		return
	}

	data := make(map[string]interface{})
	data["list"] = ret
	data["total"] = cnt

	ctx.JSON(http.StatusOK, gin.H{
		"code": 1000,
		"data": data,
		"desc": "Success",
	})
}

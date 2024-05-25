package handler

import (
	"net/http"

	"aitu.cn/internal/dto"
	"aitu.cn/internal/model"
	"aitu.cn/util"
	"github.com/gin-gonic/gin"
)

type Style struct {
}

// 新增
func (t *Style) Create(ctx *gin.Context) {
	var (
		style model.Style
	)

	err := ctx.BindJSON(&style)
	if nil != err {
		util.Fail(3040, err.Error(), ctx)
		return
	}

	err = style.Create()
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

// 删除
func (t *Style) Delete(ctx *gin.Context) {
	var (
		param struct {
			ID []int64 `json:"id"`
		}
		style model.Style
	)

	err := ctx.BindJSON(&param)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3040,
			"desc": err.Error(),
		})
		return
	}

	err = style.Delete()
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3053,
			"desc": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code": 1000,
		"desc": "success",
	})
}

// 更新
func (t *Style) Update(ctx *gin.Context) {
	var (
		style model.Style
	)

	err := ctx.BindJSON(&style)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3040,
			"desc": err.Error(),
		})
		return
	}

	err = style.Update()
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3052,
			"desc": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code": 1000,
		"desc": "success",
	})
}

// 风格列表
func (t *Style) List(ctx *gin.Context) {
	var (
		style model.Style
		param dto.Request
	)

	err := ctx.BindJSON(&param)
	if nil != err {
		util.Fail(3040, err.Error(), ctx)
		return
	}

	ret, cnt, err := style.List(param)
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

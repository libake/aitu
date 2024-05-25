package handler

import (
	"net/http"

	"aitu.cn/internal/dto"
	"aitu.cn/internal/model"
	"aitu.cn/util"
	"github.com/gin-gonic/gin"
)

type Category struct {
}

// 新增
func (t *Category) Create(ctx *gin.Context) {
	var (
		category model.Category
	)

	err := ctx.BindJSON(&category)
	if nil != err {
		util.Fail(3040, err.Error(), ctx)
		return
	}

	err = category.Create()
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

func (t *Category) Delete(ctx *gin.Context) {
	var (
		param struct {
			ID []int64 `json:"id"`
		}
		category model.Category
	)

	err := ctx.BindJSON(&param)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3040,
			"desc": err.Error(),
		})
		return
	}

	err = category.Delete()
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
func (t *Category) Update(ctx *gin.Context) {
	var (
		category model.Category
	)

	err := ctx.BindJSON(&category)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3040,
			"desc": err.Error(),
		})
		return
	}

	err = category.Update()
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

// 分类列表
func (t *Category) List(ctx *gin.Context) {
	var (
		category model.Category
		param    dto.Request
	)

	err := ctx.BindJSON(&param)
	if nil != err {
		util.Fail(3040, err.Error(), ctx)
		return
	}

	ret, cnt, err := category.List(param)
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

package handler

import (
	"net/http"

	"aitu.cn/internal/dto"
	"aitu.cn/internal/model"
	"aitu.cn/util"
	"github.com/gin-gonic/gin"
)

type Template struct {
}

// 新增
func (t *Template) Create(ctx *gin.Context) {
	var (
		template model.Template
	)

	err := ctx.BindJSON(&template)
	if nil != err {
		util.Fail(3040, err.Error(), ctx)
		return
	}

	err = template.Create()
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

func (t *Template) Delete(ctx *gin.Context) {
	var (
		param struct {
			ID []int64 `json:"id"`
		}
		template model.Template
	)

	err := ctx.BindJSON(&param)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3040,
			"desc": err.Error(),
		})
		return
	}

	err = template.Delete()
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
func (t *Template) Update(ctx *gin.Context) {
	var (
		template model.Template
	)

	err := ctx.BindJSON(&template)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3040,
			"desc": err.Error(),
		})
		return
	}

	err = template.Update()
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

// 模板列表
func (t *Template) List(ctx *gin.Context) {
	var (
		template model.Template
		param    dto.Request
	)

	err := ctx.BindJSON(&param)
	if nil != err {
		util.Fail(3040, err.Error(), ctx)
		return
	}

	ret, cnt, err := template.List(param)
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

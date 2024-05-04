package util

import (
	"net/http"
	"reflect"

	"github.com/gin-gonic/gin"
)

type Response struct {
	Data     interface{}
	Total    int64
	Pages    int32
	PageSize int
}

// 处理成功响应
func Ok(dt interface{}, ctx *gin.Context) {
	var (
		temp  interface{}
		total int64
		pages int32
	)

	v := reflect.ValueOf(dt)
	t := reflect.TypeOf(dt)
	for i := 0; i < v.NumField(); i++ {
		switch t.Field(i).Name {
		case "Data":
			temp = v.Field(i).Interface()
		case "Pages":
			pages = v.Field(i).Interface().(int32)
		case "Total":
			total = v.Field(i).Interface().(int64)
		}
	}

	if temp == nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 1000,
			"desc": "Success",
		})
		return
	}

	if 0 < total {
		data := make(map[string]interface{})
		data["list"] = temp
		data["total"] = total
		data["pages"] = pages
		ctx.JSON(http.StatusOK, gin.H{
			"code": 1000,
			"data": data,
			"desc": "Success",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code": 1000,
		"data": temp,
		"desc": "Success",
	})
}

// 处理失败响应
func Fail(code int32, desc string, ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{
		"code": code,
		"desc": desc,
	})
}

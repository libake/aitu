package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	db "aitu.cn/internal/database"
	"aitu.cn/internal/dto"
	"aitu.cn/internal/model"
	"github.com/gin-gonic/gin"
	"google.golang.org/grpc/status"
)

// 节点
type Node struct {
	Context context.Context
}

// 新增节点
func (t *Node) Create(ctx *gin.Context) {
	var (
		node model.Node
	)

	err := ctx.BindJSON(&node)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3040,
			"desc": err.Error(),
		})
		return
	}
	err = node.Create(node)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3040,
			"desc": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code": 1000,
		"desc": "Success",
	})
}

// 更新节点
func (t *Node) Update(ctx *gin.Context) {
	var (
		node model.Node
	)

	err := ctx.BindJSON(&node)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3040,
			"desc": err.Error(),
		})
		return
	}

	err = node.Update(node)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3040,
			"desc": err.Error(),
		})
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code": 1000,
		"desc": "Success",
	})
}

// 修改排序
func (t *Node) SetSort(ctx *gin.Context) {
	var (
		node model.Node
	)

	err := ctx.BindJSON(&node)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3040,
			"desc": err.Error(),
		})
		return
	}

	err = node.SetSort(node)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3040,
			"desc": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code": 1000,
		"desc": "Success",
	})
}

// 修改状态
func (t *Node) SetStatus(ctx *gin.Context) {
	var (
		node model.Node
	)

	err := ctx.BindJSON(&node)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3040,
			"desc": err.Error(),
		})
		return
	}

	err = node.SetStatus()
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3040,
			"desc": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code": 1000,
		"desc": "Success",
	})
}

// 节点列表
func (t *Node) List(ctx *gin.Context) {
	var (
		node  model.Node
		param struct {
			dto.Request
		}
	)

	err := ctx.BindJSON(&param)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3040,
			"desc": err.Error(),
		})
		return
	}

	ret, err := node.List(param.Request)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3040,
			"desc": err.Error(),
		})
		return
	}

	temp := node.NewTree(ret, 0, 0)
	ctx.JSON(http.StatusOK, gin.H{
		"code": 1000,
		"data": temp,
		"desc": "Success",
	})
}

// 删除节点
func (t Node) Delete(ctx *gin.Context) {
	var (
		node model.Node
	)

	err := ctx.BindJSON(&node)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3040,
			"desc": err.Error(),
		})
		return
	}

	err = node.Delete()
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3040,
			"desc": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code": 1000,
		"desc": "Success",
	})
}

// 权限
func (t Node) Permission(args []byte) (data []byte, err error) {
	var (
		userID      int32
		sPermission string
		node        model.Node
		param       dto.Request
	)

	err = json.Unmarshal(args, &param)
	if err != nil {
		err = status.Error(3040, err.Error())
		return
	}

	userID = 1
	field := fmt.Sprintf("%v", userID)
	sPermission, _ = db.NewRedis().HGet("permission", field).Result()
	if sPermission != "" {
		data = []byte(sPermission)
		return
	}
	ret, err := node.Permission(userID, param)
	if err != nil {
		return
	}
	tree := node.NewTree(ret, 0, 0)
	data, _ = json.Marshal(tree)
	db.NewRedis().HSet("permission", field, string(data))

	return
}

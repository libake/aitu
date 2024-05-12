package handler

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"time"

	"aitu.cn/internal/dto"
	"aitu.cn/internal/model"
	"aitu.cn/util"
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
)

type Output struct {
	Results    []map[string]string `json:"results"`
	TaskID     string              `json:"task_id"`
	TaskStatus string              `json:"task_status"`
}

type Task struct {
	Output Output `json:"output"`
	Usage  struct {
		ImageCount int `json:"image_count"`
	} `json:"usage"`
}

// 文本生成图像
func (t *Task) Create(ctx *gin.Context) {
	var (
		task model.Task
	)

	err := ctx.BindJSON(&task)
	if nil != err {
		util.Fail(3040, err.Error(), ctx)
		return
	}
	body, _ := json.Marshal(task)

	req, err := http.NewRequest(http.MethodPost, "https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis", bytes.NewBuffer(body))
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": -2,
			"desc": "创建请求失败",
		})
		return
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", viper.GetString("aliyun.api-key"))
	req.Header.Set("X-DashScope-Async", "enable")

	cli := &http.Client{Timeout: 5 * time.Second}
	res, err := cli.Do(req)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": -2,
			"desc": "发送请求失败",
		})
		return
	}
	defer res.Body.Close()

	resBody, err := io.ReadAll(res.Body)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": -1,
			"desc": "读取响应失败",
		})
		return
	}

	err = json.Unmarshal(resBody, &t)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": -1,
			"desc": "参数解析失败",
		})
		return
	}
	task.TaskID = t.Output.TaskID
	task.TaskStatus = t.Output.TaskStatus
	task.UserID = 1
	err = task.Create()
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": -1,
			"desc": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code": 1000,
		"data": t,
		"desc": "Success",
	})
}

func (t *Task) Delete(ctx *gin.Context) {
	var (
		param struct {
			ID []int64 `json:"id"`
		}
		task model.Task
	)

	err := ctx.BindJSON(&param)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": -2,
			"desc": err.Error(),
		})
		return
	}

	err = task.Delete(param.ID)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": -2,
			"desc": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code": 1000,
		"desc": "Success",
	})
}

func (t *Task) Info(ctx *gin.Context) {
	var (
		param struct {
			ID     string `form:"id"`
			TaskID string `form:"taskId"`
		}
		task model.Task
	)

	err := ctx.BindQuery(&param)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": -2,
			"desc": err.Error(),
		})
		return
	}
	body, _ := json.Marshal(param)

	url := `https://dashscope.aliyuncs.com/api/v1/tasks/` + param.TaskID
	req, err := http.NewRequest(http.MethodGet, url, bytes.NewBuffer(body))
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": -2,
			"desc": "创建请求失败",
		})
		return
	}
	req.Header.Set("Authorization", viper.GetString("aliyun.api-key"))

	cli := &http.Client{Timeout: 5 * time.Second}
	res, err := cli.Do(req)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": -2,
			"desc": "发送请求失败",
		})
		return
	}
	defer res.Body.Close()

	resBody, err := io.ReadAll(res.Body)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": -1,
			"desc": "读取响应失败",
		})
		return
	}

	json.Unmarshal(resBody, &t)
	if t.Output.TaskStatus != "SUCCEEDED" {
		ctx.JSON(http.StatusOK, gin.H{
			"code": -1,
			"desc": "未知任务",
		})
		return
	}

	task.TaskID = param.TaskID
	task.TaskStatus = t.Output.TaskStatus
	task.Results = t.Output.Results
	err = task.Update()
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": -1,
			"desc": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code": 1000,
		"data": t.Output,
		"desc": "Success",
	})
}

// 文本生成图像
func (t *Task) List(ctx *gin.Context) {
	var (
		task  model.Task
		param dto.Request
	)

	err := ctx.BindJSON(&param)
	if nil != err {
		util.Fail(3040, err.Error(), ctx)
		return
	}

	ret, cnt, err := task.List(param)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3010,
			"desc": err.Error(),
		})
		return
	}
	data := make(map[string]interface{})
	data["total"] = cnt
	data["list"] = ret

	ctx.JSON(http.StatusOK, gin.H{
		"code": 1000,
		"data": data,
		"desc": "Success",
	})
}

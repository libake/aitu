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

type Aigc struct {
}

func (t Aigc) Task(ctx *gin.Context) {
	var (
		param struct {
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

	var ret dto.TaskResp
	json.Unmarshal(resBody, &ret)
	if ret.Output.TaskStatus != "SUCCEEDED" {
		ctx.JSON(http.StatusOK, gin.H{
			"code": -1,
			"desc": "未知任务",
		})
		return
	}

	task.TaskStatus = ret.Output.TaskStatus
	task.Results = ret.Output.Results
	err = task.Update()
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": -1,
			"desc": err.Error(),
		})
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code": 1000,
		"data": ret.Output,
		"desc": "Success",
	})
}

// type Input struct {
// 	Prompt string `json:"prompt"`
// }

// 文本生成图像
func (t *Aigc) Text2image(ctx *gin.Context) {
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

	// ret := make(map[string]interface{})
	var ret dto.TaskResp
	err = json.Unmarshal(resBody, &ret)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": -1,
			"desc": "参数解析失败",
		})
		return
	}
	task.TaskID = ret.Output.TaskID
	task.TaskStatus = ret.Output.TaskStatus
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
		"data": ret,
		"desc": "Success",
	})
}

// 首页推荐
func (t Aigc) Recommend(ctx *gin.Context) {
	var (
		param struct {
			LastId   int64 `json:"lastId"`
			PageSize int64 `json:"pageSize"`
		}
	)

	err := ctx.BindJSON(&param)
	if nil != err {
		util.Fail(3040, err.Error(), ctx)
		return
	}
	body, _ := json.Marshal(param)

	url := `https://wanxiang.aliyun.com/wanx/api/square/recommend`
	req, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(body))
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": -2,
			"desc": "创建请求失败",
		})
		return
	}
	req.Header.Set("Content-Type", "application/json")

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

	ret := make(map[string]interface{})
	json.Unmarshal(resBody, &ret)

	ctx.JSON(http.StatusOK, gin.H{
		"code": 1000,
		"data": ret,
		"desc": "Success",
	})
}

// 相似图像生成
func (a Aigc) ImageGen(ctx *gin.Context) {
	var (
		param struct {
			Model string `json:"model"`
			// Input Input  `json:"input"`
		}
	)

	err := ctx.BindJSON(&param)
	if nil != err {
		util.Fail(3040, err.Error(), ctx)
		return
	}
	body, _ := json.Marshal(param)

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

	ret := make(map[string]interface{})
	json.Unmarshal(resBody, &ret)

	ctx.JSON(http.StatusOK, gin.H{
		"code": 1000,
		"data": ret,
		"desc": "Success",
	})
}

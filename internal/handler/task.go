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

type Task struct {
}

func (t *Task) Info(ctx *gin.Context) {
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

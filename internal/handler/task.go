package handler

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"time"

	"aitu.cn/internal/dto"
	"aitu.cn/internal/middleware"
	"aitu.cn/internal/model"
	"aitu.cn/util"
	"github.com/gin-gonic/gin"
	"github.com/mitchellh/mapstructure"
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
		n    int32
	)

	err := ctx.BindJSON(&task)
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
	task.UserID = user.ID

	n, err = t.checkPower(task)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3040,
			"desc": err.Error(),
		})
		return
	}

	url := "https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis"
	body, _ := json.Marshal(task)
	err = t.newRequest(url, body, ctx)
	if err != nil {
		return
	}
	task.TaskID = t.Output.TaskID
	task.TaskStatus = t.Output.TaskStatus

	err = task.Create(n)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3051,
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

// 艺术字
func (t *Task) WordArt(ctx *gin.Context) {
	var (
		task model.Task
		n    int32
	)

	err := ctx.BindJSON(&task)
	if nil != err {
		util.Fail(3040, err.Error(), ctx)
		return
	}

	user, err := middleware.ParseToken(ctx)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3073,
			"desc": err.Error(),
		})
		return
	}
	task.UserID = user.ID

	n, err = t.checkPower(task)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3040,
			"desc": err.Error(),
		})
		return
	}

	url := "https://dashscope.aliyuncs.com/api/v1/services/aigc/wordart/texture"
	body, _ := json.Marshal(task)
	err = t.newRequest(url, body, ctx)
	if err != nil {
		return
	}
	task.TaskID = t.Output.TaskID
	task.TaskStatus = t.Output.TaskStatus

	err = task.Create(n)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3051,
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

func (t *Task) newRequest(url string, body []byte, ctx *gin.Context) (err error) {
	req, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(body))
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 2031,
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
			"code": 2032,
			"desc": "发送请求失败",
		})
		return
	}
	defer res.Body.Close()

	resBody, err := io.ReadAll(res.Body)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 2033,
			"desc": "读取响应失败",
		})
		return
	}

	err = json.Unmarshal(resBody, &t)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3040,
			"desc": "参数解析失败",
		})
		return
	}
	return nil
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
			"code": 3040,
			"desc": err.Error(),
		})
		return
	}

	err = task.Delete(param.ID)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3053,
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
			"code": 3040,
			"desc": err.Error(),
		})
		return
	}
	body, _ := json.Marshal(param)

	url := `https://dashscope.aliyuncs.com/api/v1/tasks/` + param.TaskID
	req, err := http.NewRequest(http.MethodGet, url, bytes.NewBuffer(body))
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 2031,
			"desc": "创建请求失败",
		})
		return
	}
	req.Header.Set("Authorization", viper.GetString("aliyun.api-key"))

	cli := &http.Client{Timeout: 5 * time.Second}
	res, err := cli.Do(req)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 2032,
			"desc": "发送请求失败",
		})
		return
	}
	defer res.Body.Close()

	resBody, err := io.ReadAll(res.Body)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 2033,
			"desc": "读取响应失败",
		})
		return
	}

	json.Unmarshal(resBody, &t)
	if t.Output.TaskStatus != "SUCCEEDED" {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 2050,
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
			"code": 3052,
			"desc": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code": 1000,
		"data": task,
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
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3040,
			"desc": err.Error(),
		})
		return
	}

	user, err := middleware.ParseToken(ctx)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3073,
			"desc": err.Error(),
		})
		return
	}
	task.UserID = user.ID

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

// 首页推荐
func (t Task) Recommend(ctx *gin.Context) {
	var (
		param dto.Request
		task  model.Task
	)

	err := ctx.BindJSON(&param)
	if nil != err {
		util.Fail(3040, err.Error(), ctx)
		return
	}

	ret, total, err := task.Recommend(param)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3010,
			"desc": err.Error(),
		})
		return
	}
	data := make(map[string]interface{})
	data["total"] = total
	tmp := make([]model.TaskUser, 0)
	// 手机号脱敏
	for _, v := range ret {
		v.Mobile = v.Mobile[:3] + "****" + v.Mobile[7:]
		tmp = append(tmp, v)
	}
	data["list"] = tmp

	ctx.JSON(http.StatusOK, gin.H{
		"code": 1000,
		"data": data,
		"desc": "Success",
	})
}

// 检查能量值
func (t *Task) checkPower(task model.Task) (n int32, err error) {
	var (
		parameters struct {
			N int32 `json:"n"`
		}
		user model.User
	)

	err = mapstructure.Decode(task.Parameters, &parameters)
	if nil != err {
		err = errors.New("解析 parameters 失败")
		return
	}
	user.ID = task.UserID
	err = user.Info()
	if parameters.N > user.Power {
		err = errors.New("能量值不够")
		return
	}
	n = parameters.N
	return
}

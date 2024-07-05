package handler

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"time"

	db "aitu.cn/internal/database"
	"aitu.cn/internal/model"
	"github.com/gin-gonic/gin"
)

type Common struct {
}

func (c Common) SendSms(ctx *gin.Context) {
	var (
		params struct {
			Mobile string `json:"mobile"`
			Scene  int    `json:"scene"`
		}
		user   model.User
		smsReq struct {
			Code  string `json:"code"`
			Phone string `json:"phone"`
		}
	)

	err := ctx.BindJSON(&params)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 4010,
			"desc": `参数错误：` + err.Error(),
		})
		return
	}

	switch params.Scene {
	case 1: // 短信登录
		user.Mobile = params.Mobile
		err = user.AccountExist()
		if err != nil {
			ctx.JSON(http.StatusOK, gin.H{
				"code": 4015,
				"desc": "不存在此手机号",
			})
			return
		}

	}

	smsReq.Code = fmt.Sprintf("%4v", rand.New(rand.NewSource(time.Now().UnixNano())).Int31n(10000))
	smsReq.Phone = params.Mobile
	body, _ := json.Marshal(smsReq)
	url := `https://www.design999.com/home/user/send_sms_ai`
	req, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(body))
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 2031,
			"desc": "创建请求失败",
		})
		return
	}
	req.Header.Set("Content-Type", "application/json")

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

	var resStruct struct {
		Code int16  `json:"code"`
		Msg  string `json:"msg"`
	}

	json.Unmarshal(resBody, &resStruct)
	if resStruct.Code != 1 {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 2050,
			"desc": "短信发送失败",
		})
		return
	}

	err = db.NewRedis().Set(params.Mobile, smsReq.Code, 5*time.Minute).Err()
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3062,
			"desc": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code": 1000,
		"desc": "Success",
	})
}

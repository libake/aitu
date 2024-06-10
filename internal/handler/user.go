package handler

import (
	"crypto/md5"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"regexp"
	"time"

	db "aitu.cn/internal/database"
	"aitu.cn/internal/dto"
	"aitu.cn/internal/model"
	"aitu.cn/util"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"google.golang.org/grpc/status"
)

type User struct {
}

// 登录
func (t *User) SignIn(ctx *gin.Context) {
	var (
		user  model.User
		param struct {
			Account  string `json:"account"`
			Mode     int8   `json:"mode"`
			Password string `json:"password"`
			Captcha  string `json:"captcha"`
		}
		token  string
		scheme string
	)

	err := ctx.BindJSON(&param)
	if nil != err {
		util.Fail(3040, err.Error(), ctx)
		return
	}

	reg := regexp.MustCompile(`\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*`)
	if reg.MatchString(param.Account) {
		user.Email = param.Account
	} else {
		user.Mobile = param.Account
	}

	// 0-密码登录，1-验证码登录
	switch param.Mode {
	case 1:
		captcha, _ := db.NewRedis().Get(param.Account).Result()
		if captcha == "" || param.Captcha != captcha {
			ctx.JSON(http.StatusOK, gin.H{
				"code": 3040,
				"desc": "验证码不正确",
			})
			return
		}

		// 不存在即注册
		err := user.AccountExist()
		if err != nil {
			user, err = user.Create()
			if err != nil {
				ctx.JSON(http.StatusOK, gin.H{
					"code": 3040,
					"desc": "注册失败",
				})
				return
			}
		} else {
			err := user.Info()
			if err != nil {
				ctx.JSON(http.StatusOK, gin.H{
					"code": 3040,
					"desc": "账号不存在",
				})
				return
			}
		}
	default:
		user.Password = param.Password
		err := user.Info()
		if err != nil {
			ctx.JSON(http.StatusOK, gin.H{
				"code": 3040,
				"desc": "账号或密码不正确",
			})
			return
		}
	}

	if user.Status == 0 {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3040,
			"desc": "账号已被冻结",
		})
		return
	}

	// 区分前后台用户
	header := ctx.Request.Header
	if v, ok := header["Scheme"]; ok {
		scheme = v[0]
	}

	if scheme == "admin" && user.ID > 10 {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 4101,
			"desc": "非后台用户",
		})
		return
	}

	token = uuid.NewString()
	user.UpdateAt = time.Now()
	s, _ := json.Marshal(user)
	db.NewRedis().HSet("token", token, string(s))

	data := make(map[string]interface{})
	data["info"] = user
	data["token"] = token

	ctx.JSON(http.StatusOK, gin.H{
		"code": 1000,
		"data": data,
		"desc": "Success",
	})
}

// 用户注册
func (t *User) SignUp(ctx *gin.Context) {
	var (
		user  model.User
		param struct {
			Email    string `json:"email"`
			Mobile   string `json:"mobile"`
			Captcha  string `json:"captcha"`
			Password string `json:"password"`
		}
	)

	err := ctx.BindJSON(&param)
	if err != nil {
		util.Fail(-1, err.Error(), ctx)
		return
	}

	// 检验邮箱，手机号是否已注册
	user.Email = param.Email
	user.Mobile = param.Mobile
	err = user.AccountExist()
	if err == nil {
		util.Fail(4016, "Account Already Exists", ctx)
		return
	}

	// 发送短信验证码
	if param.Captcha == "" {
		code := rand.Intn(10000)
		db.NewRedis().Set(param.Mobile, code, 300*time.Second)
		// TODO 接入短信接口
		ctx.JSON(http.StatusOK, gin.H{
			"code": 1000,
			"data": code,
			"desc": "Success",
		})
		return
	}

	// 验证短信验证码
	captcha, err := db.NewRedis().Get(param.Mobile).Result()
	if nil != err || param.Captcha != captcha {
		util.Fail(4017, "无效验证码", ctx)
		return
	}

	// 生成token并存入redis
	token := uuid.NewString()
	ret, _ := json.Marshal(param)
	db.NewRedis().Set(token, string(ret), 30*time.Minute)

	// 发送激活邮件
	url := fmt.Sprintf("http://api.aitu.cn/user/active?token=%s", token)
	subject := "请激活你的喵闪AI账号"
	body := fmt.Sprintf(`
<!doctype html>
<html lang="zh-CN">
    <head>
        <title>喵闪AI注册</title>
    </head>
    <body style="width: 600px;margin: 0 auto;">
        <div>你好！</div>
        <div style="margin-top: 20px;">
            <p>感谢你注册喵闪AI账号。</p>
            <p>你的登录邮箱为：<a href="mailto:%s">%s</a>。请点击以下链接激活帐号：</p>
            <p style="margin: 20px 0;">
                <a href="%s">%s</a>
            </p>
            <p>如果以上链接无法点击，请将上面的地址复制到你的浏览器(如chrome)的地址栏进入喵闪AI。（该链接在24小时内有效，24小时后需要重新注册）</p>
            <div style="display: flex;margin-top: 30px;">
				<div style="width: 100px;">
					<img src="">
				</div>
				<div style="flex: 1;">
					<h3>Aitu Team</h3>
					<a href="mailto:service@haxima.com">service@haxima.com</a>
				</div>
            </div>
        </div>
    </body>
</html>
`, param.Email, param.Email, url, url)
	err = util.SendMail(param.Email, subject, body, "html")
	if nil != err {
		util.Fail(2021, "Email Send Fail", ctx)
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code": 1000,
		"data": token,
		"desc": "Success",
	})
}

// 邮件激活
func (t *User) Active(ctx *gin.Context) {
	var (
		user  model.User
		param struct {
			Token string `form:"token"`
		}
	)

	err := ctx.BindQuery(&param)
	if nil != err {
		util.Fail(-1, err.Error(), ctx)
		return
	}

	// 校验token
	info, err := db.NewRedis().Get(param.Token).Result()
	if nil != err {
		util.Fail(3030, "Token invalid", ctx)
		return
	}

	err = json.Unmarshal([]byte(info), &user)
	if err != nil {
		return
	}
	ret, err := user.Create()
	if nil != err || ret.ID == 0 {
		util.Fail(3030, "写入数据失败，请重新注册获取激活链接！", ctx)
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"code": 1000,
		"data": ret,
		"desc": "Success",
	})
}

// 忘记密码
func (t *User) Forget(ctx *gin.Context) {
	var (
		user model.User
	)

	err := ctx.BindJSON(&user)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3040,
			"desc": err.Error(),
		})
		return
	}

	err = user.AccountExist()
	if err != nil {
		return
	}

	// 生成token并存入redis
	str := fmt.Sprintf("%v %v", user.Email, time.Now())
	ha := md5.Sum([]byte(str))
	token := fmt.Sprintf("%x", ha)
	db.NewRedis().Set(user.Email, token, 30*time.Minute)

	// 发送重置密码邮件
	url := fmt.Sprintf("http://api.aitu.cn/user/reset?email=%v&token=%v", user.Email, token)
	subject := "重置密码通知"
	body := fmt.Sprintf(`
	<!doctype html>
	<html lang="zh-CN">
		<head>
			<title>重置密码</title>
		</head>
		<body style="width: 600px;margin: 0 auto;">
			<div>你好！</div>
			<div style="margin-top: 20px;">
				<p>您刚刚在喵闪AI使用了找回密码功能。</p>
				<p>请在30分钟内点击下面链接设置您的新密码：</p>
				<p style="margin: 20px 0;">
					<a href="%s">重置密码</a>
				</p>
				<p>如果以上链接无法点击，请将复制以下链接至浏览器(如chrome)的地址栏直接打开。</p>
				<p>
					<a href="%s">%s</a>
				</p>
				<p>如果您不知道为什么收到了这封邮件，可能是他人不小心输错邮箱意外发给了您，请忽略此邮件。</p>
			</div>
		</body>
	</html>
	`, url, url, url)
	err = util.SendMail(user.Email, subject, body, "html")
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 2021,
			"desc": "邮件发送失败",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code": 1000,
		"desc": "Success",
	})
}

// 重置密码
func (t User) Reset(args []byte) (err error) {
	var (
		user  model.User
		param struct {
			Account  string `json:"account"`
			Password string `json:"password"`
			Token    string `json:"token"`
		}
		token string
	)

	err = json.Unmarshal(args, &param)
	if err != nil {
		return
	}

	// 校验token
	token, err = db.NewRedis().Get(param.Account).Result()
	if err != nil || param.Token != token {
		return status.Error(3030, "Token invalid")
	}
	if util.IsEmail(param.Account) {
		user.Email = param.Account
	} else {
		user.Mobile = param.Account
	}
	user.Password = param.Password
	err = user.Passwd()

	return
}

// 用户详情
func (t *User) Info(ctx *gin.Context) {
	var (
		user model.User
		req  struct {
			ID int64 `form:"id"`
		}
		validate *validator.Validate
	)

	// 参数绑定
	err := ctx.ShouldBind(&req)
	if err != nil {
		util.Fail(3040, err.Error(), ctx)
		return
	}

	// 参数验证
	validate = validator.New()
	err = validate.Struct(&req)
	if err != nil {
		util.Fail(4010, err.Error(), ctx)
		return
	}

	if req.ID > 0 {
		// 指定用户
		user.ID = req.ID
		err = user.Info()
		if err != nil {
			util.Fail(3010, err.Error(), ctx)
			return
		}
	} else {
		// 解析 token 取得 id
		token := ctx.Request.Header.Get("Access-Token")
		sToken, err := db.NewRedis().HGet("token", token).Result()
		if err != nil {
			ctx.JSON(http.StatusOK, gin.H{
				"code": -1,
				"desc": "token 不存在",
			})
			return
		}
		json.Unmarshal([]byte(sToken), &user)
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code": 1000,
		"data": user,
		"desc": "Success",
	})
}

// 用户列表
func (t *User) List(ctx *gin.Context) {
	var (
		user  model.User
		param dto.Request
	)

	err := ctx.BindJSON(&param)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 3040,
			"desc": err.Error(),
		})
		return
	}

	ret, cnt, err := user.List(param)
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

func (u User) Logout(ctx *gin.Context) {
	var (
		token string
	)

	header := ctx.Request.Header
	if v, ok := header["Access-Token"]; ok {
		token = v[0]
	}
	db.NewRedis().HDel("token", token)

	ctx.JSON(http.StatusOK, gin.H{
		"code": 1000,
		"desc": "Success",
	})
}

package util

import (
	"context"
	"encoding/base64"
	"fmt"
	"math/rand"
	"net"
	"net/mail"
	"net/smtp"
	"reflect"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/spf13/viper"
)

// 获取服务器IP
func GetServerIP() string {
	conn, err := net.Dial("udp", "google.com:80")
	if err != nil {
		fmt.Println(err.Error())
		return ""
	}
	defer conn.Close()
	return strings.Split(conn.LocalAddr().String(), ":")[0]
}

// 获取客户端IP
func GetClientIP(c context.Context) string {
	// if ip := c.Request.Header.Get("X-Forwarded-For"); ip != "" {
	// 	ips := strings.Split(ip, ",")
	// 	if len(ips) > 0 && ips[0] != "" {
	// 		rip := strings.Split(ips[0], ":")
	// 		return rip[0]
	// 	}
	// }
	// ip := strings.Split(c.Request.RemoteAddr, ":")
	// if len(ip) > 0 {
	// 	if ip[0] != "[" {
	// 		return ip[0]
	// 	}
	// }
	return "127.0.0.1"
}

// 获取Ip地址详细信息
func GetIPAddress(ip string) map[string]interface{} {
	IPAddress := make(map[string]interface{})
	return IPAddress
}

// 是否是email
func IsEmail(email string) bool {
	if email == "" {
		return false
	}
	ok, _ := regexp.MatchString(`^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[0-9a-zA-Z]{2,3}$`, email)
	return ok
}

// Html过滤
func HTML2str(html string) string {
	src := string(html)
	//替换HTML的空白字符为空格
	re := regexp.MustCompile(`\s`) //ns*r
	src = re.ReplaceAllString(src, " ")
	//将HTML标签全转换成小写
	re, _ = regexp.Compile(`\\<[\\S\\s]+?\\>`)
	src = re.ReplaceAllStringFunc(src, strings.ToLower)
	//去除STYLE
	re, _ = regexp.Compile(`\\<style[\\S\\s]+?\\</style\\>`)
	src = re.ReplaceAllString(src, "")
	//去除SCRIPT
	re, _ = regexp.Compile(`\\<script[\\S\\s]+?\\</script\\>`)
	src = re.ReplaceAllString(src, "")
	//去除所有尖括号内的HTML代码,并换成换行符
	re, _ = regexp.Compile(`\\<[\\S\\s]+?\\>`)
	src = re.ReplaceAllString(src, "\n")
	//去除连续的换行符
	re, _ = regexp.Compile(`\\s{2,}`)
	src = re.ReplaceAllString(src, "\n")
	return strings.TrimSpace(src)
}

// 按字节截取字符串 utf-8不乱码
func Substr(str string, length int64) string {
	bs := []byte(str)[:length]
	bl := 0
	for i := len(bs) - 1; i >= 0; i-- {
		switch {
		case bs[i] >= 0 && bs[i] <= 127:
			return string(bs[:i+1])
		case bs[i] >= 128 && bs[i] <= 191:
			bl++
		case bs[i] >= 192 && bs[i] <= 253:
			cl := 0
			switch {
			case bs[i]&252 == 252:
				cl = 6
			case bs[i]&248 == 248:
				cl = 5
			case bs[i]&240 == 240:
				cl = 4
			case bs[i]&224 == 224:
				cl = 3
			default:
				cl = 2
			}
			if bl+1 == cl {
				return string(bs[:i+cl])
			}
			return string(bs[:i])
		}
	}
	return ""
}

// 解析布尔
func ParseBool(str string) (bool, error) {
	switch str {
	case "1", "t", "T", "true", "TRUE", "True", "on", "yes", "ok":
		return true, nil
	case "", "0", "f", "F", "false", "FALSE", "False", "off", "no":
		return false, nil
	}

	// strconv.NumError mimicing exactly the strconv.ParseBool(..) error and type
	// to ensure compatibility with std library and beyond.
	return false, &strconv.NumError{Func: "ParseBool", Num: str, Err: strconv.ErrSyntax}
}

// struct转map
func StructToMap(obj interface{}) map[string]interface{} {
	t := reflect.TypeOf(obj)
	v := reflect.ValueOf(obj)
	fmt.Println(t.NumField())
	var data = make(map[string]interface{})
	for i := 0; i < t.NumField(); i++ {
		data[t.Field(i).Name] = v.Field(i).Interface()
	}
	return data
}

// 首字母大写
func FirstToUpper(str string) string {
	var (
		s string
		a []string
	)

	aStr := strings.Split(str, " ")
	for _, v := range aStr {
		tmp := strings.ToUpper(v[:1])
		tmp += v[1:]
		a = append(a, tmp)
	}
	s = strings.Join(a, " ")

	return s
}

// 发送邮件
func SendMail(toMail, subject, body, typ string) error {
	b64 := base64.NewEncoding("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/")

	host := viper.GetString("email.host")
	user := viper.GetString("email.user")
	password := viper.GetString("email.password")
	// t.Port = viper.GetInt("email.port")

	from := mail.Address{Name: "日抓云", Address: user} // 发件人
	to := mail.Address{Name: "", Address: toMail}    // 收件人

	header := make(map[string]string)
	header["From"] = from.String()
	header["To"] = to.String()
	header["Subject"] = fmt.Sprintf("=?UTF-8?B?%s?=", b64.EncodeToString([]byte(subject)))
	header["MIME-Version"] = "1.0"
	header["Content-Type"] = "text/html; charset=UTF-8"
	header["Content-Transfer-Encoding"] = "base64"

	message := ""
	for k, v := range header {
		message += fmt.Sprintf("%s: %s\r\n", k, v)
	}
	message += "\r\n" + b64.EncodeToString([]byte(body))

	hp := strings.Split(host, ":")
	auth := smtp.PlainAuth("", user, password, hp[0])
	err := smtp.SendMail(host, auth, user, []string{to.Address}, []byte(message))
	return err
}

var defaultLetters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")

// 返回一个固定长度的随机字符串
func RandomString(n int, allowedChars ...[]rune) string {
	var letters []rune

	if len(allowedChars) == 0 {
		letters = defaultLetters
	} else {
		letters = allowedChars[0]
	}

	b := make([]rune, n)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}

	return string(b)
}

/*
获取传入的时间所在年份的第一天，即某年第一天的0点
如传入time.Now(), 返回当前年份的第一天0点时间
*/
func FirstDayYear(d time.Time) time.Time {
	d = d.AddDate(0, 0, -d.Day()+1)
	return ZeroTime(d)
}

/*
获取传入的时间所在月份的第一天，即某月第一天的0点
如传入time.Now(), 返回当前月份的第一天0点时间
*/
func FirstDayMonth(d time.Time) time.Time {
	d = d.AddDate(0, 0, -d.Day()+1)
	return ZeroTime(d)
}

// 获取传入的时间所在年份的最后一天，即某年最后一天的23点59分59秒
// 如传入time.Now(), 返回当前年份的最后一天23:59:59时间
func LastDayYear(d time.Time) time.Time {
	d = FirstDayYear(d).AddDate(0, 12, -1)
	return TwentyThreeTime(d)
}

// 获取传入的时间所在月份的最后一天，即某月最后一天的23点59分59秒
// 如传入time.Now(), 返回当前月份的最后一天0点时间。
func LastDayMonth(d time.Time) time.Time {
	d = FirstDayMonth(d).AddDate(0, 1, -1)
	return TwentyThreeTime(d)
}

// 获取某一天的0点时间
func ZeroTime(d time.Time) time.Time {
	return time.Date(d.Year(), d.Month(), d.Day(), 0, 0, 0, 0, d.Location())
}

// 获取某一天的23:59:59时间
func TwentyThreeTime(d time.Time) time.Time {
	return time.Date(d.Year(), d.Month(), d.Day(), 23, 59, 59, 0, d.Location())
}

package main

import (
	"fmt"

	"aitu.cn/etc"
	"aitu.cn/internal/router"
	"github.com/spf13/viper"
)

func init() {
	// 配置
	var cfg etc.Config
	cfg.LoadFile()
}

func main() {
	// 载入路由并启动服务
	host := viper.GetString("host")
	port := viper.GetInt("port")
	addr := fmt.Sprintf("%s:%d", host, port)
	router.Router(addr)
}

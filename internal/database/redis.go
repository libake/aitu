package database

import (
	"fmt"
	"log"

	"github.com/spf13/viper"
	"gopkg.in/redis.v4"
)

type Redis struct {
}

func NewRedis() *redis.Client {
	host := viper.GetString("redis.host")
	port := viper.GetInt("redis.port")
	password := viper.GetString("redis.password")
	address := fmt.Sprintf("%s:%d", host, port)
	client := redis.NewClient(&redis.Options{
		Addr:     address,
		Password: password,
		DB:       0,
	})
	// 通过 cient.Ping() 来检查是否成功连接到了 redis 服务器
	pong, err := client.Ping().Result()
	if nil != err {
		log.Println(err, pong)
	}
	return client
}

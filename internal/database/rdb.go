package database

import (
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
	_ "github.com/lib/pq"

	"github.com/spf13/viper"
	"xorm.io/xorm"
)

type Rdb struct {
	host     string
	port     int
	user     string
	password string
	dbname   string
}

// 数据库初始化
func NewRdb() *xorm.Engine {
	var (
		sourceName string
		engine     *xorm.Engine
		err        error
	)
	rdb := Rdb{
		host:     viper.GetString("database.master.host"),
		port:     viper.GetInt("database.master.port"),
		user:     viper.GetString("database.master.user"),
		password: viper.GetString("database.master.password"),
		dbname:   viper.GetString("database.master.name"),
	}
	tp := viper.GetString("database.type")
	switch tp {
	case "postgres":
		sourceName = fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", rdb.host, rdb.port, rdb.user, rdb.password, rdb.dbname)
		engine, err = xorm.NewEngine("postgres", sourceName)
	case "mysql":
		sourceName = fmt.Sprintf("%s:%s@/%s?charset=utf8", rdb.user, rdb.password, rdb.dbname)
		engine, err = xorm.NewEngine("mysql", sourceName)
	}

	if err != nil {
		log.Fatal(err.Error())
		return nil
	}
	engine.ShowSQL(true)
	return engine
}

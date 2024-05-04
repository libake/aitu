package database

import (
	"fmt"
	"log"

	_ "github.com/lib/pq"
	"github.com/spf13/viper"
	"xorm.io/xorm"
)

type Postgres struct {
	host     string
	port     int
	user     string
	password string
	dbname   string
}

// 数据库初始化
func NewPostgres() *xorm.Engine {
	postgres := Postgres{
		host:     viper.GetString("database.master.host"),
		port:     viper.GetInt("database.master.port"),
		user:     viper.GetString("database.master.user"),
		password: viper.GetString("database.master.password"),
		dbname:   viper.GetString("database.master.name"),
	}
	sourceName := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", postgres.host, postgres.port, postgres.user, postgres.password, postgres.dbname)
	engine, err := xorm.NewEngine("postgres", sourceName)
	if err != nil {
		log.Fatal(err.Error())
		return nil
	}
	engine.ShowSQL(true)
	return engine
}

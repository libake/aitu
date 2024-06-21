package etc

import (
	"flag"

	"github.com/spf13/viper"
)

// 配置
type Config struct {
}

// 加载配置文件
func (t *Config) LoadFile() {
	var file string
	flag.StringVar(&file, "c", "../etc/config.yaml", "配置文件")
	flag.StringVar(&file, "config", "../etc/config.yaml", "配置文件")
	flag.Parse()
	viper.SetConfigFile(file)
	err := viper.ReadInConfig()
	if err != nil {
		panic(err)
	}
}

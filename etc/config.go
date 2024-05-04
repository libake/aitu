package etc

import (
	"fmt"

	"github.com/spf13/viper"
)

// 配置
type Config struct {
}

// LoadFile 加载配置文件
func (t *Config) LoadFile() {
	// pwd, _ := os.Getwd()
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("../etc")
	err := viper.ReadInConfig()
	if err != nil {
		err = fmt.Errorf("Fatal error config file: %s", err)
		panic(err)
	}
}

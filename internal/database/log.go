package database

import (
	"fmt"
	"os"
	"path"

	"github.com/sirupsen/logrus"
)

func ToFile() {
	filePath, _ := os.Getwd()
	fileName := path.Join(filePath, "storage/log/err.log")

	//设置output,默认为stderr,可以为任何io.Writer，比如文件*os.File
	file, err := os.OpenFile(fileName, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if nil != err {
		fmt.Println(err)
	}

	log := logrus.New()

	log.Out = file
	log.SetLevel(logrus.DebugLevel)

	log.SetFormatter(&logrus.TextFormatter{})

	//设置最低loglevel
	// logrus.SetLevel(logrus.InfoLevel)
}

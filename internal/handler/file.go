package handler

import (
	"fmt"
	"mime/multipart"
	"os"
	"path"
	"time"

	"aitu.cn/util"
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"google.golang.org/grpc/status"
)

type File struct {
	Ext []string
}

// 上传
func (t *File) Upload(ctx *gin.Context) {
	var (
		dst interface{}
		err error
	)

	batch := ctx.PostForm("batch")
	if batch == "true" {
		t.multi(ctx)
	} else {
		dst, err = t.single(ctx)
	}

	if err != nil {
		s, _ := status.FromError(err)
		e := s.Proto()
		util.Fail(e.Code, e.Message, ctx)
		return
	}
	res := util.Response{
		Data: dst,
	}
	util.Ok(res, ctx)
}

// 单文件上传
func (t *File) single(ctx *gin.Context) (dst string, err error) {
	f, _ := ctx.FormFile("file")

	if !t.checkSize(f) {
		err = status.Error(4011, "The file exceeds the specified size")
		return
	}
	// suffix := filepath.Ext(f.Filename)
	if !t.checkExt(f) {
		err = status.Error(4012, "Invalid file format")
		return
	}
	now := time.Now()
	ymd := fmt.Sprintf("%d/%d/%d/", now.Year(), now.Month(), now.Day())
	fp := ".." + viper.GetString("upload.path") + ymd
	os.Mkdir(fp, os.ModePerm)
	dst = path.Join(fp, f.Filename)
	err = ctx.SaveUploadedFile(f, dst)
	if err != nil {
		err = status.Error(4013, "Save File Fail")
	}
	dst = viper.GetString("upload.path") + ymd + f.Filename

	return
}

// 多文件上传
func (t *File) multi(ctx *gin.Context) {
	form, err := ctx.MultipartForm()
	if err != nil {
		return
	}
	files := form.File["file"]
	for _, v := range files {

		fmt.Println(v.Filename)
	}
}

// 校验类型
func (t *File) checkExt(f *multipart.FileHeader) bool {
	var flag bool

	fileType := f.Header.Get("Content-Type")
	if len(t.Ext) == 0 {
		t.Ext = []string{"image/jpeg", "image/png"}
	}
	// ext := [...]string{"image/jpeg", "image/png"}
	for _, v := range t.Ext {
		if v == fileType {
			flag = true
		}
	}

	return flag
}

// 校验大小
func (t *File) checkSize(f *multipart.FileHeader) bool {
	return f.Size < 2048000
}

// 下载
func (t *File) Download() {

}

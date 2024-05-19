package model

import (
	"errors"
	"strings"
	"time"

	db "aitu.cn/internal/database"
	"aitu.cn/internal/dto"
)

// 分类
type Category struct {
	ID       int64     `xorm:"pk autoincr id" json:"id"`
	Code     string    `xorm:"code varchar(64)" json:"code" validate:"required"`
	Name     string    `xorm:"name varchar(64)" json:"name" validate:"required"`
	Type     string    `xorm:"type varchar(64)" json:"type"`
	Sort     int8      `xorm:"sort int" json:"sort"`
	Status   int8      `xorm:"status int" json:"status"`
	UpdateAt time.Time `xorm:"update_at datetime" json:"updateAt"`
	CreateAt time.Time `xorm:"create_at datetime" json:"createAt"`
}

// 设定表名
func (t *Category) TableName() string {
	return "category"
}

// 新增分类
func (t *Category) Create() error {
	t.CreateAt = time.Now()
	t.UpdateAt = time.Now()
	t.Status = 1
	row, err := db.NewPostgres().Insert(t)
	if err != nil || row == 0 {
		err = errors.New("create fail")
	}
	return err
}

// 更新分类
func (t *Category) Update() error {
	t.UpdateAt = time.Now()
	row, err := db.NewPostgres().Where("id=?", t.ID).Update(t)
	if nil != err || row == 0 {
		err = errors.New("update fail")
	}
	return err
}

// 更新排序
func (t *Category) SetSort() error {
	row, err := db.NewPostgres().Where("id=?", t.ID).Update(t)
	if nil != err || row == 0 {
		err = errors.New("update fail")
	}

	return err
}

// 更新状态
func (t *Category) SetStatus() error {
	row, err := db.NewPostgres().Cols("status").Where("id=?", t.ID).Update(t)
	if nil != err || row == 0 {
		err = errors.New("update fail")
	}

	return err
}

// 删除分类
func (t *Category) Delete() error {
	row, err := db.NewPostgres().Delete(t)
	if nil != err || row == 0 {
		err = errors.New("delete fail")
	}
	return err
}

// 分类列表
func (t *Category) List(req dto.Request) (list []Category, err error) {
	var (
		query string
		args  []interface{}
	)

	for _, v := range req.QueryBy {
		switch v.Col {
		case "name":
			query += " AND name LIKE ?"
			args = append(args, v.Val.(string)+"%")
		case "type":
			query += " AND type=?"
			args = append(args, v.Val)
		case "code":
			query += " AND code=?"
			args = append(args, v.Val)
		}
	}
	query = strings.TrimLeft(query, " AND")

	err = db.NewPostgres().Where(query, args...).OrderBy("sort").Find(&list)
	if len(list) == 0 {
		err = errors.New("is empty")
	}
	return
}

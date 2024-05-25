package model

import (
	"errors"
	"strings"
	"time"

	db "aitu.cn/internal/database"
	"aitu.cn/internal/dto"
)

// 风格
type Style struct {
	ID         int64     `xorm:"pk autoincr id" json:"id"`
	Code       string    `xorm:"code varchar(64)" json:"code" validate:"required"`
	Name       string    `xorm:"name varchar(64)" json:"name" validate:"required"`
	Cover      string    `xorm:"cover varchar(64)" json:"cover"`
	Type       string    `xorm:"type varchar(64)" json:"type"`
	Hot        int8      `xorm:"hot int" json:"hot"`
	CategoryID int64     `xorm:"category_id int" json:"categoryId"`
	Sort       int8      `xorm:"sort int" json:"sort"`
	Status     int8      `xorm:"status int" json:"status"`
	UpdateAt   time.Time `xorm:"update_at datetime" json:"updateAt"`
	CreateAt   time.Time `xorm:"create_at datetime" json:"createAt"`
}

// 设定表名
func (t *Style) TableName() string {
	return "style"
}

// 新增分类
func (t *Style) Create() error {
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
func (t *Style) Update() error {
	t.UpdateAt = time.Now()
	row, err := db.NewPostgres().Where("id=?", t.ID).Update(t)
	if nil != err || row == 0 {
		err = errors.New("update fail")
	}
	return err
}

// 更新排序
func (t *Style) SetSort() error {
	row, err := db.NewPostgres().Where("id=?", t.ID).Update(t)
	if nil != err || row == 0 {
		err = errors.New("update fail")
	}

	return err
}

// 更新状态
func (t *Style) SetStatus() error {
	row, err := db.NewPostgres().Cols("status").Where("id=?", t.ID).Update(t)
	if nil != err || row == 0 {
		err = errors.New("update fail")
	}

	return err
}

// 删除分类
func (t *Style) Delete() error {
	row, err := db.NewPostgres().Delete(t)
	if nil != err || row == 0 {
		err = errors.New("delete fail")
	}
	return err
}

// 分类列表
func (t *Style) List(req dto.Request) (list []Style, total int64, err error) {
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
		case "hot":
			query += " AND hot=?"
			args = append(args, v.Val)
		case "categoryId":
			query += " AND category_id=?"
			args = append(args, v.Val)
		}
	}
	query = strings.TrimLeft(query, " AND")

	db := db.NewPostgres()
	// 统计条数
	user := new(Style)
	total, err = db.Where(query, args...).Count(user)
	if err != nil {
		return
	}
	if total > 0 {
		// 分页数据
		offset := (req.CurrPage - 1) * req.PageSize
		err = db.Where(query, args...).OrderBy("sort").Limit(req.PageSize, offset).Find(&list)
	} else {
		err = errors.New("is empty")
	}
	return
}

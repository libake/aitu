package model

import (
	"errors"
	"strings"
	"time"

	db "aitu.cn/internal/database"
	"aitu.cn/internal/dto"
)

// 模板
type Template struct {
	ID         int64     `xorm:"pk autoincr id" json:"id"`
	Code       string    `xorm:"code varchar(64)" json:"code" validate:"required"`
	Name       string    `xorm:"name varchar(64)" json:"name" validate:"required"`
	InnerImage string    `xorm:"inner_image text" json:"innerImage"`
	OuterImage string    `xorm:"outer_image text" json:"outerImage"`
	Sort       int8      `xorm:"sort int" json:"sort"`
	Status     int8      `xorm:"status int" json:"status"`
	CategoryID int64     `xorm:"category_id int" json:"categoryId"`
	UpdateAt   time.Time `xorm:"update_at datetime" json:"updateAt"`
	CreateAt   time.Time `xorm:"create_at datetime" json:"createAt"`
}

// 设定表名
func (t *Template) TableName() string {
	return "category"
}

// 新增模板
func (t *Template) Create() error {
	t.CreateAt = time.Now()
	t.UpdateAt = time.Now()
	t.Status = 1
	row, err := db.NewPostgres().Insert(t)
	if err != nil || row == 0 {
		err = errors.New("create fail")
	}
	return err
}

// 更新模板
func (t *Template) Update() error {
	t.UpdateAt = time.Now()
	row, err := db.NewPostgres().Where("id=?", t.ID).Update(t)
	if nil != err || row == 0 {
		err = errors.New("update fail")
	}
	return err
}

// 更新排序
func (t *Template) SetSort() error {
	row, err := db.NewPostgres().Where("id=?", t.ID).Update(t)
	if nil != err || row == 0 {
		err = errors.New("update fail")
	}

	return err
}

// 更新状态
func (t *Template) SetStatus() error {
	row, err := db.NewPostgres().Cols("status").Where("id=?", t.ID).Update(t)
	if nil != err || row == 0 {
		err = errors.New("update fail")
	}

	return err
}

// 删除模板
func (t *Template) Delete() error {
	row, err := db.NewPostgres().Delete(t)
	if nil != err || row == 0 {
		err = errors.New("delete fail")
	}
	return err
}

// 模板列表
func (t *Template) List(req dto.Request) (list []Template, total int64, err error) {
	var (
		query string
		args  []interface{}
	)

	for _, v := range req.QueryBy {
		switch v.Col {
		case "name":
			query += " AND name LIKE ?"
			args = append(args, v.Val.(string)+"%")
		case "code":
			query += " AND code=?"
			args = append(args, v.Val)
		case "categoryId":
			query += " AND category_id=?"
			args = append(args, v.Val)
		}
	}
	query = strings.TrimLeft(query, " AND")

	db := db.NewPostgres()
	// 统计条数
	user := new(Template)
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

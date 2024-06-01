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
	ID         int64     `xorm:"pk autoincr id" json:"id"`
	Code       string    `xorm:"code varchar(64)" json:"code" validate:"required"`
	Name       string    `xorm:"name varchar(64)" json:"name" validate:"required"`
	Icon       string    `xorm:"icon text" json:"icon"`
	InnerImage string    `xorm:"inner_image text" json:"innerImage"`
	OuterImage string    `xorm:"outer_image text" json:"outerImage"`
	Prompt     []string  `xorm:"prompt json" json:"prompt"`
	Sort       int8      `xorm:"sort int" json:"sort"`
	Scene      string    `xorm:"scene varchar(64)" json:"scene"`
	Status     int8      `xorm:"status int" json:"status"`
	ParentID   int64     `xorm:"parent_id int" json:"parentId"`
	UpdateAt   time.Time `xorm:"update_at datetime" json:"updateAt"`
	CreateAt   time.Time `xorm:"create_at datetime" json:"createAt"`
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
func (t *Category) List(req dto.Request) (list []Category, total int64, err error) {
	var (
		query string
		args  []interface{}
	)

	for _, v := range req.QueryBy {
		switch v.Col {
		case "name":
			query += " AND name LIKE ?"
			args = append(args, v.Val.(string)+"%")
		case "scene":
			query += " AND scene=?"
			args = append(args, v.Val)
		case "code":
			query += " AND code=?"
			args = append(args, v.Val)
		case "parentId":
			query += " AND parent_id=?"
			args = append(args, v.Val)
		}
	}
	query = strings.TrimLeft(query, " AND")

	db := db.NewPostgres()
	// 统计条数
	user := new(Category)
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

// 节点树型
type CategoryTree struct {
	Category
	Level    int8           `json:"level"`
	Leaf     bool           `json:"leaf"`
	Children []CategoryTree `json:"children"`
}

// 节点树
func (t *Category) NewTree(node []Category, parentID int64, level int8) []CategoryTree {
	var arr []CategoryTree
	level += 1
	for _, v := range node {
		if parentID == v.ParentID {
			tmp := CategoryTree{}
			tmp.ID = v.ID
			tmp.Code = v.Code
			tmp.Icon = v.Icon
			tmp.Name = v.Name
			tmp.Scene = v.Scene
			tmp.Sort = v.Sort
			tmp.InnerImage = v.InnerImage
			tmp.OuterImage = v.OuterImage
			tmp.Prompt = v.Prompt
			tmp.ParentID = v.ParentID
			tmp.Status = v.Status
			tmp.UpdateAt = v.UpdateAt
			tmp.CreateAt = v.CreateAt
			tmp.Level = level
			child := t.NewTree(node, v.ID, level)
			tmp.Children = child
			if len(child) == 0 {
				tmp.Children = make([]CategoryTree, 0)
				tmp.Leaf = true
			} else {
				tmp.Leaf = false
			}
			arr = append(arr, tmp)
		}
	}
	return arr
}

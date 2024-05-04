package model

import (
	"errors"
	"fmt"
	"strings"
	"time"

	db "aitu.cn/internal/database"
	"aitu.cn/internal/dto"
)

// 节点
type Node struct {
	ID       int64     `xorm:"pk autoincr id" json:"id"`
	Icon     string    `xorm:"icon text" json:"icon"`
	Name     string    `xorm:"name varchar(128)" json:"name" validate:"required"`
	Meta     string    `xorm:"meta text" json:"meta"`
	Type     int8      `xorm:"type int" json:"type"`
	ParentID int64     `xorm:"parent_id int" json:"parentId"`
	Sort     int8      `xorm:"sort int" json:"sort"`
	Scope    string    `xorm:"scope varchar(16)" json:"scope"`
	Status   int8      `xorm:"status int" json:"status"`
	UpdateAt time.Time `xorm:"update_at datetime" json:"updateAt"`
	CreateAt time.Time `xorm:"create_at datetime" json:"createAt"`
}

// 设定表名
func (t *Node) TableName() string {
	return "node"
}

// 新增节点
func (t *Node) Create(node Node) error {
	node.CreateAt = time.Now()
	node.UpdateAt = time.Now()
	node.Status = 1
	row, err := db.NewPostgres().Insert(&node)
	if err != nil || row == 0 {
		fmt.Println(err.Error())
		err = errors.New("create fail")
	}
	return err
}

// 更新节点
func (t *Node) Update(node Node) error {
	node.UpdateAt = time.Now()
	row, err := db.NewPostgres().UseBool("enable").Where("id=?", node.ID).Update(&node)
	if nil != err || row == 0 {
		err = errors.New("update fail")
	}
	return err
}

// 更新排序
func (t *Node) SetSort(node Node) error {
	row, err := db.NewPostgres().Where("id=?", node.ID).Update(&node)
	if nil != err || row == 0 {
		err = errors.New("update fail")
	}

	return err
}

// 更新状态
func (t *Node) SetStatus() error {
	var node Node

	node.Status = t.Status
	row, err := db.NewPostgres().Cols("status").Where("id=?", t.ID).Update(&node)
	if nil != err || row == 0 {
		err = errors.New("update fail")
	}

	return err
}

// 删除节点
func (t *Node) Delete() error {
	var (
		node Node
	)
	node.ID = t.ID
	row, err := db.NewPostgres().Delete(&node)
	if nil != err || row == 0 {
		err = errors.New("delete fail")
	}
	return err
}

// 节点列表
func (t *Node) List(req dto.Request) (list []Node, err error) {
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
		case "scope":
			query += " AND scope=?"
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

// 角色节点
func (t *Node) ListByRole(roleID int64, req dto.Request) (list []Node, err error) {
	var (
		query string
		args  []interface{}
	)

	query = "b.role_id=?"
	args = append(args, roleID)
	for _, v := range req.QueryBy {
		switch v.Col {
		case "name":
			query += " AND a.name LIKE ?"
			args = append(args, v.Val.(string)+"%")
		}
	}

	db := db.NewPostgres().Alias("a").Join("LEFT", "role_node AS b", "b.node_id=a.id")
	err = db.Where(query, args...).Find(&list)
	if len(list) == 0 {
		err = errors.New("is empty")
	}

	return
}

// 节点树型
type NodeTree struct {
	Node
	Level    int8       `json:"level"`
	Leaf     bool       `json:"leaf"`
	Children []NodeTree `json:"children"`
}

// 节点树
func (t *Node) NewTree(node []Node, parentID int64, level int8) []NodeTree {
	var arr []NodeTree
	level += 1
	for _, v := range node {
		if parentID == v.ParentID {
			tmp := NodeTree{}
			tmp.ID = v.ID
			tmp.Meta = v.Meta
			tmp.ParentID = v.ParentID
			tmp.Icon = v.Icon
			tmp.Name = v.Name
			tmp.Type = v.Type
			tmp.Sort = v.Sort
			tmp.Scope = v.Scope
			tmp.Status = v.Status
			tmp.UpdateAt = v.UpdateAt
			tmp.CreateAt = v.CreateAt
			tmp.Level = level
			child := t.NewTree(node, v.ID, level)
			tmp.Children = child
			if len(child) == 0 {
				tmp.Leaf = true
			} else {
				tmp.Leaf = false
			}
			arr = append(arr, tmp)
		}
	}
	return arr
}

// 权限
func (t *Node) Permission(userID int32, req dto.Request) (list []Node, err error) {
	var (
		query string
		args  []interface{}
	)

	query = "c.user_id=?"
	args = append(args, userID)
	for _, v := range req.QueryBy {
		switch v.Col {
		case "type":
			query += " AND a.type=?"
			args = append(args, v.Val)
		case "scope":
			query += " AND a.scope LIKE ?"
			args = append(args, v.Val.(string)+"%")
		}
	}

	db := db.NewPostgres().Alias("a").Join("LEFT", "role_node AS b", "b.node_id=a.id").Join("LEFT", "role_user AS c", "c.role_id=b.role_id")
	err = db.Where(query, args...).Find(&list)
	if len(list) == 0 {
		err = errors.New("is empty")
	}

	return

}

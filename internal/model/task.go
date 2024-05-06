package model

import (
	"errors"
	"strings"
	"time"

	db "aitu.cn/internal/database"
	"aitu.cn/internal/dto"
	"aitu.cn/util"
)

// 任务
type Task struct {
	ID         int64               `xorm:"id pk autoincr" json:"id"`
	Model      string              `xorm:"model varchar(64)" json:"model"`
	Input      map[string]string   `xorm:"input json notnull" json:"input"`
	Parameters map[string]string   `xorm:"parameters json notnull default {}" json:"parameters,omitempty"`
	Results    []map[string]string `xorm:"results json notnull default []" json:"results,omitempty"`
	TaskID     string              `xorm:"task_id varchar(64)" json:"taskId"`
	TaskStatus string              `xorm:"task_status varchar(32)" json:"taskStatus"`
	UserID     int64               `xorm:"user_id int default 0" json:"userId"`
	UpdateAt   time.Time           `xorm:"update_at timestamp" json:"updateAt"`
	CreateAt   time.Time           `xorm:"create_at timestamp" json:"createAt"`
}

// 设定表名
func (t *Task) TableName() string {
	return "task"
}

// 新增任务
func (t *Task) Create() (err error) {
	now := time.Now()
	t.ID = util.NewMist().Generate()
	t.UpdateAt = now
	t.CreateAt = now
	has, err := db.NewPostgres().Insert(t)
	if err != nil || has == 0 {
		err = errors.New(err.Error())
	}

	return
}

// 更新用户
func (t *Task) Update() (err error) {
	_, err = db.NewPostgres().Update(t)
	return
}

// 任务列表
func (t *Task) List(req dto.Request) (list []Task, total int64, err error) {
	var (
		query string
		args  []interface{}
	)

	for _, v := range req.QueryBy {
		switch v.Col {
		case "taskId":
			query += " AND task_id LIKE ?"
			args = append(args, v.Val.(string)+"%")
		case "taskStatus":
			query += " AND task_status=?"
			args = append(args, v.Val)
		}
	}
	query = strings.TrimPrefix(query, " AND ")

	db := db.NewPostgres()
	// 统计条数
	user := new(Task)
	total, err = db.Where(query, args...).Count(user)
	if err != nil {
		return
	}
	if total > 0 {
		// 分页数据
		offset := (req.CurrPage - 1) * req.PageSize
		err = db.Where(query, args...).Limit(req.PageSize, offset).Find(&list)
	} else {
		err = errors.New("is empty")
	}
	return
}

func (t *Task) Info() (info Task, err error) {
	var (
		query string
		args  []interface{}
	)

	query = "id=?"
	args = append(args, t.ID)
	has, err := db.NewPostgres().Where(query, args...).Get(&info)
	if err != nil || !has {
		err = errors.New("is empty")
	}

	return
}

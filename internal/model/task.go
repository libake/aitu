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
	ID         int64                  `xorm:"id pk autoincr" json:"id"`
	Model      string                 `xorm:"model varchar(64)" json:"model"`
	Input      map[string]interface{} `xorm:"input json notnull" json:"input"`
	Parameters map[string]interface{} `xorm:"parameters json notnull default {}" json:"parameters,omitempty"`
	Results    []string               `xorm:"results json notnull default []" json:"results,omitempty"`
	TaskID     string                 `xorm:"task_id varchar(64)" json:"taskId"`
	TaskStatus string                 `xorm:"task_status varchar(32)" json:"taskStatus"`
	TaskType   string                 `xorm:"task_type varchar(128)" json:"taskType"`
	Other      map[string]interface{} `xorm:"other json" json:"other"`
	UserID     int64                  `xorm:"user_id int default 0" json:"userId"`
	UpdateAt   time.Time              `xorm:"update_at timestamp" json:"updateAt"`
	CreateAt   time.Time              `xorm:"create_at timestamp" json:"createAt"`
}

// 设定表名
func (t *Task) TableName() string {
	return "task"
}

// 新增任务
func (t *Task) Create(n int32) (err error) {
	t.CreateAt = time.Now()
	t.ID = util.NewMist().Generate()
	t.UpdateAt = t.CreateAt

	has, err := db.NewRdb().Insert(t)
	if err != nil || has == 0 {
		err = errors.New(err.Error())
	}

	return
}

// 删除任务
func (t *Task) Delete(args []int64) (err error) {
	has, err := db.NewRdb().In("id", args).Delete(t)
	if err != nil || has == 0 {
		err = errors.New("删除失败")
	}

	return
}

// 更新任务
func (t *Task) UpdateResult(n int8) (err error) {
	session := db.NewRdb().NewSession()
	defer session.Close()

	if err = session.Begin(); err != nil {
		err = errors.New("开启事务失败")
		return
	}

	has, err := session.Where("id=? OR task_id=?", t.ID, t.TaskID).Update(t)
	if err != nil || has == 0 {
		err = errors.New("更新失败")
	}

	_, err = session.Exec("update user set power=power-? where id=?", n, t.UserID)
	if err != nil || has == 0 {
		err = errors.New(err.Error())
	}

	err = session.Commit()

	return
}

// 更新任务
func (t *Task) Update() error {
	has, err := db.NewRdb().Where("id=? OR task_id=?", t.ID, t.TaskID).Update(t)
	if err != nil || has == 0 {
		err = errors.New("更新失败")
	}
	return err
}

// 任务列表
func (t *Task) List(req dto.Request) (list []Task, total int64, err error) {
	var (
		query string
		args  []interface{}
	)

	if t.UserID > 10 {
		query = "user_id=?"
		args = append(args, t.UserID)
	}

	for _, v := range req.QueryBy {
		switch v.Col {
		case "taskId":
			query += " AND task_id LIKE ?"
			args = append(args, v.Val.(string)+"%")
		case "taskStatus":
			query += " AND task_status=?"
			args = append(args, v.Val)
		case "taskType":
			query += " AND task_type=?"
			args = append(args, v.Val)
		}
	}
	query = strings.TrimPrefix(query, " AND ")

	db := db.NewRdb()
	// 统计条数
	user := new(Task)
	total, err = db.Where(query, args...).Count(user)
	if err != nil {
		return
	}
	if total > 0 {
		// 分页数据
		offset := (req.CurrPage - 1) * req.PageSize
		err = db.Where(query, args...).OrderBy("update_at DESC").Limit(req.PageSize, offset).Find(&list)
	} else {
		err = errors.New("is empty")
	}
	return
}

// 任务详情
func (t *Task) Info() (info Task, err error) {
	var (
		query string
		args  []interface{}
	)

	query = "id=?"
	args = append(args, t.ID)
	has, err := db.NewRdb().Where(query, args...).Get(&info)
	if err != nil || !has {
		err = errors.New("is empty")
	}

	return
}

type TaskUser struct {
	Task   `xorm:"extends"`
	Mobile string `json:"mobile"`
	Avatar string `json:"avatar"`
}

// 推荐列表
func (t *Task) Recommend(req dto.Request) (list []TaskUser, total int64, err error) {
	var (
		query string
		args  []interface{}
	)

	query = "a.task_status=?"
	args = append(args, "SUCCEEDED")

	db := db.NewRdb()
	// 统计条数
	user := new(Task)
	total, err = db.Alias("a").Where(query, args...).Count(user)
	if err != nil {
		return
	}
	if total > 0 {
		// 分页数据
		offset := (req.CurrPage - 1) * req.PageSize
		err = db.Alias("a").Select("a.*,b.mobile").Join("LEFT", "user AS b", "a.user_id=b.id").Where(query, args...).OrderBy("a.update_at DESC").Limit(req.PageSize, offset).Find(&list)
	} else {
		err = errors.New("is empty")
	}
	return
}

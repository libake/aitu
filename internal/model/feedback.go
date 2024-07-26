package model

import (
	"errors"
	"strings"
	"time"

	db "aitu.cn/internal/database"
	"aitu.cn/internal/dto"
)

// 反馈
type Feedback struct {
	ID       int64     `xorm:"pk autoincr id" json:"id"`
	Content  string    `xorm:"content varchar(64)" json:"content" validate:"required"`
	UserID   int64     `xorm:"user_id int" json:"userId"`
	UpdateAt time.Time `xorm:"update_at datetime" json:"updateAt"`
	CreateAt time.Time `xorm:"create_at datetime" json:"createAt"`
}

// 设定表名
func (t *Feedback) TableName() string {
	return "feedback"
}

// 新增反馈
func (t *Feedback) Create() error {
	t.CreateAt = time.Now()
	t.UpdateAt = time.Now()
	row, err := db.NewRdb().Insert(t)
	if err != nil || row == 0 {
		err = errors.New("create fail")
	}
	return err
}

type FeedbackUser struct {
	Feedback `xorm:"extends"`
	Mobile   string `json:"mobile"`
}

// 模板列表
func (t *Feedback) List(req dto.Request) (list []FeedbackUser, total int64, err error) {
	var (
		query string
		args  []interface{}
	)

	for _, v := range req.QueryBy {
		switch v.Col {
		case "content":
			query += " AND content LIKE ?"
			args = append(args, "%"+v.Val.(string)+"%")
		case "userId":
			query += " AND user_id=?"
			args = append(args, v.Val)
		}
	}
	query = strings.TrimLeft(query, " AND")

	db := db.NewRdb()
	// 统计条数
	feedback := new(Feedback)
	total, err = db.Where(query, args...).Count(feedback)
	if err != nil {
		return
	}
	if total > 0 {
		// 分页数据
		offset := (req.CurrPage - 1) * req.PageSize
		err = db.Alias("a").Select("a.*,b.mobile").Join("LEFT", "user AS b", "b.id=a.user_id").Where(query, args...).OrderBy("id DESC").Limit(req.PageSize, offset).Find(&list)
	} else {
		err = errors.New("is empty")
	}
	return
}

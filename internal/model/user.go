package model

import (
	"errors"
	"regexp"
	"strings"
	"time"

	db "aitu.cn/internal/database"
	"aitu.cn/internal/dto"
	"aitu.cn/util"
	"google.golang.org/grpc/status"
)

// 用户
type User struct {
	ID       int64     `xorm:"id pk autoincr" json:"id"`
	Nickname string    `xorm:"nickname varchar(32)" json:"nickname,omitempty"`
	Mobile   string    `xorm:"mobile varchar(16) notnull unique" json:"mobile"`
	Email    string    `xorm:"email varchar(60) notnull unique" json:"email"`
	Password string    `xorm:"password varchar(32) notnull" json:"password,omitempty"`
	Birthday time.Time `xorm:"birthday date" json:"birthday,omitempty"`
	Gender   int8      `xorm:"gender int" json:"gender"`
	Status   int8      `xorm:"status int default 1" json:"status"`
	UpdateAt time.Time `xorm:"update_at timestamp" json:"updateAt"`
	CreateAt time.Time `xorm:"create_at timestamp" json:"createAt"`
}

// 设定表名
func (t *User) TableName() string {
	return "user"
}

// 新增用户
func (t *User) Create() (info User, err error) {
	info = User{
		ID:       util.NewMist().Generate(),
		Email:    t.Email,
		Mobile:   t.Mobile,
		Password: t.Password,
		UpdateAt: time.Now(),
		CreateAt: time.Now(),
	}
	has, err := db.NewPostgres().Insert(&info)
	if err != nil || has == 0 {
		err = errors.New(err.Error())
	}

	return
}

// 更新用户
func (t *User) Update() (err error) {
	_, err = db.NewPostgres().Update(t)
	return
}

// 重置密码
func (t *User) Passwd() (err error) {
	var (
		user User
		row  int64
	)

	user.Password = t.Password
	row, err = db.NewPostgres().Where("mobile=? OR email=?", t.Mobile, t.Email).Cols("password").Update(&user)
	if err != nil || row == 0 {
		err = status.Error(3052, "Update Fail")
	}
	return
}

// 登录
func (t *User) SignIn(account string) error {
	query := "password=?"
	args := []interface{}{t.Password, account}
	reg := regexp.MustCompile(`\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*`)
	if reg.MatchString(account) {
		query += " AND email=?"
	} else {
		query += " AND mobile=?"
	}

	has, err := db.NewPostgres().Omit("password").Where(query, args...).Get(t)
	if err != nil || !has {
		err = errors.New("is empty")
	}

	return err
}

// 用户列表
func (t *User) List(req dto.Request) (list []User, total int64, err error) {
	var (
		query string
		args  []interface{}
	)

	for _, v := range req.QueryBy {
		switch v.Col {
		case "nickname":
			query += " AND nickname LIKE ?"
			args = append(args, v.Val.(string)+"%")
		case "mobile":
			query += " AND mobile LIKE ?"
			args = append(args, v.Val.(string)+"%")
		case "email":
			query += " AND email LIKE ?"
			args = append(args, v.Val.(string)+"%")
		}
	}
	query = strings.TrimPrefix(query, " AND ")

	db := db.NewPostgres()
	// 统计条数
	user := new(User)
	total, err = db.Where(query, args...).Count(user)
	if err != nil {
		return
	}
	if total > 0 {
		// 分页数据
		offset := (req.CurrPage - 1) * req.PageSize
		err = db.Omit("password").Where(query, args...).Limit(req.PageSize, offset).Find(&list)
	} else {
		err = errors.New("is empty")
	}
	return
}

func (t *User) Info() (info User, err error) {
	var (
		query string
		args  []interface{}
	)

	query = "id=?"
	args = append(args, t.ID)
	has, err := db.NewPostgres().Omit("password").Where(query, args...).Get(&info)
	if err != nil || !has {
		err = errors.New("is empty")
	}

	return
}

// 检查邮箱或手机号是否存在
func (t User) AccountExist() error {
	user := new(User)
	cnt, err := db.NewPostgres().Where("email=? OR mobile=?", t.Email, t.Mobile).Count(user)
	if err != nil || cnt == 0 {
		err = errors.New("not found")
	}
	return err
}

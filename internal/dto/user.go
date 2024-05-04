package dto

import "time"

type User struct {
	ID        int64     `json:"id"`
	Nickname  string    `json:"nickname"`
	Mobile    string    `json:"mobile"`
	Email     string    `json:"email"`
	Password  string    `json:"password,omitempty"`
	Birthday  time.Time `json:"birthday,omitempty"`
	Gender    int8      `json:"gender"`
	AccessKey string    `json:"accessKey,omitempty"`
	SecretKey string    `json:"secretKey,omitempty"`
	Status    int8      `json:"status"`
	UpdateAt  time.Time `json:"updateAt"`
	CreateAt  time.Time `json:"createAt"`
}

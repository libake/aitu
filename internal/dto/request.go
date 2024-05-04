package dto

type Request struct {
	CurrPage int       `json:"currPage"`
	PageSize int       `json:"pageSize"`
	OrderBy  []orderBy `json:"orderBy"`
	Tree     bool      `json:"tree"`
	QueryBy  []queryBy `json:"queryBy"`
	Omit     string    `json:"omit"`
}

type orderBy struct {
	Col string `json:"col"`
	Asc bool   `json:"asc"`
}

type queryBy struct {
	Col string      `json:"col"`
	Val interface{} `json:"val"`
}

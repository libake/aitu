package dto

type TaskResp struct {
	Output Output `json:"output"`
	Usage  struct {
		ImageCount int `json:"image_count"`
	} `json:"usage"`
}

type Output struct {
	Results    []map[string]string `json:"results"`
	TaskID     string              `json:"task_id"`
	TaskStatus string              `json:"task_status"`
}

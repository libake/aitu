BIN_FILE=aitu.cn/bin

build:
	@go build -o "${BIN_FILE}" main.go
	./"${BIN_FILE}"

.PHONY: linux
linux:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o "${BIN_FILE}" main.go

.PHONY: windows
windows:
	CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build -o "${BIN_FILE}.exe" main.go
BIN_FILE=bin/aitu

build:
	@go build -o "${BIN_FILE}" cmd/main.go

.PHONY: linux
linux:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o "${BIN_FILE}" cmd/main.go

.PHONY: windows
windows:
	CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build -o "${BIN_FILE}.exe" cmd/main.go
## 环境准备
安装 golang、nodejs 环境，然后将项目从 gitee 拉取下来，进入项目根目录运行 go get 安装 golang 相关的依赖，安装完成进入 web 下安装前端相关依赖 pnpm i 完成后分别用命令将前后端跑起来。


## 后端打包

在项目根目录下有一个 makefile 的编译配置文件，可以根据平台编译得到对应的二进制可执行文件。
例如要编译 Linux 下的可执行文件运行 make linux 编译完成生成的二制文件在bin下，如下：

```base
cd aitu.cn
make linux

# 运行
nohup ./aitu -c config.yaml &
```

## 前端打包

进入项目根目录的 web 目录下，运行 pnpm build:gly-prod，会在各自目录下生成 dist 目录，将 dist 拷贝到服务器上进行部署。 

```base
cd web
# 前台打包
pnpm build:gly-prod

# 后台打包
pnpm build:adm-prod

```

<p style="color: red">*注：以上命令都是在终端下运行，如果您使用的是 windows 请用git bash(安装了git 的话都带有git bash)，powershell 有些命令是用不了的。</p>

## 全局编码

> 归类编码(10) + 业务编码(00) = 返回码(1000)

返回码|返回描述|英文描述|解决方案
:---:|---|---|---
1000|响应成功|Success|-
|||
2000|接口异常：2000~2999||
2010|系统繁忙/超时|System busy or Request timeout|重新发起请求
2020|发送失败||
2021|邮件发送失败||
2022|短信发送失败||
2040|微服务异常||
2041|方法不存||
|||
3000|数据问题：3000~3999||
3010|数据为空|Is empty|
3020|无权访问|-|联系管理取得权限
3030|登录失效||
3031|cookie失效||
3040|解析异常||
3050|数据库操作||
3051|插入失败||
3052|更新失败||
3053|删除失败||
3054|查询失败||
3060|redis:3060 ~ 3069||
3061|在redis未找到该值||
3062|写入redis失败||
3070|token:3070~3079||
3071|token过期||
3072|token不存在||
3073|非法token||
|||
4000|用户错误：4000~4999||
4010|非法参数|Invalid parameter|
4011|非法的文件格式|Invalid file format|转换文件格式
4012|文件超过限定大小|The file exceeds the specified size|压缩文件
4014|非法的邮箱|Invalid email|
4015|非法的手机号|Invalid mobile|
4016|帐号已存在|Account already exists|
4017|无效验证码|Invalid captcha|
4040|未找到/不存在|not found|
4041|未找到逻辑对象||
4100|用户:4100~4109||
4101|非后台用户||
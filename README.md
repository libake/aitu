全局编码

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
-- 喵闪AI
CREATE DATABASE IF NOT EXISTS "aitu";

-- 用户 - user
DROP TABLE IF EXISTS "user";

CREATE TABLE "user" (
  "id" bigserial not null PRIMARY KEY,
  "nickname" varchar(32) not null default '',
  "mobile" varchar(16) UNIQUE not null,
  "email" varchar(64) not null default '',
  "password" varchar(32) not null,
  "birthday" timestamp,
  "gender" smallint not null default 0,
  "status" smallint not null default 1,
  "last_time" timestamp not null default (now()),
  "power" integer not null default 0,
  "update_at" timestamp not null default (now()),
  "create_at" timestamp not null default (now())
);
COMMENT ON TABLE "user" IS '用户';
COMMENT ON COLUMN "user".nickname IS '用户昵称';
COMMENT ON COLUMN "user".mobile IS '移动电话';
COMMENT ON COLUMN "user".email IS '邮箱';
COMMENT ON COLUMN "user".password IS '登录密码';
COMMENT ON COLUMN "user".birthday IS '邮箱';
COMMENT ON COLUMN "user".gender IS '性别: 0-未知,1-男,2-女';
COMMENT ON COLUMN "user".status IS '0-冻结,1-正常';
COMMENT ON COLUMN "user".last_time IS '最后登录时间';
COMMENT ON COLUMN "user".power IS '能量值';
COMMENT ON COLUMN "user".create_at IS '注册时间';


-- 第三方用户 - oauth
DROP TABLE IF EXISTS "oauth";

CREATE TABLE "oauth" (
  "id" bigserial not null PRIMARY KEY,
  "user_id" bigint not null,
  "type" varchar(16) not null,
  "auth_id" varchar(64) not null,
  "unionid" varchar(128)
);
COMMENT ON TABLE "oauth" IS '用户';
COMMENT ON COLUMN "oauth".user_id IS '用户id';
COMMENT ON COLUMN "oauth".type IS '类型: weibo, qq, wechat';
COMMENT ON COLUMN "oauth".auth_id IS '授权标识: uid, openid';
COMMENT ON COLUMN "oauth".unionid IS 'QQ/微信同一主体下Unionid相同';


-- 节点 - node
DROP TABLE IF EXISTS "node";

CREATE TABLE "node" (
  "id" bigserial not null PRIMARY KEY,
  "icon" text not null default '',
  "name" varchar(90) not null,
  "meta" text not null,
  "type" smallint not null default 1,
  "parent_id" bigint not null default 0,
  "path" text not null default '',
  "sort" smallint not null default 255,
  "scope" varchar(16) not null default 0,
  "status" smallint not null default 1,
  "update_at" timestamp not null default (now()),
  "create_at" timestamp not null default (now())
);
COMMENT ON TABLE node IS '节点';
COMMENT ON COLUMN node.icon IS '图标';
COMMENT ON COLUMN node.name IS '名称';
COMMENT ON COLUMN node.meta IS '元数据:路由,编码';
COMMENT ON COLUMN node.type IS '类型:1-功能,2-菜单,3-操作,4-接口';
COMMENT ON COLUMN node.parent_id IS '上级id';
COMMENT ON COLUMN node.path IS '族谱';
COMMENT ON COLUMN node.sort IS '排序';
COMMENT ON COLUMN node.scope IS '范围';
COMMENT ON COLUMN node.status IS '状态:1-启用,0-禁用';


-- 分类 - category
DROP TABLE IF EXISTS "category";

CREATE TABLE "category" (
  "id" bigserial not null PRIMARY KEY,
  "code" varchar(64) not null default '',
  "name" varchar(64) not null default '',
  "icon" text not null default '',
  "prompt" json not null default '[]',
  "sort" smallint not null default 0,
  "scene" varchar(64) not null default '',
  "status" smallint not null default 1,
  "platform" varchar(32) not null default 'web',
  "parent_id" bigint not null default 0,
  "update_at" timestamp not null default (now()),
  "create_at" timestamp not null default (now())
);
COMMENT ON TABLE category IS '分类';
COMMENT ON COLUMN category.code IS '编码';
COMMENT ON COLUMN category.name IS '名称';
COMMENT ON COLUMN category.icon IS '图标';
COMMENT ON COLUMN category.prompt IS '提示语';
COMMENT ON COLUMN category.sort IS '排序';
COMMENT ON COLUMN category.platform IS '平台';
COMMENT ON COLUMN category.scene IS '场景:text_to_image,word_art_image';
COMMENT ON COLUMN category.status IS '状态:0-禁用,1-启用';
COMMENT ON COLUMN category.parent_id IS '父id';


-- 模板 - template
DROP TABLE IF EXISTS "template";

CREATE TABLE "template" (
  "id" bigserial not null PRIMARY KEY,
  "code" varchar(64) not null default '',
  "name" varchar(64) not null default '',
  "inner_image" text not null default '',
  "outer_image" text not null default '',
  "sort" smallint not null default 0,
  "status" smallint not null default 1,
  "category_id" bigint not null default 0,
  "update_at" timestamp not null default (now()),
  "create_at" timestamp not null default (now())
);
COMMENT ON TABLE template IS '模板';
COMMENT ON COLUMN template.code IS '模板编码';
COMMENT ON COLUMN template.name IS '模板名称';
COMMENT ON COLUMN template.inner_image IS '内部:模板使用';
COMMENT ON COLUMN template.outer_image IS '外部:封面或展示使用';
COMMENT ON COLUMN template.sort IS '排序';
COMMENT ON COLUMN template.status IS '状态:0-禁用,1-启用';
COMMENT ON COLUMN template.category_id IS '归属分类';


-- 任务 - task
DROP TABLE IF EXISTS "task";

CREATE TABLE "task" (
  "id" bigserial not null PRIMARY KEY,
  "model" varchar(256) not null default '',
  "input" json not null default '{}',
  "parameters" json not null default '{}',
  "results" json not null default '[]',
  "task_id" varchar(64) not null default '',
  "task_status" varchar(32) not null default '',
  "task_type" varchar(128) not null default '',
  "user_id" bigint not null default 0,
  "update_at" timestamp not null default (now()),
  "create_at" timestamp not null default (now())
);
COMMENT ON TABLE task IS '任务';
COMMENT ON COLUMN task.model IS '模型:wanx-v1';
COMMENT ON COLUMN task.input IS '输入信息';
COMMENT ON COLUMN task.parameters IS '输入信息';
COMMENT ON COLUMN task.results IS '生成结果';
COMMENT ON COLUMN task.task_id IS '作业任务ID';
COMMENT ON COLUMN task.task_status IS '状态';
COMMENT ON COLUMN task.task_type IS '类型';
COMMENT ON COLUMN task.user_id IS '归属用户';
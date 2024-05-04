-- 喵闪AI
CREATE DATABASE IF NOT EXISTS "aitu";

-- 用户 - user
DROP TABLE IF EXISTS "user";

CREATE TABLE "user" (
  "id" bigserial not null PRIMARY KEY,
  "nickname" varchar(32) not null default '',
  "mobile" varchar(16) UNIQUE not null,
  "email" varchar(64) UNIQUE not null,
  "password" varchar(32) not null,
  "birthday" timestamp,
  "gender" smallint not null default 0,
  "status" smallint not null default 1,
  "last_time" timestamp not null default (now()),
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
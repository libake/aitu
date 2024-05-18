import { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import { Dropdown, message, Popover, Space, Button, Form, Input, Checkbox } from "antd";

import { dao, srv } from "@/core";
import { Icon } from "@/common";
import { Captcha } from "./Captcha";


const Logo = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 52px;
    overflow: hidden;
`;
const Header = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 52px;
    padding: 0 1rem;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 100;
    color: #fff;
    background-color: ${props => props.theme.backgroundColor};

    a {
        color: #838589;
    }

    ul {
        margin-bottom: 0;
        display: flex;

        li {
            margin-left: 2rem;
        }
    }

    .money {
        display: flex;
        gap: 8px;
        padding: 4px 12px;
        border-radius: 20px;
        background-color: #202532;
        cursor: pointer;

        .icon {
            width: 16px;
        }
    }
`;
const NavLeft = styled.nav`
    display: flex;
    align-items: center;
    gap: 32px;

    a {
        color: #838589;

        &:hover {
            color: #b5b6b8;
        }
    }

    .active {
        color: #fff;
    }
`
const Footer = styled.div`
    padding: 32px 0;
    color: #fff;
    background-color: ${props => props.theme.backgroundColor};

    a {
        display: flex;
        padding: 0 0 16px;
        color: #fff;
    }

    .row {
        display: grid;
        justify-items: center;

        img {
            width: 20px;
        }
    }

    .row:nth-child(1) {
        grid-template-columns: repeat(3, 1fr);
    }

    .item {
        text-align: left;
    }

    .info {
        display: flex;
        gap: 16px;
    }
`
const Label = styled.label`
    display: flex;
    margin-bottom: 32px;
`
const NavRight = styled.ul`
    display: flex;
    align-items: center;
    gap: 16px;
`
const Modal = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,.9);
    z-index: 1000;

    label {
        color: #fff;
    }

    input {
        border: none;
        background-color: #141822;
        color: #fff;
    }

    .box {
        padding: 16px;
        border-radius: 20px;
        background-color: #282c38;
    }

    .box-head {
        display: flex;
        justify-content: space-between;
        height: 50px;
    }

    .box-body {
        padding: 24px;
    }

    .link {
        color: #fff;
    }

    .ant-form {
        width: 360px;
    }

    .ant-input-affix-wrapper {
        border: none;
        background-color: #141822;
    }

    .ant-form-item-label >label {
        color: #fff;
    }
`

export function Layout() {
    // 能量值
    let [power, setPower] = useState({
        list: new Array(),
    });

    const getPower = () => {

    }

    useEffect(() => {
        getPower();
    }, []);

    const theme = {
        dark: {
            primaryColor: "#4bfef1", // 主色
            secondaryColor: "#0fbdb4", // 辅色
            linkColor: "#4bfef1", // 链接色
            successColor: "#52c41a", // 成功色
            warningColor: "#faad14", // 警告色
            errorColor: "#f5222d", // 错误色
            fontSize: "14px", // 主字号
            headingColor: "rgba(0,0,0,.85)", // 标题色
            textColor: "rgba(0,0,0,.65)", // 主文本色
            textColorSecondary: "rgba(0,0,0,.45)", // 次文本色
            backgroundColor: "#0b0f14",
        },
    }
    const currentTheme = {
        ...theme.dark,
    }

    const [user, setUser] = useState({
        open: false,
        info: new dao.User(),
        smsTxt: '获取验证码',
        smsDisable: false,
    });
    const [userForm] = Form.useForm();

    const signIn = async () => {
        let valid = await userForm.validateFields().catch(e => console.log(e));
        if (!valid) {
            return;
        }
        let data = {
            ...userForm.getFieldsValue(),
            mode: 1
        };
        let res = await srv.User.signIn(data);
        if (res.code == 1000) {
            localStorage.setItem('token', res.data);
            onModal();
        } else {
            message.error(res.desc);
        }
    }

    const onModal = () => {
        user.open = !user.open;
        setUser({ ...user });
    }

    const logout = () => {
        message.info('退出');
    }

    const content = false ? <>
        <li>
            <Popover className="money" content={<div className="banner">
                <div>
                    <p>剩余能量值</p>
                    <p>50</p>
                </div>
                <Icon src="/icon/menu.svg"></Icon>
            </div>} trigger="click">
                <img className="icon" src="/icon/menu.svg" />
                <span>50能量值</span>
            </Popover>
        </li>
        <li>
            <Dropdown menu={{
                items: [
                    {
                        label: <Link to="/user/profile">我要反馈</Link>,
                        key: 1
                    }, {
                        key: 1 - 2,
                        type: 'divider',
                    }, {
                        key: 5,
                        label: <a onClick={logout}>退出登录</a>
                    }
                ]
            }}>
                <a onClick={(e) => e.preventDefault()}>
                    <Space>
                        张三
                        <i className="iconfont">&#xe66e;</i>
                    </Space>
                </a>
            </Dropdown>
        </li>
    </> : <>
        <Button ghost onClick={() => onModal()}>登录/注册</Button>
    </>;

    return <ThemeProvider theme={currentTheme}>
        <Header>
            <NavLeft>
                <Logo>
                    <img src="" alt="喵闪AI" />
                </Logo>
                <NavLink to="/" end>探索发现</NavLink>
                <NavLink to="/creation">创意作图</NavLink>
                <NavLink to="/wordart">AI艺术字</NavLink>
            </NavLeft>
            <NavRight>
                <li>
                    <Link className="iconfont" to="/news/notice">&#xe649;</Link>
                </li>
                {content}
            </NavRight>
        </Header>
        <Outlet />
        <Footer>
            <div className="row">
                <div className="item">
                    <Label>友情链接</Label>
                    <a href="">aad@service.aliyun.com</a>
                </div>
                <div className="item">
                    <Label>联系我们</Label>
                    <a href="">意见反馈</a>
                    <a href="">联系我们</a>
                </div>
                <div className="item">
                    <Label>关于平台</Label>
                    <a href="">用户协议</a>
                    <a href="">免责声明</a>
                    <a href="">隐私政策</a>
                </div>
            </div>
            <div className="row">
                <p>上述图片属人工智能模型生成，不代表我们的态度或观点。我们不对生成内容做任何保证。</p>
                <div className="info">
                    <a href="http://zjnet.zjamr.zj.gov.cn/bssq.do">
                        <img src="data:image/png;base64,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" alt="" />
                    </a>
                    <a href="https://beian.miit.gov.cn/">浙B2-20080101-4</a>
                </div>
            </div>
        </Footer>
        {/* 登录、注册 */}
        {user.open && <Modal>
            <div className="box">
                <div className="box-head">
                    &nbsp;
                    <div className="close" onClick={() => onModal()}>
                        <Icon src="/icon/menu.svg" />
                    </div>
                </div>
                <div className="box-body">
                    <Form form={userForm} size="large">
                        <Form.Item name="account" label="手机号">
                            <Input />
                        </Form.Item>
                        <Form.Item name="captcha" label="验证码">
                            {/* <Input suffix={
                                <button className="link" onClick={() => sendSms()} disabled={user.smsDisable}>
                                    {user.smsTxt}
                                </button>
                            } /> */}
                            <Captcha mobile={user.info.mobile}></Captcha>
                        </Form.Item>
                        <Form.Item>
                            <Checkbox>登录即视为您已阅读并同意服务条款、隐私政策</Checkbox>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" onClick={() => signIn()} block={true}>
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </Modal>
        }
    </ThemeProvider>
}
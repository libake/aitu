import { useContext, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import { Dropdown, message, Popover, Button } from "antd";

import { srv } from "core";
import { Icon, Captcha } from "@/common";
import { UserContext } from "@/context";
import { bus } from '@/util/mitt';


const Header = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 52px;
    padding: 0 30px;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 100;
    color: #fff;
    background-color: var(--background-color);

    a {
        color: #838589;
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

    .logo {
        height: 22px;

        img {
            height: 100%;
        }
    }
`
const NavRight = styled.ul`
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 0;

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

    button {
        width: 100%;
        background-color: var(--primary-color);
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

        .close {
           cursor: pointer; 
        }
    }

    .box-body {
        display: grid;
        grid-template-rows: auto;
        gap: 24px;
        padding: 24px;
        min-width: 360px;
    }

    .form-item {
        
        input {
            width: 100%;
            min-height: 42px;
            padding: 4px 8px;
            box-sizing: border-box;
            outline: none;
            border-radius: 4px;
        }

        .checkbox {
            display: grid;
            grid-template-columns: auto 1fr;
            align-items: center;
            gap: 8px;

            input {
                width: 16px;
            }

            a {
                color: var(--linkColor);
            }
        }
    }
`

export function Layout() {
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
        agree: false,
        info: {
            account: '',
            mode: 1,
            captcha: '',
        }
    });
    const userContext = useContext(UserContext);

    const signIn = async () => {
        let data = {
            ...user.info,
        };
        let res = await srv.User.signIn(data);
        if (res.code == 1000) {
            userContext.dispatch({
                type: 'login',
                payload: res.data,
            });
            setUser({...user, open: false});
        } else {
            message.error(res.desc);
        }
    }

    const handleChange = (val: any, name: string) => {
        setUser({...user, info: {...user.info, [name]: val.target.value}});
    }

    const logout = async () => {
        let res = await srv.User.logout();
        if (res.code == 1000) {
            userContext.dispatch({
                type: 'logout',
            });
        }
    }

    bus.on('auth', () => {
        setTimeout(() => {
            if (userContext.state.id == 0) {
                user.open = true;
                setUser({...user});
            }
        }, 500);
    });

    return <ThemeProvider theme={currentTheme}>
        <Header>
            <NavLeft>
                <a className="logo">
                    <img src="/logo-text.png" alt="喵闪AI" />
                </a>
                <NavLink to="/" end>探索发现</NavLink>
                <NavLink to="/creation">创意作图</NavLink>
                <NavLink to="/wordart">AI艺术字</NavLink>
            </NavLeft>
            <NavRight>
                {userContext.state.id > 0 ? <>
                    <li>
                        <Popover className="money" trigger="click">
                            <Icon src="/icon/power.svg" />
                            <span>{userContext.state.power}能量值</span>
                        </Popover>
                    </li>
                    <li>
                        <Dropdown menu={{
                            items: [
                                {
                                    label: <Link to="/user/profile">我要反馈</Link>,
                                    key: '1'
                                }, {
                                    key: '1 - 2',
                                    type: 'divider',
                                }, {
                                    key: '2',
                                    label: <a onClick={logout}>退出登录</a>
                                }
                            ]
                        }}>
                            <a onClick={(e) => e.preventDefault()}>
                                <Icon src="/icon/user.svg" />
                            </a>
                        </Dropdown>
                    </li>
                </> : <Button ghost onClick={() => setUser({...user, open: true})}>登录/注册</Button>}
            </NavRight>
        </Header>
        <Outlet />
        {/* 登录、注册 */}
        {user.open && <Modal>
            <div className="box">
                <div className="box-head">
                    &nbsp;
                    <Icon className="close" src="/icon/close-bold.svg" onClick={() => setUser({...user, open: false})} />
                </div>
                <form className="box-body">
                    <div className="form-item">
                        <input value={user.info.account} onChange={(v) => handleChange(v, 'account')} />
                    </div>
                    <div className="form-item">
                        <Captcha value={user.info.captcha} mobile={user.info.account} onChange={(v: React.ChangeEvent<HTMLInputElement>) => handleChange(v, 'captcha')} />
                    </div>
                    <div className="form-item">
                        <span className="checkbox">
                            <input type="checkbox" id="agree" checked={user.agree} onChange={(e) => setUser({...user, agree: !user.agree})} />
                            <label htmlFor="agree">登录即视为您已阅读并同意<Link to="/">服务条款、隐私政策</Link></label>
                        </span>
                    </div>
                    <div className="form-item">
                        <button type="button" onClick={() => signIn()} disabled={!user.agree}>登录</button>
                    </div>
                </form>
            </div>
        </Modal>
        }
    </ThemeProvider>
}
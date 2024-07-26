import { useContext, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import styled from "styled-components";
import { Dropdown, message, Popover, Button } from "antd";

import { dao, srv } from "core";
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

    textarea {
        width: 520px;
        min-height: 100px;
        padding: 16px;
        border: none;
        background-color: #080b13;
        color: var(--text-color);
        outline: none;
    }

    button {
        width: 100%;
        background-color: var(--primary-color);
    }

    .btn {
        display: flex;
        justify-content: flex-end;
    }

    .primary, .default {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 118px;
        border-radius: 20px;
    }

    .default {
        border: 1px solid #fff;
        color: var(--text-color);
        background-color: transparent;
    }

    .box {
        padding: 16px;
        border-radius: 20px;
        background-color: #282c38;
    }

    .box-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;
        color: #fff;

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
        gap: 16px;
        
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
            setUser({ ...user, open: false });
        } else {
            message.error(res.desc);
        }
    }

    const handleChange = (val: any, name: string) => {
        setUser({ ...user, info: { ...user.info, [name]: val.target.value } });
    }

    const logout = async () => {
        let res = await srv.User.logout();
        if (res.code == 1000) {
            userContext.dispatch({
                type: 'logout',
            });
        }
    }

    bus.on('login', () => {
        user.open = true;
        setUser({ ...user });
    });

    const [feedback, setFeedback] = useState({
        info: {
            ...new dao.Feedback(),
        },
        open: false,
    })

    const onFeedback = async () => {
        if (feedback.info.content == '') {
            message.error('请输入反馈内容');
            return;
        }
        let data = {
            ...feedback.info
        }
        let res = await srv.Feedback.create(data);
        if (res.code == 1000) {
            message.success('反馈成功');
            feedback.info = new dao.Feedback();
            setFeedback({ ...feedback, open: false });
        } else {
            message.error(res.desc);
        }
    }

    const onCancel = () => {
        feedback.open = false;
        feedback.info = new dao.Feedback();
        setFeedback({ ...feedback });
    }

    return <>
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
                        <Popover className="money" content="一个能量值可生成一张图">
                            {/* <Icon src="/icon/power.png" /> */}
                            <img src="/power.png" alt="喵闪AI能量值" style={{ width: "18px", height: "18px", marginTop: "3px" }} />
                            <span>{userContext.state.power}能量值</span>
                        </Popover>
                    </li>
                    <li>
                        <Dropdown menu={{
                            items: [
                                {
                                    label: <a onClick={() => setFeedback({ ...feedback, open: true })}>我要反馈</a>,
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
                </> : <Button ghost onClick={() => setUser({ ...user, open: true })}>登录/注册</Button>}
            </NavRight>
        </Header>
        <Outlet />
        {/* 登录、注册 */}
        {user.open && <Modal>
            <div className="box">
                <div className="box-head">
                    &nbsp;
                    <Icon className="close" src="/icon/close-bold.svg" onClick={() => setUser({ ...user, open: false })} />
                </div>
                <form className="box-body">
                    <div className="form-item">
                        <input value={user.info.account} onChange={(v) => handleChange(v, 'account')} placeholder="手机号" />
                    </div>
                    <div className="form-item">
                        <Captcha value={user.info.captcha} mobile={user.info.account} onChange={(v: React.ChangeEvent<HTMLInputElement>) => handleChange(v, 'captcha')} />
                    </div>
                    <div className="form-item">
                        <span className="checkbox">
                            <input type="checkbox" id="agree" checked={user.agree} onChange={(e) => setUser({ ...user, agree: !user.agree })} />
                            <label htmlFor="agree">登录即视为您已阅读并同意<Link to="/">服务条款、隐私政策</Link></label>
                        </span>
                    </div>
                    <div className="form-item">
                        <button type="button" onClick={() => signIn()} disabled={!user.agree}>登录</button>
                    </div>
                </form>
            </div>
        </Modal>}
        {/* 反馈 */}
        {feedback.open && <Modal>
            <div className="box">
                <div className="box-head">
                    <div>感谢您的反馈！</div>
                    <Icon className="close" src="/icon/close-bold.svg" onClick={() => setFeedback({ ...feedback, open: false })} />
                </div>
                <form className="box-body">
                    <div className="form-item">
                        <textarea
                            value={feedback.info.content}
                            onChange={(v) => setFeedback({ ...feedback, info: { ...feedback.info, content: v.target.value } })}
                            placeholder="请输入您的意见或建议"
                        />
                    </div>
                    <div className="form-item btn">
                        <button className="default" type="button" onClick={() => onCancel()}>取消</button>
                        <button className="primary" type="button" onClick={() => onFeedback()}>提交</button>
                    </div>
                </form>
            </div>
        </Modal>}
    </>
}
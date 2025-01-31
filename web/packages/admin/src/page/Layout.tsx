import { useContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Dropdown, Space } from "antd";

import { dao, srv } from "core";
import styled from "styled-components";
import { UserContext } from "@/context";

const Container = styled.div`
    display: grid;
    grid-template-columns: 200px 1fr;
    background-color: #f9f9f9;

    .side {
        min-height: 100vh;
        color: #858585;
        background-color: #333;
    }

    .main {
        background-color: #f0f0f0;
    }

    .content {
        margin: 1rem;
        padding: 1rem;
        background-color: #fff;
    }
`
const Logo = styled.div`
    display: flex;
    align-items: center;
    height: 52px;
    padding: 10px 16px;
    box-sizing: border-box;
    overflow: hidden;

    img {
        height: 100%;
    }
`;
const Header = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 52px;
    padding: 0 1rem;
    background-color: #fff;

    ul {
        margin-bottom: 0;
        display: flex;

        li {
            margin-left: 2rem;
        }
    }
`;
const Menu = styled.ul`
    min-height: calc(100vh - 52px);
    margin-bottom: 0;

    .menu-item {
        line-height: 50px;

        a {
            display: grid;
            grid-template-columns: 20px auto 20px;
            padding: 0 1rem;
            color: #f0f0f0;

            &:hover {
                background-color: #222;
            }

            span {
                margin-left: 8px;
            }
        }

        .active {
            background-color: #222;
        }
    }

    .sub-menu {
        background-color: #222;

        a {
            grid-template-columns: auto;
        }
    }
`;
const Avatar = styled.div`
    min-width: 160px;

    img {
        width: 32px;
        border-radius: 50%;
        margin-right: .5rem;
    }
`;

export function Layout() {
    const navigate = useNavigate();
    const [menu, setMenu] = useState({
        list: new Array<dao.Node>(),
    });
    const [number, setNumber] = useState(0);

    let getMenu = async () => {
        let data = {
            currPage: 1,
            pageSize: 1000,
            tree: true,
            queryBy: [
                { col: 'type', val: 2 },
                { col: 'scope', val: 'adm-web' }
            ]
        };
        let res = await srv.Node.list(data);
        if (res.code == 1000) {
            menu.list = res.data;
        } else {
            menu.list = [];
        }
        setMenu({...menu});
    }

    const userContext = useContext(UserContext);

    const logout = async () => {
        await srv.User.logout();
        userContext.dispatch({
            type: 'logout',
        });
        setTimeout(() => {
            navigate('/auth/signIn');
        }, 500);
    }

    useEffect(() => {
        setTimeout(() => {
            if (userContext.state.id <= 0) {
                navigate('/auth/signIn');
                return;
            }
            getMenu();
        }, 1000);
    }, []);

    return <Container>
        <div className="side">
            <Logo>
                <img src="/logo-text.png" alt="" />
            </Logo>
            <Menu>
                {menu.list.map((e: dao.Node) => {
                    if (e.leaf) {
                        return <li className="menu-item" key={e.id}>
                            <Link to={e.meta}>
                                <i className="iconfont" dangerouslySetInnerHTML={{ __html: e.icon }}></i>
                                <span>{e.name}</span>
                            </Link>
                        </li>
                    } else {
                        let sub = e.children!.map((s) => {
                            return <li className="menu-item" key={s.id}>
                                <Link to={s.meta} style={{ paddingLeft: 23 * s.level! }}>{s.name}</Link>
                            </li>
                        });
                        return <li className="menu-item" key={e.id}>
                            <a className={e.id == 13 ? 'active' : undefined} onClick={() => setNumber(e.id)}>
                                <i className="iconfont" dangerouslySetInnerHTML={{ __html: e.icon }}></i>
                                <span>{e.name}</span>
                                <i className="iconfont" dangerouslySetInnerHTML={{ __html: (number == e.id) ? '&#xe66c;' : '&#xe66e;' }}></i>
                            </a>
                            <ul className="sub-menu" style={{ display: (number == e.id) ? 'block' : 'none' }}>{sub}</ul>
                        </li>
                    }
                })}
            </Menu>
        </div>
        <div className="main">
            <Header>
                <div>&nbsp;</div>
                <ul>
                    {/* <li>
                        <Link className="iconfont" to="/news/notice">&#xe649;</Link>
                    </li> */}
                    <li>
                        <Dropdown menu={{
                            items: [
                                {
                                    key: 0,
                                    type: 'group',
                                    label: <Avatar>
                                        <img src="/avatar/01.jpg" alt="头像" />
                                        {userContext.state.nickname}
                                    </Avatar>,
                                }, {
                                    key: 0 - 2,
                                    type: 'divider',
                                }, {
                                    label: <Link to="/user/profile">基本信息</Link>,
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
                                    {userContext.state.mobile}
                                    <i className="iconfont">&#xe66e;</i>
                                </Space>
                            </a>
                        </Dropdown>
                    </li>
                </ul>
            </Header>
            <Outlet />
        </div>
    </Container>
}
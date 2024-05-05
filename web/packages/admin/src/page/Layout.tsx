import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Dropdown, message, Space } from "antd";

import { dao, srv } from "@/core";
import styled from "styled-components";

const Container = styled.div`
    display: grid;
    grid-template-columns: 200px 1fr;
    background-color: #f9f9f9;

    .side {
        min-width: 260px;
        min-height: 100vh;
        color: #858585;
        background-color: #333;
    }

    .main {
        flex: 1;
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

    const logout = async () => {
        await srv.User.logout();
        localStorage.clear();
        setTimeout(() => {
            navigate('/auth/signIn');
        }, 500)
    }

    useEffect(() => {
        getMenu();
    }, []);

    return <Container>
        <div className="side">
            <Logo>logo</Logo>
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
                    <li>
                        <Link className="iconfont" to="/news/notice">&#xe649;</Link>
                    </li>
                    <li>
                        <Dropdown menu={{
                            items: [
                                {
                                    key: 0,
                                    type: 'group',
                                    label: <Avatar>
                                        <img src="/avatar/01.jpg" alt="头像" />
                                        kim
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
                                    张三
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
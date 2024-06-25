import { useEffect, useState } from "react";
import styled from "styled-components";
import { Spin, message } from "antd";

import { dao, srv } from "core";
import { Icon } from "@/common";
import { Preview } from './Preview';
import { Link } from "react-router-dom";
import { Footer } from "../common";

const Container = styled.div`
    display: grid;
    margin-top: 52px;
    background-color: var(--background-color);
`;
const Title = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 0;
    color: #fff;
    z-index: 100;
    background-color: var(--background-color);

    .logo {
        margin-bottom: 20px;
        height: 48px;

        img {
            height: 100%;
        }
    }

    .slogan {
        font-size: 36px;
        line-height: 50px;
        margin: 0;
    }

    .btn {
        display: flex;
        gap: 28px;
        height: 120px;
        justify-content: center;
        align-items: center;
    }

    .default, .primary {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 56px;
        border-radius: 60px;
        width: 168px;
        cursor: pointer;
    }

    .default {
        border: 1px solid #fff;
        color: #fff;
    }

    .default:hover {
        color: #333;
        background-color: #fff;
    }

    .primary {
        color: #333;
        background-color: var(--primary-color);
    }

    .primary:hover {
        background-color: var(--text-color-secondary);
    }
`
const Content = styled.div`
    display: flex;
    grid-template-columns: repeat(4, 1fr);
    justify-content: center;
    gap: 16px;
    padding: 16px 0;
`
const Card = styled.div`
    border-radius: 12px;
    overflow: hidden;
    width: 300px;
    box-sizing: border-box;

    &:hover {
        border: 1px solid var(--primary-color);
        box-shadow: 0 2px 20px 0 hsla(0,0%,100%,.4);

        .prompt {
            display: block;
        }
    }

    img {
        width: 100%;
    }

    .card-body {
        position: relative;
        min-height: 100px;
    }

    .card-foot {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 52px;
        padding: 12px 20px;
        color: #fff;
        background-color: rgb(120, 99, 94);

        .user {
            display: flex;
            align-items: center;
        }

        .phone {
            margin-left: 10px;
        }

        .avatar {
            width: 26px;
            height: 26px;
            border-radius: 50%;
        }

        .icon {
            display: grid;
            grid-template-columns: auto 1fr;
            align-items: center;
            height: 28px;
            padding: 0 8px;
            font-size: 12px;
            border-radius: 60px;
            border: 1px solid #fff;

            &:hover {
                color: #333;
                background-color: #fff;
            }
        }
    }

    .prompt {
        max-height: 112px;
        padding: 20px;
        font-weight: 400;
        position: absolute;
        bottom: 0;
        left: 0;
        background: linear-gradient(0deg,rgba(38,36,76,.7),rgba(38,36,76,0));
        color: #fff;
        z-index: 10;
        display: none;

        .over-line {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: normal;
        }
    }
`
const Column = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 16px;

    .item {
        cursor: pointer;
    }
`
const Pagination = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 24px;
    color: var(--text-color);

    button {
        background-color: transparent;
        border: 1px solid var(--primary-color);
        color: var(--text-color);
        border-radius: 20px;
    }
`

export function List() {
    let [recommend, setRecommend] = useState({
        info: new dao.TaskUser(),
        total: 0,
        open: false,
        column: 4,
        list: new Array<Array<dao.TaskUser>>(),
        spinning: false,
    });
    let [req, setReq] = useState({
        currPage: 1,
        pageSize: 50,
    });

    const getRecommend = async () => {
        if (req.currPage == 1) {
            recommend.list = [];
            recommend.total = 0;
        }
        recommend.spinning = true;
        setRecommend({ ...recommend });
        let data = {
            ...req,
        }
        let res = await srv.Task.recommend(data);
        if (res.code == 1000) {
            recommend.total = Number(res.data.total);

            res.data.list.forEach((e: dao.TaskUser, i: number) => {
                if (req.currPage == 1) {
                    if (i < recommend.column) {
                        recommend.list[i] = [e];
                    } else {
                        recommend.list[i % recommend.column].push(e);
                    }
                } else {
                    recommend.list[i % recommend.column] = recommend.list[i % recommend.column].concat(e);
                }
            });
        } else {
            recommend.total = 0;
            message.error(res.desc);
        }
        recommend.spinning = false;
        setRecommend({ ...recommend });
    }

    const onPreview = (item?: dao.TaskUser) => {
        recommend.open = !recommend.open;
        if (!!item) {
            Object.assign(recommend.info, item);
        }
        setRecommend({ ...recommend });
    }

    const onPagination = () => {
        if (req.currPage * req.pageSize > recommend.total) {
            return;
        }
        req.currPage += 1;
        setReq({...req});
    }

    useEffect(() => {
        getRecommend();
    }, [req]);

    return <Container>
        <Title>
            <div className="logo">
                <img src="/logo-text.png" alt="喵闪AI" />
            </div>
            <p className="slogan">一个让创作更轻松的AI智能化平台</p>
            <div className="btn">
                <Link className="default" to="/wordart">AI艺术字</Link>
                <Link className="primary" to="/creation">创意作图</Link>
            </div>
        </Title>
        <Content>
            {recommend.list.map((x, y) =>
                <Column key={y}>
                    {x.map(v =>
                        <li className="item" onClick={() => onPreview(v)} key={v.taskId}>
                            <Card>
                                <div className="card-body">
                                    <picture>
                                        <img src={v.results[0].url} alt="" />
                                    </picture>
                                    <div className="prompt">
                                        <div className="over-line">
                                            {v.input.prompt}
                                        </div>
                                    </div>
                                </div>
                                <div className="card-foot">
                                    <div className="user">
                                        <img className="avatar" src={v.avatar} alt="" />
                                        <span className="phone">{v.mobile}</span>
                                    </div>
                                    <Icon className="icon" src="/icon/menu.svg" text="复用创意"></Icon>
                                </div>
                            </Card>
                        </li>
                    )}
                </Column>
            )}
        </Content>
        <Pagination>
            {(req.currPage * req.pageSize) >= recommend.total ? <span>已经到底啦</span> : <button onClick={() => onPagination()}>点击查看更多</button>}
        </Pagination>
        <Footer />
        <Preview open={recommend.open} data={recommend.info} onClose={() => onPreview()}></Preview>
        <Spin spinning={recommend.spinning} />
    </Container>
}
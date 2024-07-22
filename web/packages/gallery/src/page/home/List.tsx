import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import LazyLoad from 'react-lazyload';
import { Spin, message } from "antd";

import { dao, srv } from "core";
import { Icon } from "@/common";
import { Preview } from './Preview';
import { Footer } from "../common";
import { TaskContext } from "@/context";

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
        background-color: #21ddcf;
    }
`
const Content = styled.div`
    display: flex;
    grid-template-columns: repeat(4, 1fr);
    justify-content: center;
    gap: 16px;
    padding: 16px 0;
    min-height: calc(100vh - 474px);

    .ant-spin {
        align-self: center;
    }
`
const Card = styled.div`
    border-radius: 12px;
    overflow: hidden;
    max-width: 280px;
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
        cursor: pointer;
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
        box-sizing: border-box;

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
            cursor: pointer;
            display: grid;
            grid-template-columns: auto 1fr;
            align-items: center;
            width: 74px;
            height: 28px;
            padding: 0 8px;
            font-size: 12px;
            border-radius: 60px;
            border: 1px solid #fff;

            &:hover {
                color: #333;
                background-color: #fff;

                img, object {
                    filter: drop-shadow(#333 80px 0);
                }
            }
        }
    }

    .prompt {
        display: none;
        width: 100%;
        max-height: 112px;
        padding: 20px;
        font-weight: 400;
        position: absolute;
        bottom: 0;
        left: 0;
        color: #fff;
        z-index: 10;
        box-sizing: border-box;
        background: linear-gradient(0deg,rgba(38,36,76,.7),rgba(38,36,76,0));

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
`
const Pagination = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 24px;
    color: var(--text-color);
    margin: 30px 0;

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
    const color = [
        '#6495ED',
        '#7B68EE',
        '#BA55D3',
        '#DB7093',
        '#FFB6C1',
        '#48D1CC',
        '#90EE90',
        '#EEE8AA',
        '#E9967A',
        '#87CEEB'
    ];

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
        setReq({ ...req });
    }

    useEffect(() => {
        if(window.innerWidth >= 1600) {
            recommend.column = 5;
            setRecommend({ ...recommend });
        }
        getRecommend();
        window.addEventListener('scroll', () => {
            if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 100) {
                onPagination();
            }
        });
    }, [req]);

    const taskContext = useContext(TaskContext);
    const navigate = useNavigate();

    const onReuse = (item: dao.TaskUser) => {
        taskContext.dispatch({ type: 'reuse', payload: item });
        setTimeout(() => {
            switch (item.taskType) {
                case 'text_to_image':
                    navigate('/creation');
                    break;
                case 'word_art_image':
                    navigate('/wordart');
                    break;
            }
        });
    }

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
            <Spin spinning={recommend.spinning} />
            {recommend.list.map((x, y) =>
                <Column key={y}>
                    {x.map(v =>
                        <li className="item" key={v.taskId}>
                            <Card onContextMenu={(e) => e.preventDefault()}>
                                <div className="card-body" onClick={() => onPreview(v)}>
                                    <picture>
                                    <LazyLoad resize>
                                        <img src={v.results && v.results[0]} alt="" />
                                    </LazyLoad>
                                    </picture>
                                    <div className="prompt">
                                        <div className="over-line">
                                            {v.input.prompt}
                                        </div>
                                    </div>
                                </div>
                                <div className="card-foot" style={{ backgroundColor: color[Math.floor(Math.random() * 10)] }}>
                                    <div className="user">
                                        <img className="avatar" src={v.avatar || '/avatar/01.jpg'} alt="" />
                                        <span className="phone">{v.mobile}</span>
                                    </div>
                                    <Icon className="icon" onClick={() => onReuse(v)} src="/icon/reuse.svg" text="复用创意" />
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
    </Container>
}
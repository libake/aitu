import { useEffect, useState } from "react";
import styled from "styled-components";
import { Spin, message } from "antd";

import { dao, srv } from "core";
import { Icon } from "@/common";
import { Preview } from './Preview';

const Container = styled.div`
    display: grid;
    margin-top: 52px;
    background-color: ${props => props.theme.backgroundColor};
`;
const Title = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 0;
    color: #fff;
    z-index: 100;
    background-color: ${props => props.theme.backgroundColor};

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
        background-color: ${props => props.theme.primaryColor};
    }

    .primary:hover {
        background-color: ${props => props.theme.secondaryColor};
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
        border: 1px solid ${props => props.theme.primaryColor};
        box-shadow: 0 2px 20px 0 hsla(0,0%,100%,.4);

        .prompt {
            display: block;
        }
    }

    .card-body {
        position: relative;
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

        .default {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 97px;
            height: 28px;
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
const Picture = styled.picture`
    img {
        width: 100%;
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

export function List() {
    let [recommend, setRecommend] = useState({
        info: new dao.Recommend(),
        total: 0,
        open: false,
        column: 4,
        list: new Array<Array<dao.Recommend>>(),
        spinning: false,
    });

    const getRecommend = async () => {
        recommend.spinning = true;
        setRecommend({...recommend});
        let data = {
            lastId: 0,
            pageSize: 50,
        }
        let res = await srv.Task.recommend(data);
        if (res.code == 1000) {
            recommend.total = res.data.total;
            let tmp: Array<dao.Recommend> = res.data.data.works.filter((f: any) => f.type == 'WORK').map((m: any) => m.data);
            tmp.forEach((e, i) => {
                if (i < recommend.column) {
                    recommend.list[i] = [e];
                } else {
                    recommend.list[i%recommend.column].push(e);
                }
            });
        } else {
            message.error(res.desc);
        }
        recommend.spinning = false;
        setRecommend({...recommend});
    }
    
    const onPreview = (item?: dao.Recommend) => {
        recommend.open = !recommend.open;
        if (!!item) {
            Object.assign(recommend.info, item);
        }
        setRecommend({...recommend});
    }

    useEffect(() => {
        getRecommend();
    }, []);

    let content = <>
        {recommend.list.map((x, y) =>
            <Column key={y}>
                {x.map(v =>
                    <li className="item" onClick={() => onPreview(v)} key={v.taskId}>
                        <Card>
                            <div className="card-body">
                                <Picture>
                                    <img src={v.image.url} alt="" />
                                </Picture>
                                <div className="prompt">
                                    <div className="over-line">
                                        {v.taskInput.prompt}
                                    </div>
                                </div>
                            </div>
                            <div className="card-foot">
                                <div className="user">
                                    <img className="avatar" src={v.avatarUrl} alt="" />
                                    <span className="phone">{v.userPhone}</span>
                                </div>
                                <div className="default">
                                    <Icon src="/icon/menu.svg" text="复用创意"></Icon>
                                </div>
                            </div>
                        </Card>
                    </li>
                )}
            </Column>
        )}
    </>

    return <Container>
        <Title>
            <div className="logo">
                <img src="/logo-text.png" alt="喵闪AI" />
            </div>
            <p className="slogan">一个让创作更轻松的AI智能化平台</p>
            <div className="btn">
                <a className="default">AI艺术字</a>
                <a className="primary">创意作图</a>
            </div>
        </Title>
        <Content>
            {content}
        </Content>
        <Preview open={recommend.open} data={recommend.info} onClose={() => onPreview()}></Preview>
        <Spin spinning={recommend.spinning} />
    </Container>
}
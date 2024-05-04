import styled from "styled-components";
import { useEffect, useState } from "react";

import { Panel } from './Panel';
import { Icon } from "@/common";
import { dao, srv } from "@/core";


const Container = styled.div`
    display: grid;
    margin: 52px 0 0;
    grid-template-columns: 348px 1fr;
    background-color: ${props => props.theme.backgroundColor};
`;
const Content = styled.div`
    margin: 0 36px;
    
`
const Title = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 74px;
    color: #878aab;

    .text {
        display: flex;
        align-items: center;
        gap: 8px;

        p {
            margin: 0;
            max-width: calc(100% - 24px);
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
    }

    .tool {
        display: flex;
        align-items: center;
        gap: 8px;

    }
`
const Head = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #b5b6b8;
    font-size: 12px;

    a {
        color: #b5b6b8;
    }

    .text {
        display: flex;
        align-items: center;
        gap: 8px;

        p {
            margin: 0;
            max-width: calc(100% - 24px);
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
    }

    .tool {
        display: flex;
        align-items: center;
        gap: 8px;

    }

    .line {
        height: 1px;
        flex: 1;
        margin-left: 16px;
        background-color: #878aab;
    }
`
const History = styled.div`
    margin-bottom: 16px;
    
`
const Image = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    width: 100%;

    img {
        width: 100%;
    }

    .img-item {
        border-radius: 8px;
        position: relative;
        overflow: hidden;
        border: 3px solid transparent;
        cursor: pointer;

        &:hover {

            border-color: ${props => props.theme.primaryColor}
        }
    }
`

export function List() {
    let [task, setTask] = useState({
        list: new Array<dao.Task>(),
    });

    const getTask = async () => {
        task.list = [];
        for (let i = 0; i < 5; i++) {
            let tmp = {
                id: i,
                taskId: i.toString(),
                taskInput: {
                    prompt: '一个可爱的卡通女孩穿着短袖牵着狗，全身，黄色背景，以Keith Haring的风格涂鸦，清晰的插图，大胆的线条和纯色，简单的细节，极简主义',
                },
                taskType: 'text_to_image',
                taskRate: 100,
                taskResult: [
                    {
                        url: 'https://wanx.alicdn.com/wanx/1789492172506145/text_to_image/cf78135764f642969ca5f010cd524248_0.png?x-oss-process=image/watermark,image_aW1nL-awtOWNsDIwMjQwMjIyLnBuZw,t_80,g_se,x_30,y_30/format,webp',
                    }, {
                        url: 'https://wanx.alicdn.com/wanx/1789492172506145/text_to_image/cf78135764f642969ca5f010cd524248_0.png?x-oss-process=image/watermark,image_aW1nL-awtOWNsDIwMjQwMjIyLnBuZw,t_80,g_se,x_30,y_30/format,webp',
                    }, {
                        url: 'https://wanx.alicdn.com/wanx/1789492172506145/text_to_image/cf78135764f642969ca5f010cd524248_0.png?x-oss-process=image/watermark,image_aW1nL-awtOWNsDIwMjQwMjIyLnBuZw,t_80,g_se,x_30,y_30/format,webp',
                    }, {
                        url: 'https://wanx.alicdn.com/wanx/1789492172506145/text_to_image/cf78135764f642969ca5f010cd524248_0.png?x-oss-process=image/watermark,image_aW1nL-awtOWNsDIwMjQwMjIyLnBuZw,t_80,g_se,x_30,y_30/format,webp',
                    }
                ]
            }
            task.list.push(tmp);
        }
        let res = await srv.Task.info('fbc778fe-19e9-40ef-a506-72b5023e8a84');
        setTask({...task});
    }

    const addTask = async () => {
        let data = {
            model: 'wanx-v1',
            input: {
                prompt: '一只奔跑的猫',
            }
        }
        let res = await srv.Task.text2image(data);
        
    }

    useEffect(() => {
        getTask();
    }, []);

    return <Container>
        <div className="side">
            <Panel submit={() => addTask()}></Panel>
        </div>
        <Content>
            <Title>
                <span className="text">支持下载或收藏，可通过管理画作进行删除，欢迎对创作点赞点踩并提出建议，助力模型不断进化。</span>
                <span className="tool">
                    <i className="iconfont">&#xe697;</i>
                    管理画作
                </span>
            </Title>
            {task.list.map((v, i) =>
                <History key={i}>
                    <Head>
                        <div className="text">
                            <div className="cell">
                                <Icon src="/icon/menu.svg" text="图像风格迁移" />
                            </div>
                            <time>2024-04-20 09:00:00</time>
                        </div>
                        <div className="line"></div>
                    </Head>
                    <Head style={{ height: "56px" }}>
                        <div className="text">
                            <p>{v.taskInput.prompt}</p>
                        </div>
                        <div className="tool">
                            <a href="">
                                <Icon src={"/icon/reuse.svg"} text="复用创意" />
                            </a>
                            <a href="">
                                <Icon src="/icon/update.svg" text="再次生成" />
                            </a>
                            <a href="">
                                <Icon src="/icon/reuse.svg" />
                            </a>
                        </div>
                    </Head>
                    <Image>
                        {v.taskResult.map((d, k) =>
                            <div className="img-item" key={k}>
                                <picture>
                                    <img src={d.url} alt="" />
                                </picture>
                                <div className="tool"></div>
                            </div>
                        )}
                    </Image>
                </History>
            )}
        </Content>
    </Container>
}
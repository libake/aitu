import styled from "styled-components";
import { useEffect, useState, useContext } from "react";
import { Popconfirm, Spin, message } from "antd";

import { Icon } from "@/common";
import { dao, dto, srv } from "core";
import { Panel } from './Panel';
import { Preview } from "./Preview";
import { UserContext } from "@/context";
import { useNavigate } from "react-router-dom";


const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    margin: 52px 0 0;
    min-height: calc(100vh - 52px);
    background-color: ${props => props.theme.backgroundColor};

    .side {
        position: fixed;
        width: 360px;
    }

    .main {
        margin: 0 36px 0 420px;
    }
`;
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
const Time = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
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

    .line {
        height: 1px;
        flex: 1;
        margin-left: 16px;
        background-color: #878aab;
    }
`
const Head = styled(Time)`
    .text {
        flex: 1;
    }

    .tool {
        display: flex;
        align-items: center;
        gap: 8px;
    }
`
const History = styled.div`
    margin-bottom: 16px;
    overflow-y: auto;
    
`
const Column = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
`
const Image = styled.div`
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    border: 3px solid transparent;
    cursor: pointer;
    
    &:hover {
        border-color: ${props => props.theme.primaryColor};

        .mark {
            opacity: 1;
        }

        .tool {
            opacity: 1;
        }
    }

    img {
        width: 100%;
    }

    .mark {
        align-items: center;
        background-image: linear-gradient(180deg, transparent, #000);
        bottom: 0;
        color: var(--text-color);
        display: flex;
        justify-content: center;
        left: 0;
        pointer-events: none;
        position: absolute;
        right: 0;
        top: 0;
        opacity: 0;
        z-index: 98;
    }

    .tool {
        position: absolute;
        bottom: 0;
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: 16px;
        box-sizing: border-box;
        opacity: 0;
        z-index: 100;
    }

    .tool-group {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 16px;
    }
`
const Progress = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    height: 200px;
    border-radius: 12px;
    background-color: #13171e;
    overflow: hidden;

    .inner {
        position: absolute;
        left: 0;
        width: 10%;
        height: 100%;
        background-color: #1e222f;
        z-index: 2;
    }

    .text {
        display: grid;
        color: #fff;
        gap: 24px;
        z-index: 3;
    }
`

export function List() {
    let [task, setTask] = useState({
        info: new dao.Task(),
        current: 0,
        editable: false,
        list: new Array<dao.Task>(),
        keys: new Array<number>(),
        preview: {
            open: false,
            current: 0,
        },
        open: false,
        percent: 0,
    });

    const pollTask = async () => {
        let data = {
            ...task.info,
        }
        let res = await srv.Task.info(data);
        if (res.code == 1000) {
            task.percent = 100;
            Object.assign(task.info, res.data);
            getTask();
        } else {
            if (task.percent < 100) {
                task.percent += Math.floor(Math.random() * 20) + 1;
            }
            setTask({ ...task });
            setTimeout(() => {
                pollTask();
            }, 5000);
        }
        setTask({ ...task });
    }

    const addTask = async (v: any) => {
        let data = {
            model: 'wanx-v1',
            ...v,
        }
        let res = await srv.Task.create(data);
        if (res.code == 1000) {
            setTimeout(() => {
                Object.assign(task.info, res.data.output);
                task.info.taskId = res.data.output.task_id;
                task.info.taskStatus = res.data.output.task_status;
                setTask({ ...task });
                if (task.info.taskStatus == 'PENDING') {
                    pollTask();
                }
            }, 1000);
        } else {
            message.error(res.desc);
        }
    }

    const getTask = async () => {
        let data = {
            ...new dto.Request(),
            queryBy: [
                {col: 'taskType', val: 'text_to_image'},
                {col: 'taskStatus', val: 'SUCCEEDED'},
            ],
        }
        let res = await srv.Task.list(data);
        if (res.code == 1000) {
            task.list = res.data.list;
        } else {
            task.list = [];
        }
        setTask({ ...task });
    }

    const selTask = (evt: any, item: dao.Task) => {
        let s = new Set(task.keys);
        if (evt.target.checked) {
            s.add(item.id);
        } else {
            s.delete(item.id);
        }
        task.keys = Array.from(s);
        setTask({ ...task });
    }

    const delTask = async (item?: dao.Task) => {
        if (!!item) {
            task.keys = [item.id];
            setTask({ ...task });
        }
        let data = {
            id: task.keys
        }
        if (data.id.length == 0) {
            message.warning('请至少选择一项操作');
            return
        }
        let res = await srv.Task.delete(data);
        if (res.code == 1000) {
            message.success('删除成功');
            getTask();
        } else {
            message.error(res.desc);
        }
    }

    const onPreview = (item?: dao.Task, idx?: number) => {
        task.preview.open = !task.preview.open;
        if (!!item) {
            task.preview.current = idx || 0;
            Object.assign(task.info, item);
        }
        setTask({ ...task });
    }
    const userContext = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (userContext.state.id > 0) {
            getTask();
        } else {
            navigate('/');
        }
    }, [userContext]);

    return <Container>
        <Panel className="side" submit={(e: any) => addTask(e)}></Panel>
        <div className="main">
            <Title>
                <span className="text">支持下载或收藏，可通过管理画作进行删除，欢迎对创作点赞点踩并提出建议，助力模型不断进化。</span>
                <span className="tool">
                    {task.editable ? <>
                        <a onClick={() => setTask({ ...task, editable: false })}>取消</a>
                        <a onClick={() => delTask()}>删除{task.keys.length}条生成记录</a>
                    </> : <div onClick={() => setTask({ ...task, editable: true })}>
                        <Icon src="/icon/modular.svg" text="管理画作" />
                    </div>}
                </span>
            </Title>
            {task.info.taskStatus == 'PENDING' && <History>
                <Head>
                    <div className="text">
                        <div className="cell">
                            <Icon src="/icon/menu.svg" text="图像风格迁移" />
                        </div>
                        <time>AI正在生成中...</time>
                    </div>
                    <div className="line"></div>
                </Head>
                <Head style={{ height: "56px" }}>
                    <div className="text">
                        <p>{task.info.input.prompt}</p>
                    </div>
                    <div className="tool">
                        <a>
                            <Icon src={"/icon/reuse.svg"} text="复用创意" />
                        </a>
                        <a>
                            <Icon src="/icon/refresh.svg" text="再次生成" />
                        </a>
                        <Popconfirm
                            title="确定要删除记录吗？"
                            description="删除后的记录不可恢复"
                            onConfirm={() => delTask(task.info)}
                            okText="删除"
                            cancelText="取消"
                        >
                            <>
                                <Icon src="/icon/ashbin.svg" />
                            </>
                        </Popconfirm>
                    </div>
                </Head>
                <Progress>
                    <div className="inner" style={{ width: `${task.percent}%` }}></div>
                    <div className="text">
                        <Spin />
                        <div>{task.percent}%</div>
                    </div>
                </Progress>
            </History>}
            {task.list.map((v, i) =>
                <History key={i}>
                    <Time>
                        <div className="text">
                            {task.editable && <input onChange={(e) => selTask(e, v)} type="checkbox" />}
                            <div className="cell">
                                <Icon src="/icon/text.svg" text="文本生成图像" />
                            </div>
                            <time>{v.createAt}</time>
                        </div>
                        <div className="line"></div>
                    </Time>
                    <Head style={{ height: "56px" }}>
                        <div className="text">
                            <p>{v.input.prompt}</p>
                        </div>
                        <div className="tool">
                            <a>
                                <Icon src={"/icon/reuse.svg"} text="复用创意" />
                            </a>
                            <a>
                                <Icon src="/icon/refresh.svg" text="再次生成" />
                            </a>
                            <Popconfirm
                                title="确定要删除记录吗？"
                                description="删除后的记录不可恢复"
                                onConfirm={() => delTask(v)}
                                okText="删除"
                                cancelText="取消"
                            >
                                <>
                                    <Icon src="/icon/ashbin.svg" />
                                </>
                            </Popconfirm>
                        </div>
                    </Head>
                    <Column>
                        {v.results && v.results.map((d, k) =>
                            <Image key={k} onClick={() => onPreview(v, k)}>
                                <picture>
                                    <img src={d.url} alt="" />
                                </picture>
                                <div className="tool" onClick={(e) => {e.stopPropagation();}}>
                                    <div className="tool-group">
                                        <Icon src="/icon/good.svg" />
                                        <Icon src="/icon/bad.svg" />
                                    </div>
                                    <div className="tool-group">
                                        <Icon src="/icon/download.svg" />
                                        <Icon src="/icon/favorite.svg" />
                                    </div>
                                </div>
                                <div className="mark"></div>
                            </Image>
                        )}
                    </Column>
                </History>
            )}
        </div>
        <Preview open={task.preview.open} current={task.preview.current} data={task.info} onClose={() => onPreview()}></Preview>
    </Container>
}
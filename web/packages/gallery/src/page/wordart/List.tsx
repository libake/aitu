import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { Popconfirm, Spin, message } from "antd";

import { Icon } from "@/common";
import { dao, dto, srv } from "core";
import { Panel } from './Panel';
import { Preview } from "./Preview";
import { UserContext } from "@/context";
import { useNavigate } from "react-router-dom";
import { bus } from "@/util/mitt";


const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    margin: 52px 0 0;
    min-height: calc(100vh - 52px);
    background-color: var(--background-color);

    .side {
        position: fixed;
        width: 360px;
    }
`;
const Content = styled.div`
    margin: 0 36px 0 420px;
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

    .text-item {
        display: flex;
        align-items: center;
        gap: 8px;
        border-radius: 4px;
        padding: 4px 8px;
        background-color: #202532;
        max-width: 300px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;

        img {
            height: 24px;
        }
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
    margin: 16px 0;

    .hint {
        margin-bottom: 16px;
        color: var(--text-color);
    }

    .body {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        height: 200px;
        border-radius: 12px;
        background-color: #13171e;
        overflow: hidden;
    }

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
            task.percent += Math.floor(Math.random() * 20) + 1;
            if (task.percent > 100) {
                task.percent = 99;
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
            model: 'wordart-texture',
            ...v,
            taskType: 'word_art_image',
        }
        let res = await srv.Task.wordArt(data);
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
                {col: 'taskType', val: 'word_art_image'},
                {col: 'taskStatus', val: 'SUCCEEDED'},
            ]
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

    useEffect(() => {
        getTask();
    }, []);

    const userContext = useContext(UserContext);

    useEffect(() => {
        if (userContext.state.id > 0) {
            getTask();
        } else {
            bus.emit('auth');
        }
    }, [userContext]);

    let [req, setReq] = useState({
        input: {
            prompt: '',
            text: {
                text_content: '',
                output_image_ratio: '1:1',
            },
            texture_style: '',
        },
        parameters: {
            n: 1,
            alpha_channel: false,
        },
        other: {
            text: new Array<string>(),
            thumb: '',
        }
    });

    // 复用创意、再次生成
    const onReuse = (v: any, type = 1) => {
        let data = {
            input: {
                ...v.input,
            },
            parameters: {
                ...v.parameters,
            },
            other: {
                ...v.other,
            }
        }
        switch(type) {
            case 1:
                Object.assign(req, data);
                setReq({...req});
                break;
            case 2:
                addTask(data);
                break;
        }
    }

    return <Container>
        <Panel className="side" data={req} submit={(e: any) => addTask(e)}></Panel>
        <Content>
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
            {task.info.taskStatus == 'PENDING' && <Progress>
                <div className="hint">AI正在生成中...</div>
                <div className="body">
                    <div className="inner" style={{ width: `${task.percent}%` }}></div>
                    <div className="text">
                        <Spin />
                        <div>{task.percent}%</div>
                    </div>
                </div>
            </Progress>}
            {task.list.map((v, i) =>
                <History key={i}>
                    <Time>
                        <div className="text">
                            {task.editable && <input onChange={(e) => selTask(e, v)} type="checkbox" />}
                            <time>{v.createAt}</time>
                        </div>
                        <div className="line"></div>
                    </Time>
                    <Head style={{ height: "56px" }}>
                        <div className="text">
                            <div className="text-item">文字内容：{v.input.text.text_content}</div>
                            <span>X</span>
                            <div className="text-item">
                                <img src={v.other.thumb} alt="" />
                                <span>{v.other.text.join('-')}</span>
                            </div>
                            {v.other.text[1] == '自定义' && <>
                            <span>X</span>
                            <div className="text-item">
                                {v.input.prompt}
                            </div>
                            </>}
                        </div>
                        <div className="tool">
                            <a onClick={() => onReuse(v, 1)}>
                                <Icon src={"/icon/reuse.svg"} text="复用创意" />
                            </a>
                            <a onClick={() => onReuse(v, 2)}>
                                <Icon src="/icon/refresh.svg" text="再次生成" />
                            </a>
                            <Popconfirm
                                title="确定要删除记录吗？"
                                description="删除后的记录不可恢复"
                                onConfirm={() => delTask(v)}
                                okText="删除"
                                cancelText="取消"
                            >
                                <Icon src="/icon/ashbin.svg" />
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
                                        {/* <Icon src="/icon/good.svg" />
                                        <Icon src="/icon/bad.svg" /> */}
                                    </div>
                                    <div className="tool-group">
                                        <Icon src="/icon/download.svg" />
                                        {/* <Icon src="/icon/favorite.svg" /> */}
                                    </div>
                                </div>
                                <div className="mark"></div>
                            </Image>
                        )}
                    </Column>
                </History>
            )}
        </Content>
        <Preview open={task.preview.open} current={task.preview.current} data={task.info} onClose={() => onPreview()}></Preview>
    </Container>
}
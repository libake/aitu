import styled from "styled-components";
import { useEffect, useState, useContext } from "react";
import { Popconfirm, Spin, message } from "antd";
import dayjs from "dayjs";

import { Icon } from "@/common";
import { dao, srv } from "core";
import { Panel } from './Panel';
import { Preview } from "./Preview";
import { TaskContext, UserContext } from "@/context";
import { useNavigate } from "react-router-dom";
import { Default, Footer, Login } from "../common";


const Container = styled.div`
    display: grid;
    margin: 52px 0 0;
    min-height: calc(100vh - 52px);
    background-color: var(--background-color);
    overflow-x: hidden;

    .side {
        position: fixed;
        width: 360px;
    }

    .main {
        position: relative;
        margin: 0 36px 112px 420px;
        min-height: 100%;

        .footer {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
        }
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

    .icon {
        cursor: pointer;
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
    display: grid;
    grid-template-columns: 1fr 200px;

    .tool {
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .icon {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 16px;
        height: 16px;
        overflow: hidden;

        img {
            position: relative;
            left: -80px;
            width: 100%;
            filter: drop-shadow(#fff 80px 0);
        }
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
        border-color: var(--primary-color);

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
        gap: 16px;
        z-index: 3;
    }
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
    let [task, setTask] = useState({
        info: new dao.Task(),
        editable: false,
        list: new Array<dao.Task>(),
        keys: new Array<number>(),
        preview: {
            open: false,
            current: 0,
        },
        open: false,
        percent: 0,
        total: 0,
    });

    const pollTask = async () => {
        if (task.info.taskStatus == 'FAILED') {
            message.error("生成失败");
            return;
        }
        let data = {
            id: task.info.id,
            taskId: task.info.taskId,
        }
        let res = await srv.Task.info(data);
        if (res.code == 1000) {
            Object.assign(task.info, res.data);
            task.percent = 0;
            task.list = [];
            task.total = 0;
            setTask({ ...task });
            if (req.currPage == 1) {
                getTask();
            } else {
                req.currPage = 1;
                setReq({ ...req });
            }
        } else {
            task.percent += Math.floor(Math.random() * 20) + 1;
            if (task.percent > 99) {
                task.percent = 99;
                task.info.taskStatus = 'FAILED';
            }
            setTask({ ...task });
            setTimeout(() => {
                pollTask();
            }, 5000);
        }
    }

    const addTask = async (v: any) => {
        let data = {
            model: 'wanx-v1',
            ...v,
        }
        if (!!data.input.ref_img) {
            data.input.ref_img = location.origin + data.input.ref_img;
        }
        let res = await srv.Task.create(data);
        if (res.code == 1000) {
            setTimeout(() => {
                Object.assign(task.info, res.data);
                setTask({ ...task });
                if (task.info.taskStatus == 'PENDING') {
                    pollTask();
                }
            }, 1000);
        } else {
            message.error(res.desc);
        }
    }

    let [req, setReq] = useState({
        currPage: 1,
        pageSize: 10,
        queryBy: [
            { col: 'taskType', val: 'text_to_image' },
            { col: 'taskStatus', val: 'SUCCEEDED' },
        ],
    });

    const getTask = async () => {
        if (req.currPage == 1) {
            task.list = [];
            task.total = 0;
        }
        let data = {
            ...req,
        }
        let res = await srv.Task.list(data);
        if (res.code == 1000) {
            task.list = task.list.concat(res.data.list);
            task.total = res.data.total;
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
            setTask({ ...task, editable: false, keys: [] });
            setReq({ ...req, currPage: 1 });
            message.success('删除成功');
        } else {
            message.error(res.desc);
        }
    }

    const onPreview = (item?: dao.Task, idx?: number) => {
        task.preview.open = true;
        if (!!item) {
            task.preview.current = idx || 0;
            Object.assign(task.info, item);
        }
        setTask({ ...task });
    }

    let [form, setForm] = useState({
        input: {
            prompt: '',
            ref_img: undefined!,
        },
        parameters: {
            n: 1,
            size: '1024*1024',
            style: '<auto>',
        },
        taskType: 'text_to_image',
        other: undefined!,
    });

    // 复用创意、再次生成
    const onReuse = (v: any, type = 1) => {
        let data = {
            input: {
                ...v.input,
                ref_img: undefined!,
            },
            parameters: {
                ...v.parameters,
            },
            other: {
                ...v.other,
            }
        }
        switch (type) {
            case 1:
                Object.assign(form, data);
                setForm({ ...form });
                break;
            case 2:
                addTask(data);
                break;
        }
    }

    const onPagination = () => {
        if (req.currPage * req.pageSize > task.total) {
            return;
        }
        req.currPage += 1;
        setReq({ ...req });
    }

    // 下载
    const onDownload = (url: string) => {
        let link = document.createElement('a');
        link.href = url;
        link.click();
    }

    const taskContext = useContext(TaskContext);
    const userContext = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (userContext.state.id == 0) {
            return;
        }
        getTask();
        if (taskContext.state.id > 0 && taskContext.state.taskType == 'text_to_image') {
            Object.assign(form, taskContext.state);
            setForm({ ...form });
            message.success('成功复用创意，可在左侧调整创意内容');
        }
        taskContext.dispatch({ type: 'reset' });
    }, [userContext, req]);

    return <Container>
        {userContext.state.id > 0 ? <>
        <Panel className="side" data={form} submit={(e: any) => addTask(e)}></Panel>
        <div className="main">
            {task.list.length > 0 ? <>
            <Title>
                <span className="text">支持下载或收藏，可通过管理画作进行删除，欢迎对创作点赞点踩并提出建议，助力模型不断进化。</span>
                {task.editable ? <div className="tool">
                    <a onClick={() => setTask({ ...task, editable: false })}>取消</a>
                    <a onClick={() => delTask()}>删除{task.keys.length}条生成记录</a>
                </div> : <Icon className="icon" onClick={() => setTask({ ...task, editable: true })} src="/icon/modular.svg" text="管理画作" />}
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
                            <div className="cell">
                                <Icon src="/icon/text.svg" text="文本生成图像" />
                            </div>
                            <time>{dayjs(v.createAt).format('YYYY-MM-DD HH:mm:ss')}</time>
                        </div>
                        <div className="line"></div>
                    </Time>
                    <Head style={{ height: "56px" }}>
                        <div className="text">
                            <p>{v.input.prompt}</p>
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
                                placement="left"
                            >
                                <a className="icon">
                                    <img src="/icon/ashbin.svg" alt="删除" />
                                </a>
                            </Popconfirm>
                        </div>
                    </Head>
                    <Column>
                        {v.results && v.results.map((d, k) =>
                            <Image key={k} onClick={() => onPreview(v, k)}>
                                <picture onContextMenu={(e) => e.preventDefault()}>
                                    <img src={d} alt="" />
                                </picture>
                                <div className="tool" onClick={(e) => { e.stopPropagation(); }}>
                                    <div className="tool-group">
                                        {/* <Icon src="/icon/good.svg" />
                                        <Icon src="/icon/bad.svg" /> */}
                                    </div>
                                    <div className="tool-group">
                                        <Icon src="/icon/download.svg" onClick={() => onDownload(d)} />
                                        {/* <Icon src="/icon/favorite.svg" /> */}
                                    </div>
                                </div>
                                <div className="mark"></div>
                            </Image>
                        )}
                    </Column>
                </History>
            )}
            <Pagination>
                {(req.currPage * req.pageSize) >= task.total ? <span>已经到底啦</span> : <button onClick={() => onPagination()}>点击查看更多</button>}
            </Pagination>
            </> : <Default />}
            <Footer className="footer" />
        </div>
        <Preview
            open={task.preview.open}
            current={task.preview.current}
            data={task.info}
            onClose={() => setTask({ ...task, preview: { ...task.preview, open: false } })}
        />
        </> : <Login />}
    </Container>
}
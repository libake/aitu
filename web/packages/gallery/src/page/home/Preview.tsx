import { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { Spin } from "antd";

import { Icon } from "@/common";
import { dao } from "core";
import dayjs from "dayjs";
import { TaskContext } from "@/context";
import { useNavigate } from "react-router-dom";
import { TaskTypeMap } from "@/constant";

const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(10, 10, 10, 0.92);
    z-index: 100;
    overflow: hidden;

    .preview-head {
        display: flex;
        justify-content: flex-end;
        height: 10vh;

        .close {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 20px 20px 0 0;
            width: 34px;
            height: 34px;
            border-radius: 50%;
            background-color: #2d3240;
            cursor: pointer;
        }
    }

    .preview-body {
        display: grid;
        grid-template-columns: auto 30vw;
        gap: 24px;
        height: 100%;
        max-height: 70vh;
        padding: 0 10vw;
        color: #fff;
    }

    picture {
        text-align: end;

        img {
            max-width: 50vw;
            max-height: 70vh;
            border-radius: 12px;
            transition: all 0.3s;
        }
    }

    .list {
        padding: 0 16px;
        box-sizing: border-box;
    }

    .list-item {
        display: grid;
        grid-template-columns: 100px 1fr;
        gap: 24px;
        margin-bottom: 16px;
        
        label {
            justify-self: flex-end;
            color: #878aab;
        }

        img {
            max-width: 200px;
            max-height: 200px;
        }
    }

    .preview-foot {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 24px;
        height: 20vh;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;

        .btn {
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 40px;
            width: 124px;
            color: var(--heading-text-color);
            background-color: var(--primary-color);
            border-radius: 20px;

            img, object {
                filter: drop-shadow(var(--heading-text-color) 80px 0);
            }
        }

        .tool {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 24px;
            height: 40px;
            padding: 0 16px;
            box-sizing: border-box;
            border-radius: 60px;
            color: #fff;
            background-color: #2d3240;

            a {
                display: block;
            }
        }
    }

    .ant-spin {
        justify-self: center;
        align-self: center;
    }
`

interface IProps {
    open: boolean;
    onClose: Function;
    data: dao.TaskUser;
}

export function Preview(props: IProps) {
    let [info, setInfo] = useState({
        ...new dao.TaskUser(),
    });

    const close = () => {
        setInfo(new dao.TaskUser());
        props.onClose(false);
    }

    let [zoom, setZoom] = useState(1);

    const onZoom = (step: number) => {
        zoom += step;
        if (zoom < 1) {
            zoom = 1;
        }
        if (zoom > 8) {
            zoom = 8;
        }
        setZoom(zoom);
    }

    const taskContext = useContext(TaskContext);
    const navigate = useNavigate();

    const onReuse = () => {
        taskContext.dispatch({ type: 'reuse', payload: props.data });
        setTimeout(() => {
            switch(props.data.taskType) {
                case 'text_to_image':
                    navigate('/creation');
                    break;
                case 'word_art_image':
                    navigate('/wordart');
                    break;
            }
        });
    }

    let [spinning, setSpinning] = useState(false);

    useEffect(() => {
        setSpinning(true);
        if (props.open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        Object.assign(info, props.data);
        setInfo({ ...info });
        setZoom(1);
        setTimeout(() => {
            setSpinning(false);
        }, 200);
    }, [props]);

    return props.open ? ReactDOM.createPortal(
        <Container>
            <div className="preview-head">
                <Icon className="close" onClick={close} src="/icon/close.svg" />
            </div>
            <div className="preview-body">
            <Spin spinning={spinning} />
            {spinning || <>
                <picture onContextMenu={(e) => e.preventDefault()}>
                    {info.results.length > 0 && <img src={info.results[0]}  style={{transform: `scale(${zoom})`}} alt="" />}
                </picture>
                <div className="list" style={{display: zoom != 1 ? 'none' : 'block'}}>
                    <div className="list-item">
                        <label>创意作者</label>
                        <span>{info.mobile}</span>
                    </div>
                    <div className="list-item">
                        <label>生成方式</label>
                        <span>{TaskTypeMap.get(info.taskType)}</span>
                    </div>
                    {info.taskType == 'text_to_image' &&
                        <div className="list-item">
                            <label>创意输入</label>
                            <span>{info.input.prompt}</span>
                        </div>
                    }
                    <div className="list-item">
                        <label>图像比例</label>
                        <span>{info.parameters?.size}</span>
                    </div>
                    <div className="list-item">
                        <label>创作时间</label>
                        <span>{dayjs(info.createAt).format('YYYY-MM-DD HH:mm:ss')}</span>
                    </div>
                </div>
            </>}
            </div>
            <div className="preview-foot">
                <div className="tool">
                    <a onClick={(e) => { e.stopPropagation(); onZoom(1); }}>
                        <Icon src="/icon/zoom-out.svg" />
                    </a>
                    <a onClick={() => onZoom(-1)}>
                        <Icon src="/icon/zoom-in.svg" />
                    </a>
                    <a onClick={() => setZoom(1)}>
                        <Icon src="/icon/update.svg" />
                    </a>
                </div>
                <Icon className="btn" onClick={() => onReuse()} src="/icon/reuse.svg" text="复用创意" />
            </div>
        </Container>,
        document.body
    ) : null;
}
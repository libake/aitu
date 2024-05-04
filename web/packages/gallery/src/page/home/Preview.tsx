import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { Tooltip } from "antd";

import { Icon } from "@/common";

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

        .close {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 34px;
            height: 34px;
            margin: 20px 20px 0 0;
            border-radius: 50%;
            background-color: #2d3240;
            cursor: pointer;
        }
    }

    .preview-body {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .img-wrap {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
        max-width: 60vw;
        max-height: 70vh;
        color: #fff;
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

        .tool {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 24px;
            height: 40px;
            padding: 10px 16px;
            border-radius: 60px;
            color: #fff;
            background-color: #2d3240;

            a {
                display: block;
            }
        }

        .single {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #fff;
        }
    }
`
const Button = styled.button`
    background-color: ${props => props.theme.primaryColor};
`

interface IProps {
    open: boolean;
    onClose: Function;
    data: any;
}

export function Preview(props: IProps) {
    let [info, setInfo] = useState<typeof props.data>({});

    useEffect(() => {
        if (props.open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        console.log(props.data)
        Object.assign(info, props.data);
        setInfo({ ...info });
    }, [props]);

    const close = (e: any) => {
        props.onClose(false);
    }

    let [tool, setTool] = useState({
        imageZoom: 1,
    });

    const onZoom = (step: number) => {
        tool.imageZoom += step;
        if (tool.imageZoom < 1) {
            tool.imageZoom = 1;
        }
        setTool({ ...tool });
    }

    return props.open ? ReactDOM.createPortal(
        <Container>
            <div className="preview-head">
                <div className="close" onClick={close}>
                    <Icon src="/icon/close.svg"></Icon>
                </div>
            </div>
            <div className="preview-body" onClick={close}>
                <div className="img-wrap" onClick={(e) => e.stopPropagation()}>
                    <picture>
                        <img src={info.image.url} style={{ height: `${(tool.imageZoom) * 100}%` }} alt="" />
                    </picture>
                    <div className="list">
                        <div className="list-item">
                            <label>创意作者</label>
                            <span>{info.userPhone}</span>
                        </div>
                        <div className="list-item">
                            <label>生成方式</label>
                            <span>13555*877</span>
                        </div>
                        {info.taskType == 'text_to_image' &&
                            <div className="list-item">
                                <label>创意输入</label>
                                <span>{info.taskInput.prompt}</span>
                            </div>
                        }
                        {info.taskType == 'sketch_to_image' &&
                            <>
                                <div className="list-item">
                                    <label>涂鸦</label>
                                    <img src={info.taskInput.baseImage} alt="" />
                                </div>
                                <div className="list-item">
                                    <label>画面描述</label>
                                    <span>{info.taskInput.prompt}</span>
                                </div>
                                <div className="list-item">
                                    <label>画面风格</label>
                                    <span>{info.taskInput.styleName}</span>
                                </div>
                            </>
                        }
                        <div className="list-item">
                            <label>图像比例</label>
                            <span>1:1</span>
                        </div>
                        <div className="list-item">
                            <label>创作时间</label>
                            <span>{info.gmtCreate}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="preview-foot">
                <div className="tool">
                    <a onClick={(e) => { e.stopPropagation(); onZoom(1); }}>
                        <Icon src="/icon/menu.svg"></Icon>
                    </a>
                    <a onClick={() => onZoom(-1)}>
                        <Icon src="/icon/reuse.svg"></Icon>
                    </a>
                    <a onClick={() => onZoom(0)}>
                        <Icon src="/icon/update.svg"></Icon>
                    </a>
                </div>
                <Button>
                    <Icon src="/icon/menu.svg" text="复用创意"></Icon>
                </Button>
                <Tooltip overlayClassName="single" title="隐藏详情">
                    <Icon src="/icon/menu.svg"></Icon>
                </Tooltip>
            </div>
        </Container>,
        document.body
    ) : null;
}
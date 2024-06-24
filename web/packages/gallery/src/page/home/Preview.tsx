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
        height: 10vh;

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
        display: grid;
        grid-template-columns: auto 30vw;
        gap: 24px;
        max-height: 70vh;
        padding: 0 10vw;
        color: #fff;
    }

    picture {
        display: flex;
        justify-content: flex-end;

        img {
            max-width: 60vw;
            max-height: 70vh;
            border-radius: 12px;
            transition: all 0.3s;
        }
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

        button {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 40px;
            color: var(--heading-text-color);
            background-color: var(--primary-color);
            border-radius: 20px;

            img {
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

        .hide {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #fff;

            img {
                filter: drop-shadow(#333 80px 0);
            }
        }
    }
`

interface IProps {
    open: boolean;
    onClose: Function;
    data: any;
}

export function Preview(props: IProps) {
    let [info, setInfo] = useState<typeof props.data>({});

    const close = () => {
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

    useEffect(() => {
        if (props.open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        Object.assign(info, props.data);
        setInfo({ ...info });
        setZoom(1);
    }, [props]);

    return props.open ? ReactDOM.createPortal(
        <Container>
            <div className="preview-head">
                <div className="close" onClick={close}>
                    <Icon src="/icon/close.svg"></Icon>
                </div>
            </div>
            <div className="preview-body" onClick={() => close()}>
                    <picture>
                        <img src={info.image.url}  style={{transform: `scale(${zoom})`}} alt="" />
                    </picture>
                    <div className="list" style={{display: zoom != 1 ? 'none' : 'block'}}>
                        <div className="list-item">
                            <label>创意作者</label>
                            <span>{info.userPhone}</span>
                        </div>
                        <div className="list-item">
                            <label>生成方式</label>
                            <span>{'文本生成图像'}</span>
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
                            {/* <span>{info.params}</span> */}
                        </div>
                        <div className="list-item">
                            <label>创作时间</label>
                            <span>{info.gmtCreate}</span>
                        </div>
                    </div>
            </div>
            <div className="preview-foot">
                <div className="tool">
                    <a onClick={(e) => { e.stopPropagation(); onZoom(1); }}>
                        <Icon src="/icon/zoom-out.svg"></Icon>
                    </a>
                    <a onClick={() => onZoom(-1)}>
                        <Icon src="/icon/zoom-in.svg"></Icon>
                    </a>
                    <a onClick={() => setZoom(1)}>
                        <Icon src="/icon/update.svg"></Icon>
                    </a>
                </div>
                <button>
                    <Icon src="/icon/menu.svg" text="复用创意"></Icon>
                </button>
                <Tooltip title="隐藏详情">
                    <a className="hide">
                        <Icon src="/icon/tips.svg"></Icon>
                    </a>
                </Tooltip>
            </div>
        </Container>,
        document.body
    ) : null;
}
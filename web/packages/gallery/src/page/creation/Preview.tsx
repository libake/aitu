import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { Tooltip } from "antd";

import { Icon } from "@/common";
import { dao } from "@/core";

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
        display: flex;
        justify-content: center;
        align-items: center;
        
    }

    picture {

        img {
            max-width: 60vw;
            max-height: 70vh;
            border-radius: 12px;
        }
    }

    .prev, .next {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        position: fixed;
        top: 50%;
        border-radius: 50%;
        background-color: #2d3240;
    }

    .prev {
        left: 30px;
    }

    .next {
        right: 30px;
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

interface IProps {
    open: boolean;
    onClose: Function;
    data: dao.Task;
}

export function Preview(props: IProps) {
    let [info, setInfo] = useState({
        ...new dao.Task(),
        current: {
            url: '',
            idx: 0,
        }
    });

    const onFlip = (step: number) => {
        if (!info.results) {
            return;
        }
        info.current.idx += step;
        if (info.current.idx < 0) {
            info.current.idx = 0;
        }
        if (info.current.idx > (info.results.length - 1)) {
            info.current.idx = info.results.length - 1;
        }
        info.current.url = info.results[info.current.idx].url;
        setInfo({ ...info });
    }

    useEffect(() => {
        if (props.open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        Object.assign(info, props.data);
        if (info.results && info.results.length > 0) {
            info.current = {
                url: info.results[0].url,
                idx: 0
            }
        }
        setInfo({ ...info });
    }, [props]);

    const close = () => {
        props.onClose(false);
    }

    let [tool, setTool] = useState({
        imageZoom: 1,
        display: 'block',
    });

    const onZoom = (step: number) => {
        tool.imageZoom += step;
        if (tool.imageZoom < 1) {
            tool.imageZoom = 1;
            tool.display = 'block';
        } else {
            tool.display = 'none';
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
            <div className="preview-body">
                <picture>
                    <img src={info.current.url} alt="" />
                </picture>
                <div className="flip">
                    <div
                        className="prev"
                        style={{cursor: info.current.idx == 0 ? 'not-allowed' : 'pointer'}}
                        onClick={(e) => { e.stopPropagation(); onFlip(-1) }}
                    >
                        <Icon src="/icon/prev.svg" />
                    </div>
                    <div
                        className="next"
                        style={{cursor: info.current.idx == (info.results?.length - 1) ? 'not-allowed' : 'pointer'}}
                        onClick={(e) => { e.stopPropagation(); onFlip(1) }}
                    >
                        <Icon src="/icon/next.svg" />
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
                    <a onClick={() => onZoom(0)}>
                        <Icon src="/icon/update.svg"></Icon>
                    </a>
                </div>
                <div className="tool">
                    <a onClick={(e) => { e.stopPropagation(); onZoom(1); }}>
                        <Icon src="/icon/good.svg"></Icon>
                    </a>
                    <a onClick={() => onZoom(-1)}>
                        <Icon src="/icon/bad.svg"></Icon>
                    </a>
                </div>
                <div className="tool">
                    <a onClick={(e) => { e.stopPropagation(); onZoom(1); }}>
                        <Icon src="/icon/hd.svg"></Icon>
                    </a>
                    <a onClick={() => onZoom(-1)}>
                        <Icon src="/icon/reuse.svg"></Icon>
                    </a>
                    <a onClick={() => onZoom(0)}>
                        <Icon src="/icon/picture.svg"></Icon>
                    </a>
                    <a onClick={() => onZoom(0)}>
                        <Icon src="/icon/download.svg"></Icon>
                    </a>
                    <a onClick={() => onZoom(0)}>
                        <Icon src="/icon/favorite.svg"></Icon>
                    </a>
                </div>
            </div>
        </Container>,
        document.body
    ) : null;
}
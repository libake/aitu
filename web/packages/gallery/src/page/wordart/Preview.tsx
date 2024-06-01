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
    background-color: rgba(10, 10, 10, 0.96);
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
        height: 70vh;
    }

    picture {

        img {
            max-width: 60vw;
            max-height: 70vh;
            border-radius: 12px;
            transition: all 0.3s;
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
            padding: 10px 16px;
            border-radius: 60px;
            color: #fff;
            background-color: #2d3240;

            a {
                display: block;
                cursor: pointer;
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
    current: number;
}

export function Preview(props: IProps) {
    let [info, setInfo] = useState({
        ...new dao.Task(),
        results: new Array<{url: string, active: boolean}>(),
    });

    const onFlip = (step: number) => {
        if (!info.results) {
            return;
        }
        if (step < 0 && info.results[0].active) {
            return;
        }
        if (step > 0 && info.results[info.results.length - 1].active) {
            return;
        }
        let idx = 0;
        info.results.forEach((e, i) => {
            if (e.active) {
                idx = i + step;
                e.active = false;
            }
        });
        info.results[idx].active = true;
        setInfo({ ...info });
    }

    // 下载
    const onDownload = () => {
        let link = document.createElement('a');
        info.results.map(e => {
            if (e.active) {
                link.href = e.url;
            }
        });
        link.click();
    }

    useEffect(() => {
        if (props.open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        Object.assign(info, props.data);
        if (info.results && info.results.length > 0) {
            info.results = info.results.map(e => {
                e.active = false;
                return e;
            });
            info.results[props.current].active = true;
        }
        setInfo({ ...info });
    }, [props]);

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

    return props.open ? ReactDOM.createPortal(
        <Container>
            <div className="preview-head">
                <div className="close" onClick={close}>
                    <Icon src="/icon/close.svg"></Icon>
                </div>
            </div>
            <div className="preview-body">
                <picture>
                    {info.results.map(m => m.active && <img src={m.url} key={m.url} style={{transform: `scale(${zoom})`}} />)}
                </picture>
                <div className="flip">
                    <div
                        className="prev"
                        style={{cursor: info.results[0]?.active ? 'not-allowed' : 'pointer'}}
                        onClick={(e) => { e.stopPropagation(); onFlip(-1) }}
                    >
                        <Icon src="/icon/prev.svg" />
                    </div>
                    <div
                        className="next"
                        style={{cursor: info.results[info.results.length - 1]?.active ? 'not-allowed' : 'pointer'}}
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
                    <a onClick={() => setZoom(1)}>
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
                    <Tooltip title="下载AI生成结果">
                        <a onClick={() => onDownload()}>
                            <Icon src="/icon/download.svg"></Icon>
                        </a>
                    </Tooltip>
                    <Tooltip title="收藏">
                        <a onClick={() => onZoom(0)}>
                            <Icon src="/icon/favorite.svg"></Icon>
                        </a>
                    </Tooltip>
                </div>
            </div>
        </Container>,
        document.body
    ) : null;
}
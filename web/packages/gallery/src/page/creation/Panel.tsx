import { useEffect, useState } from "react";
import styled from "styled-components";

import { Upload } from "./Upload";
import {Icon} from "@/common";
import { TextArea } from "./TextArea";

const Container = styled.div`
    margin: 24px 0 24px 24px;
    min-height: 300px;
    border-radius: 20px;
    background-color: #202532;
    box-sizing: border-box;
    overflow: hidden;
    font-size: 12px;

    .icon {
        width: 1em;
        height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
    }

    .demo {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 16px;
        color: #878aab;
    }

    .demo-info {
        cursor: pointer;
    }

    .demo-word {

        &:hover {
            color: #fff;
        }
    }

    .demo-tool {
        cursor: pointer;
    }

    .size {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        padding: 16px;
        color: #fff;
        font-size: 10px;
    }

    .size-item {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 16px;
        border-radius: 4px;
        background-color: rgba(0,0,0,.3);
        cursor: pointer;

        &.active {
            color: #333;
            background-color: ${props => props.theme.primaryColor};
        }
    }

    .size-ratio {
        display: block;
        border: 1px solid #fff;
        background-color: #646974;

        &.s-1v1 {
            width: 12px;
            height: 12px;
        }

        &.s-16v9 {
            width: 16px;
            height: 9px;
        }

        &.s-9v16 {
            width: 9px;
            height: 16px;
        }
    }

    .body {
        color: #fff;

        .tips {
            display: flex;
            padding: 0 16px;
            align-items: center;
            height: 36px;
        }

        .ratio {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 0 16px;
        }
    }

    .foot {
        padding: 24px;
    }
`;
const Collapse = styled.div`
    color: #fff;
    position: relative;
    background-color: rgba(0, 0, 0, .3);
    font-size: 14px;
    z-index: 100;
    
    .info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;
        padding: 16px;
        color: #fff;
        font-size: 14px;
        background-color: #2d3240;
        cursor: pointer;
    }

    .list {
        padding: 16px;
        position: absolute;
        top: 50px;
        left: 0;
        right: 0;
        background-color: #282c38;
    }

    .item {
        display: flex;
        align-items: center;
        height: 66px;
        padding: 16px;
        border-radius: 8px;
        cursor: pointer;

        &:hover {
            background-color: rgba(0, 0, 0, .3);
        }

        &.active {
            background-color: rgba(0, 0, 0, .3);
        }
    }
`
const Button = styled.button`
    width: 100%;
    border-radius: 24px;
    color: #333;
    background-color: ${props => props.theme.primaryColor};
`

interface IProps {
    submit: Function;
}

export function Panel(props: IProps) {
    let [collapse, setCollapse] = useState(false);

    function onCollapse() {
        setCollapse(!collapse);
    }

    let [mode, setMode] = useState({
        info: {
            icon: '/icon/menu.svg',
            text: '文本生成图像',
            value: 1,
            btnText: '生成创意画作',
        },
        list: [
            {
                icon: '/icon/menu.svg',
                text: '文本生成图像',
                value: 1,
                btnText: '生成创意画作',
            }, {
                icon: '/icon/menu.svg',
                text: '相似图像生成',
                value: 2,
                btnText: '生成相似画作',
            }, {
                icon: '/icon/menu.svg',
                text: '图像风格迁移',
                value: 3,
                btnText: '生成指定风格画作',
            }
        ]
    });

    let [req, setReq] = useState({
        size: '1024*1024',
    });

    const onSize = (s: string) => {
        req.size = s;
        setReq({...req});
        console.log(req)
    }

    let [body, setBody] = useState(<></>)

    const onMode = (i: number) => {
        mode.info = mode.list[i];
        setMode({ ...mode });
        switch(mode.info.value) {
            case 1:
                body = <>
                    <TextArea></TextArea>
                    <div className="demo">
                        <div className="demo-info">
                            <span>示例：</span>
                            <span className="demo-word">大气，海盗船，满月航行，丙烯画</span>
                        </div>
                        <div className="demo-tool">
                            <Icon src="/icon/menu.svg"></Icon>
                        </div>
                    </div>
                    <Upload  tag={{text: '参考图', weak: true}}></Upload>
                    <div className="size">
                        <div className={`size-item${req.size == '1024*1024' ? ' active' : ''}`} onClick={() => onSize('1024*1024')}>
                            <span className="size-ratio s-1v1"></span>
                            <span>1&nbsp;&nbsp;:&nbsp;&nbsp;1</span>
                        </div>
                        <div className={`size-item${req.size == '1280*720' ? ' active' : ''}`} onClick={() => onSize('1280*720')}>
                            <span className="size-ratio s-16v9"></span>
                            <span>16&nbsp;&nbsp;:&nbsp;&nbsp;9</span>
                        </div>
                        <div className={`size-item${req.size == '720*1280' ? ' active' : ''}`} onClick={() => onSize('720*1280')}>
                            <span className="size-ratio s-9v16"></span>
                            <span>9&nbsp;&nbsp;:&nbsp;&nbsp;16</span>
                        </div>
                    </div>
                </>
                break;
            case 2:
                body = <>
                    <Upload height={"324px"}></Upload>
                    <div className="tips">
                        <span>手边没有合适的图像？直接试试</span>
                        <span>官方示例</span>
                    </div>
                    <div className="ratio">
                        <span>图像比例{false ? '' : '- -'}</span>
                        <Icon src="/icon/menu.svg"></Icon>
                    </div>
                </>
                break;
            case 3:
                body = <>
                    <Upload tag={{text: '原图', weak: false}}></Upload>
                    <Icon src="/icon/menu.svg"></Icon>
                    <Upload tag={{text: '风格图', weak: false}}></Upload>
                    <div className="tips">
                        <span>手边没有原图和风格图？直接试试</span>
                        <span>官方示例</span>
                    </div>
                    <div className="ratio">
                        <span>图像比例</span>
                        <Icon src="/icon/menu.svg"></Icon>
                    </div>
                </>
                break;
        }
        setBody({...body});
        setCollapse(false);
    }

    const submit = () => {
        props.submit();
    }

    useEffect(() => {
        onMode(0);
    }, []);

    return <Container>
        <Collapse>
            <div className="info" onClick={onCollapse}>
                <div className="text">
                    <Icon src={mode.info.icon} text={mode.info.text} size="16px"></Icon>
                </div>
                <Icon src="/icon/menu.svg"></Icon>
            </div>
            <div className="list" style={{ display: collapse ? 'block' : 'none' }}>
                {mode.list.map((v, i) =>
                    <div className={"item" + (v.value == mode.info.value ? " active" : "")} key={v.value} onClick={() => onMode(i)}>
                        <Icon src={v.icon} text={v.text}></Icon>
                    </div>
                )}
            </div>
        </Collapse>
        <div className="body">
            {body}
        </div>
        <div className="foot">
            <Button onClick={() => submit()}>{mode.info.btnText}</Button>
        </div>
    </Container>
}
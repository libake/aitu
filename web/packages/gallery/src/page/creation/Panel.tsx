import { useEffect, useState } from "react";
import styled from "styled-components";

import { Upload } from "./Upload";
import { Icon } from "@/common";
import { Divider } from "antd";
import { SPELL } from "@/constant";
import { TextArea } from "../common/Textarea";

const Container = styled.div`
    display: grid;
    grid-template-rows: 50px 1fr 90px;
    margin: 24px 0 24px 24px;
    min-height: 300px;
    max-height: calc(100vh - 100px);
    border-radius: 20px;
    background-color: #202532;
    box-sizing: border-box;
    overflow: hidden;
    font-size: 12px;

    .side-head {
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

    .side-body {
        color: #fff;
        overflow-y: auto;

        ::-webkit-scrollbar {
            width: 6px;
            background-color: transparent;
        }

        ::-webkit-scrollbar-thumb {
            background-color: #3b3e4f;
        }

        ::-webkit-scrollbar-track-piece {
            background-color: #1c2029;
        }

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

        .icon {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
        }
    }

    .side-foot {
        padding: 24px;
    }
`;
const Button = styled.button`
    width: 100%;
    border-radius: 24px;
    color: #333;
    background-color: ${props => props.theme.primaryColor};
`
const TextImage = styled.div`
    position: relative;
    margin: 16px;
    border: 1px dashed #2d3240;
    border-radius: 8px;
    color: #999;
    background-color: #0f1319;

    .main {
        padding: 0 12px;

        &::after {
            position: absolute;
            bottom: 1px;
            left: 1px;
            right: 1px;
            content: "";
            background-color: #0f1319;
            z-index: -1;
        }
    }

    textarea {
        border: none;
        width: 100%;
        height: 100px;
        outline: none;
        background-color: transparent;
    }

    .tips {
        display: flex;
        justify-content: end;
        align-items: center;
        height: 30px;
        padding: 6px 0;
        font-size: 12px;
    }

    .collapse {
        border-top: 1px solid #fff;

        .info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 50px;
            padding: 16px;
            color: #fff;
            font-size: 14px;
            cursor: pointer;
        }
        
        .list {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: repeat(2, auto);
            gap: 16px;
            padding: 16px;
        }

        .item {
            background-color: #2d3240;
            border-radius: 4px;
            cursor: pointer;
            border-radius: 4px;
            box-sizing: border-box;
            overflow: hidden;

            &:hover {
                color: #fff;
            }

            &.active {
                border: 1px solid ${props => props.theme.primaryColor};
            }
            
            img {
                width: 100%;
            }

            p {
                margin: 0;
                text-align: center;
                white-space: nowrap;
                font-size: 12px;
                font-weight: 400;
            }
        }
    }
`

interface IProps {
    submit: Function;
    className: string;
}

export function Panel(props: IProps) {
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
        ],
        spell: SPELL,
        collapse: false,
        selectKeys: new Array<string>(),
    });

    let [req, setReq] = useState({
        input: {
            prompt: '',
        },
        parameters: {
            size: '1024*1024',
        }
    });

    const onSize = (s: string) => {
        req.parameters.size = s;
        setReq({ ...req });
    }

    const onSpell = (idx: number) => {
        let tmp = new Set(mode.selectKeys);
        mode.spell.styleList[idx].active = !mode.spell.styleList[idx].active;
        if (mode.spell.styleList[idx].active) {
            tmp.add(mode.spell.styleList[idx].name);
        } else {
            tmp.delete(mode.spell.styleList[idx].name);
        }
        mode.selectKeys = Array.from(tmp);
        setMode({ ...mode });
    }

    const setTextArea = (v: string) => {
        req.input.prompt = v;
        setReq({ ...req });
    }

    const onMode = (i: number) => {
        mode.info = mode.list[i];
        setMode({ ...mode, collapse: false });
    }

    const submit = () => {
        props.submit(req);
    }

    useEffect(() => {
        onMode(0);
    }, []);

    return <Container className={props.className}>
        <div className="side-head">
            <div className="info" onClick={() => setMode({ ...mode, collapse: !mode.collapse })}>
                <div className="text">
                    <Icon src={mode.info.icon} text={mode.info.text} size="16px"></Icon>
                </div>
                <Icon src={mode.collapse ? "/icon/arrow-up-bold.svg" : "/icon/arrow-down-bold.svg"}></Icon>
            </div>
            <div className="list" style={{ display: mode.collapse ? 'block' : 'none' }}>
                {mode.list.map((v, i) =>
                    <div className={"item" + (v.value == mode.info.value ? " active" : "")} key={v.value} onClick={() => onMode(i)}>
                        <Icon src={v.icon} text={v.text}></Icon>
                    </div>
                )}
            </div>
        </div>
        <div className="side-body">
            {/* 文本生成图像 */}
            {mode.info.value == 1 && <>
                <TextImage>
                    <div className="main">
                        {/* <textarea
                            onChange={(e) => setTextArea(e.target.value)}
                            defaultValue={req.input.prompt + mode.selectKeys.join(',')}
                            placeholder="试试输入你心中的画面，尽量描述具体，可以尝试用一些风格修饰词辅助你的表达。"
                        ></textarea> */}
                        <TextArea
                            name="prompt"
                            value={req.input.prompt}
                            onChange={(v: string) => setReq({ ...req, input: { ...req.input, prompt: v } })}
                            placeholder="试试输入你心中的画面，尽量描述具体，可以尝试用一些风格修饰词辅助你的表达。"
                        ></TextArea>
                        <div className="tips">
                            <div className="limit">{req.input.prompt.length}/500</div>
                            {req.input.prompt.length > 0 && <>
                                <Divider type="vertical" />
                                <Icon src="/icon/error.svg"></Icon>
                            </>
                            }
                        </div>
                    </div>
                    <div className="collapse">
                        <div className="info">
                            <div className="text">
                                <Icon src="/icon/menu.svg" text="咒语书"></Icon>
                            </div>
                            <Icon src="/icon/menu.svg"></Icon>
                        </div>
                        <div className="list">
                            {mode.spell.styleList.map((v, i) =>
                                <div className={`item${v.active ? ' active' : ''}`} key={i} onClick={() => onSpell(i)}>
                                    <img src={v.pic} alt="" />
                                    <p>{v.name}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </TextImage>
                <div className="demo">
                    <div className="demo-info">
                        <span>示例：</span>
                        <span className="demo-word" onClick={(e) => setReq({ ...req, input: { ...req.input, prompt: '大气，海盗船，满月航行，丙烯画' } })}>大气，海盗船，满月航行，丙烯画</span>
                    </div>
                    <div className="demo-tool">
                        <Icon src="/icon/menu.svg"></Icon>
                    </div>
                </div>
                <Upload tag={{ text: '参考图', weak: true }}></Upload>
                <div className="size">
                    <div className={`size-item${req.parameters.size == '1024*1024' ? ' active' : ''}`} onClick={() => onSize('1024*1024')}>
                        <span className="size-ratio s-1v1"></span>
                        <span>1&nbsp;&nbsp;:&nbsp;&nbsp;1</span>
                    </div>
                    <div className={`size-item${req.parameters.size == '1280*720' ? ' active' : ''}`} onClick={() => onSize('1280*720')}>
                        <span className="size-ratio s-16v9"></span>
                        <span>16&nbsp;&nbsp;:&nbsp;&nbsp;9</span>
                    </div>
                    <div className={`size-item${req.parameters.size == '720*1280' ? ' active' : ''}`} onClick={() => onSize('720*1280')}>
                        <span className="size-ratio s-9v16"></span>
                        <span>9&nbsp;&nbsp;:&nbsp;&nbsp;16</span>
                    </div>
                </div>
            </>}
            {/* 相似图像生成 */}
            {mode.info.value == 2 && <>
                <Upload height={"324px"}></Upload>
                <div className="tips">
                    <span>手边没有合适的图像？直接试试</span>
                    <span>官方示例</span>
                </div>
                <div className="ratio">
                    <span>图像比例{false ? '' : '- -'}</span>
                    <Icon src="/icon/menu.svg"></Icon>
                </div>
            </>}
            {/* 图像风格迁移 */}
            {mode.info.value == 3 && <>
                <Upload tag={{ text: '原图', weak: false }}></Upload>
                <Icon className="icon" src="/icon/qiehuan.svg"></Icon>
                <Upload tag={{ text: '风格图', weak: false }}></Upload>
                <div className="tips">
                    <span>手边没有原图和风格图？直接试试</span>
                    <span>官方示例</span>
                </div>
                <div className="ratio">
                    <span>图像比例</span>
                    <Icon src="/icon/menu.svg"></Icon>
                </div>
            </>}
        </div>
        <div className="side-foot">
            <Button onClick={() => submit()}>{mode.info.btnText}</Button>
        </div>
    </Container>
}
import { useContext, useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import styled from "styled-components";
import { Slider } from 'antd';

import { Upload } from "./Upload";
import { Icon, TextArea } from "@/common";
import { dao, srv } from "core";

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
            box-sizing: border-box;
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
        margin: 16px 0;
        color: #878aab;
    }

    .demo-info {
        cursor: pointer;
        display: grid;
        grid-template-columns: auto 1fr;
    }

    .demo-word {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;

        &:hover {
            color: #fff;
        }
    }

    .demo-tool {
        cursor: pointer;
    }

    .tpl {
        position: relative;
        padding: 16px;
        background-color: #0f1319;
        border-radius: 12px;

        .item {
            background-color: #2d3240;
            border-radius: 4px;
            cursor: pointer;
            border-radius: 4px;
            box-sizing: border-box;
            overflow: hidden;
            border: 1px solid transparent;

            &:hover {
                color: #fff;
            }

            &.active {
                border-color: var(--primary-color);
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

    .tpl-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fff;
        font-size: 14px;
        cursor: pointer;
        margin-bottom: 16px;
    }
    
    .tpl-body {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(2, auto);
        gap: 16px;
    }

    .size {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
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
            background-color: var(--primary-color);
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
        padding: 16px;

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

        button {
            width: 100%;
            border-radius: 24px;
            color: #333;
            background-color: var(--primary-color);
        }
    }
`;
const TextImage = styled.div`
    position: relative;
    border: 1px dashed #2d3240;
    border-radius: 8px;
    color: #999;
    background-color: #0f1319;
`
const Popup = styled.div`
    position: fixed;
    top: 76px;
    left: 396px;
    border-radius: 20px;
    overflow: hidden;
    background-color: #1d212c;
    z-index: 100;

    .popup-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;
        padding: 0 16px;
        background-color: #282c38;

        .text {
            color: var(--text-color);
        }

        .tool {
            cursor: pointer;
        }
    }

    .popup-body {
        display: grid;
        grid-template-columns: 80px 1fr;
        min-height: 500px;
    }

    .tab-menu {
        gap: 16px;
        
        a {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 50px;
            position: relative;
            color: var(--text-color-secondary);
        }

        .active {
            color: var(--text-color);

            &::after {
                position: absolute;
                right: 0;
                content: "";
                width: 2px;
                height: 20px;
                background-color: var(--primary-color);
            }
        }
    }

    .tab-list {
        display: grid;
        grid-template-columns: repeat(4, 80px);
        grid-template-rows: 100px;
        gap: 16px;
        padding: 16px;
        min-height: 100%;
        overflow-y: auto;
        border-left: 1px solid #2d3240;
    }
`
const Card = styled.div`
    display: grid;
    grid-template-rows: 1fr auto;
    background-color: #2d3240;
    cursor: pointer;
    border-radius: 4px;
    box-sizing: border-box;
    overflow: hidden;
    border: 1px solid transparent;

    &:hover {
        color: var(--text-color);
    }

    &.active {
        border-color: var(--primary-color);
    }
    
    img {
        width: 100%;
    }

    .card-body {
        max-height: 100px;
        overflow: hidden;
    }

    .card-foot {
        display: flex;
        justify-content: center;
        align-items: center;
        white-space: nowrap;
        font-size: 12px;
        font-weight: 400;
        color: var(--text-color-secondary);
    }
`

interface IProps {
    submit: Function;
    className: string;
    data: {
        input: {
            prompt: string,
            ref_img?: string,
        },
        parameters: {
            n: number,
            size: string,
            style?: string,
        },
        other?: dao.Template,
    }
}

export function Panel(props: IProps) {
    let [req, setReq] = useState({
        ...props.data,
    });
    let [mode, setMode] = useState({
        info: {
            icon: '/icon/text.svg',
            text: '文本生成图像',
            value: 1,
            btnText: '生成创意画作',
        },
        list: [
            {
                icon: '/icon/text.svg',
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
        collapse: false,
    });

    const onSize = (s: string) => {
        req.parameters.size = s;
        setReq({ ...req });
    }

    const [template, setTemplate] = useState({
        info: {
            ...new dao.Template(),
            prompt: ['大气，海盗船，满月航行，丙烯画'],
        },
        list: new Array<dao.Template>(),
        collapse: true,
        random: 0,
    });

    const getTemplate = async (categoryId = 0) => {
        let data = {
            currPage: 1,
            pageSize: 100,
            queryBy: [
                {
                    col: 'categoryId',
                    val: categoryId,
                }
            ],
        }
        let res = await srv.Template.list(data);
        if (res.code == 1000) {
            template.list = res.data.list;
        } else {
            template.list = [];
        }
        setTemplate({ ...template });
    }

    // 创意模板
    const onTemplate = (item: dao.Template) => {
        Object.assign(template.info, item);
        setTemplate({ ...template });
        req.other = item;
        if (!!item.code) {
            req.parameters.style = item.code;
        }
        setReq({ ...req });
    }

    const onMode = (i: number) => {
        mode.info = mode.list[i];
        setMode({ ...mode, collapse: false });
    }

    let [category, setCategory] = useState({
        info: new dao.Category(),
        list: new Array<dao.Category>(),
        open: false,
        prompt: '',
    });

    const getCategory = async () => {
        let data = {
            currPage: 1,
            pageSize: 100,
            queryBy: [
                { col: 'scene', val: 'creative-style' }
            ],
        }
        let res = await srv.Category.list(data);
        if (res.code == 1000) {
            category.list = res.data.list;
            if (category.list.length > 0) {
                category.info = category.list[0];
                getTemplate(category.list[0].id);
                if (category.info.prompt.length > 0) {
                    category.prompt = category.info.prompt[0];
                }
            }
        } else {
            category.list = [];
        }
        setCategory({ ...category });
    }

    const onCategory = (item: dao.Category) => {
        category.info = item;
        getTemplate(item.id);
    }

    const onPrompt = () => {
        template.random = template.info.prompt.length - template.random - 1;
        if (template.random < 0) {
            template.random = 0;
        }
        setTemplate({ ...template });
    }

    const submit = () => {
        props.submit(req);
    }

    useEffect(() => {
        onMode(0);
        getCategory();
        Object.assign(req, props.data);
        setReq({ ...req });
        if (!!props.data.other) {
            onTemplate(props.data.other);
        }
    }, [props.data]);

    return <Container className={props.className}>
        <div className="side-head">
            <div className="info">
                <div className="text">
                    <Icon src={mode.info.icon} text={mode.info.text} size="16px" />
                </div>
                {/* <Icon src={mode.collapse ? "/icon/arrow-up-bold.svg" : "/icon/arrow-down-bold.svg"} /> */}
            </div>
            <div className="list" style={{ display: mode.collapse ? 'block' : 'none' }}>
                {mode.list.map((v, i) =>
                    <div className={"item" + (v.value == mode.info.value ? " active" : "")} key={v.value} onClick={() => onMode(i)}>
                        <Icon src={v.icon} text={v.text} />
                    </div>
                )}
            </div>
        </div>
        <div className="side-body">
            {/* 文本生成图像 */}
            {mode.info.value == 1 && <>
                <TextImage>
                    <TextArea
                        name="prompt"
                        value={req.input.prompt}
                        rows={5}
                        limit={500}
                        onChange={(v: string) => setReq({ ...req, input: { ...req.input, prompt: v } })}
                        placeholder="试试输入你心中的画面，尽量描述具体，可以尝试用一些风格修饰词辅助你的表达。"
                    ></TextArea>
                </TextImage>
                {template.info.prompt.length > 0 && <div className="demo">
                    <div className="demo-info">
                        <Icon src="/icon/wand.svg" text="推荐：" />
                        <span
                            className="demo-word"
                            onClick={() => setReq({ ...req, input: { ...req.input, prompt: template.info.prompt[template.random] } })}
                        >{template.info.prompt[template.random]}</span>
                    </div>
                    <div className="demo-tool">
                        <Icon src="/icon/refresh.svg" onClick={() => onPrompt()} />
                    </div>
                </div>}
                <div className="tpl">
                    <div className="tpl-head">
                        <div className="text">创意模板</div>
                    </div>
                    <div className="tpl-body" style={{ display: template.collapse ? 'grid' : 'none' }}>
                        {template.list.map((v, i) =>
                            i < 7 && <Card className={template.info.id == v.id ? ' active' : ''} key={i} onClick={() => onTemplate(v)}>
                                <picture className="card-body">
                                    <img src={v.outerImage} />
                                </picture>
                                <div className="card-foot">{v.name}</div>
                            </Card>
                        )}
                        <Card onClick={() => setCategory({ ...category, open: true })}>
                            <picture className="card-body">
                                <img src="/O1CN01FU1617-132-132.jpg" />
                            </picture>
                            <div className="card-foot">更多模板</div>
                        </Card>
                    </div>
                </div>
                <Upload onChange={(file: string) => setReq({ ...req, input: { ...req.input, ref_img: file } })} tag={{ text: '参考图', weak: true }} height="160px"></Upload>
                <h3>图片比例</h3>
                <div className="size">
                    <div className={`size-item${req.parameters.size == '1024*1024' ? ' active' : ''}`} onClick={() => onSize('1024*1024')}>
                        <span className="size-ratio s-1v1"></span>
                        <span>1&nbsp;:&nbsp;1</span>
                    </div>
                    <div className={`size-item${req.parameters.size == '1280*720' ? ' active' : ''}`} onClick={() => onSize('1280*720')}>
                        <span className="size-ratio s-16v9"></span>
                        <span>16&nbsp;:&nbsp;9</span>
                    </div>
                    <div className={`size-item${req.parameters.size == '720*1280' ? ' active' : ''}`} onClick={() => onSize('720*1280')}>
                        <span className="size-ratio s-9v16"></span>
                        <span>9&nbsp;:&nbsp;16</span>
                    </div>
                </div>
                <h3>生成张数</h3>
                <Slider
                    min={0}
                    max={4}
                    defaultValue={req.parameters.n}
                    marks={
                        {
                            0: { label: '0', style: { color: '#fff' } },
                            1: { label: '1', style: { color: '#fff' } },
                            2: { label: '2', style: { color: '#fff' } },
                            3: { label: '3', style: { color: '#fff' } },
                            4: { label: '4', style: { color: '#fff' } }
                        }}
                    onChange={(v) => setReq({ ...req, parameters: { ...req.parameters, n: v } })}
                    styles={{
                        track: {
                            background: 'var(--primary-color)',
                        },
                        rail: {
                            background: '#fff',
                        },
                    }}
                />
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
                    <Icon src="/icon/menu.svg" />
                </div>
            </>}
            {/* 图像风格迁移 */}
            {mode.info.value == 3 && <>
                <Upload tag={{ text: '原图', weak: false }} height="182px"></Upload>
                <Icon className="icon" src="/icon/qiehuan.svg" />
                <Upload tag={{ text: '风格图', weak: false }} height="182px"></Upload>
                <div className="tips">
                    <span>手边没有原图和风格图？直接试试</span>
                    <span>官方示例</span>
                </div>
                <div className="ratio">
                    <span>图像比例</span>
                    <Icon src="/icon/menu.svg" />
                </div>
            </>}
        </div>
        <div className="side-foot">
            <button onClick={() => submit()}>{mode.info.btnText}</button>
        </div>
        {/* 创意模板弹窗 */}
        {category.open && ReactDOM.createPortal(<Popup>
            <div className="popup-head">
                <div className="text">创意模板</div>
                <Icon className="tool" src="/icon/close-bold.svg" onClick={() => setCategory({ ...category, open: false })} />
            </div>
            <div className="popup-body">
                <div className="tab-menu">
                    {category.list.map((m) => <a className={m.id == category.info.id ? 'active' : ''} key={m.id} onClick={() => onCategory(m)}>
                        {m.name}
                    </a>)}
                </div>
                <div className="tab-list">
                    {template.list.map((v, i) =>
                        <Card className={template.info.id == v.id ? ' active' : ''} key={i} onClick={() => onTemplate(v)}>
                            <picture className="card-body">
                                <img src={v.outerImage} alt="" />
                            </picture>
                            <div className="card-foot">{v.name}</div>
                        </Card>
                    )}
                </div>
            </div>
        </Popup>, document.body)
        }
    </Container>
}
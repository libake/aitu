import { useEffect, useRef, useState } from "react";
import ReactDOM from 'react-dom';
import styled from "styled-components";

import { Icon, TextArea } from "@/common";
import { dao, srv } from "core";
import { Slider, message } from "antd";

const Container = styled.div`
    display: grid;
    grid-template-rows: 1fr 90px;
    margin: 24px 0 24px 24px;
    border-radius: 20px;
    background-color: #202532;
    box-sizing: border-box;
    font-size: 12px;

    .side-body {
        padding: 16px;
        color: #fff;

        .ratio {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 0 16px;
        }

        .radio {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            font-size: 10px;
        }

        .radio-item {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 16px;
            border-radius: 4px;
            background-color: #393d50;
            cursor: pointer;

            &.active {
                color: #333;
                background-color: var(--primary-color);
            }
        }
    }

    .input-group {
        display: flex;
        align-items: center;
        background-color: #141822;
        border: 1px solid #2d3240;
        border-radius: 8px;

        input {
            flex: 1;
            border: none;
            background-color: transparent;
            line-height: 24px;
            padding: 8px 42px 8px 12px;
            color: hsla(0,0%,100%,.9);
            outline: none;
        }

        .suffix {
            margin-right: 16px;
        }
    }

    .cell {
        cursor: pointer;
        display: grid;
        grid-template-columns: 118px 1fr;
        gap: 24px;
        background-color: #282c38;
        border-radius: 12px;
        overflow: hidden;
    }

    .cell-body {
        height: 118px;
        background-color: #333646;

        img {
            width: 100%;
        }
    }

    .cell-text {
        display: grid;
        grid-template-columns: 1fr 36px;
        justify-content: center;
        align-items: center;

        .body {
            width: 130px;
        }

        p {
            margin: 0;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
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

    .side-foot {
        padding: 24px;
    }
`;
const Button = styled.button`
    width: 100%;
    border-radius: 24px;
    color: #333;
    background-color: var(--primary-color);
`
const Popup = styled.div`
    position: fixed;
    top: 76px;
    left: 396px;
    width: 434px;
    max-height: 785px;
    border-radius: 20px;
    font-size: 12px;
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
        padding: 16px;
    }

    .tab-menu {
        display: flex;
        
        a {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 4px 16px;
            color: var(--text-color);
            background-color: #282c38;
        }

        .active {
            border-radius: 4px;
            color: var(--heading-text-color);
            background-color: var(--primary-color);
        }
    }

    .tab-list {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        min-height: 100%;
        overflow-y: auto;
    }

    .cell {
        display: flex;
        cursor: pointer;
    }

    .cell-text {
        flex: 1;

        span:hover {
            color: #fff;
        }
    }

    .textarea {
        border: 1px solid #424b5e;
        border-radius: 8px;
        background-color: #15171f;

        .suffix {
            color: #fff;
        }
    }

    .radio-item {
        

        .cell {
            padding: 16px 0;
            color: var(--text-color);
        }
    }

    .popup-foot {
        display: flex;
        justify-content: flex-end;
        gap: 16px;
        padding: 16px;
    }

    .btn-default, .btn-primary {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 34px;
        min-width: 80px;
        border-radius: 20px;
        color: var(--text-color);
    }

    .btn-default {
        border: 1px solid var(--text-color);
        background-color: transparent;
    }

    .btn-primary {
        color: var(--heading-text-color);
        background-color: var(--primary-color);
    }
`
const Card = styled.div`
    display: grid;
    grid-template-rows: 1fr 24px;
    color: var(--text-color);
    font-size: 10px;
    background-color: #2d3240;
    border-radius: 10px;
    border: 1px solid transparent;
    overflow: hidden;
    cursor: pointer;

    &.active {
        border-color: var(--primary-color);
    }

    img {
        width: 100%;
    }

    .card-foot {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 24px;
    }
`

interface IProps {
    submit: Function;
    className: string;
    data?: {
        input: {
            prompt: string,
            text: {
                text_content: string,
                output_image_ratio: string,
            },
            texture_style: string,
        },
        parameters: {
            n: number,
            alpha_channel: boolean,
        },
        other: {
            text: string[],
            thumb: string,
        }
    }
}

export function Panel(props: IProps) {
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

    const onSize = (s: string) => {
        req.input.text.output_image_ratio = s;
        setReq({ ...req });
    }

    const setInput = (evt: any) => {
        let tmp = String(evt.target.value);
        if (tmp.length > 4) {
            return;
        }
        req.input.text.text_content = evt.target.value;
        setReq({...req});
    }

    let [category, setCategory] = useState({
        info: new dao.Category(),
        list: new Array<dao.Category>(),
        open: false,
        styleType: '风格模板',
        prompt: '',
        random: 0,
    });

    const getCategory = async () => {
        let data = {
            currPage: 1,
            pageSize: 1000,
            queryBy: [
                {col:'scene', val: 'word-style'},
                {col:'status', val: 1}
            ]
        }
        let res = await srv.Category.list(data);
        if (res.code == 1000) {
            category.list = res.data.list;
            if (category.list.length > 0) {
                category.info = category.list[0];
                if (category.info.prompt.length > 0) {
                    category.prompt = category.info.prompt[0];
                }
                getTemplate(category.list[0].id);
            }
        } else {
            category.list = [];
        }
        setCategory({ ...category });
    }

    const onCategory = (item: dao.Category) => {
        category.info = item;
        if (category.info.prompt.length > 0) {
            category.prompt = category.info.prompt[0];
        }
        setCategory({...category});
        getTemplate(item.id);
    }

    const disCategory = () => {
        category.open = true;
        req.input.prompt = '';
        setCategory({...category});
        setReq({...req});
    }

    const onRadio = (v: string) => {
        category.styleType = v;
        setCategory({...category});
    }

    const onPrompt = () => {
        category.random = category.info.prompt.length - category.random - 1;
        if (category.random < 0) {
            category.random = 0;
        }
        setCategory({...category});
    }

    const [template, setTemplate] = useState({
        info: new dao.Template(),
        list: new Array<dao.Template>(),
    });

    const getTemplate = async (categoryId: number) => {
        let data = {
            currPage: 1,
            pageSize: 10,
            queryBy: [
                {col: 'categoryId', val: categoryId},
            ]
        }
        let res = await srv.Template.list(data);
        if (res.code == 1000) {
            template.list = res.data.list;
        } else {
            template.list = [];
        }
        setTemplate({...template});
    }

    const onStyle = () => {
        req.other.text = [category.info.name];
        switch(category.styleType) {
            case '风格模板':
                req.input.prompt = category.info.name;
                req.input.texture_style = template.info.code;
                req.other.text.push(template.info.name);
                req.other.thumb = template.info.outerImage;
                break;
            case '自定义':
                req.input.texture_style = category.info.code;
                req.other.text = req.other.text.concat(['自定义']);
                req.other.thumb = '/word-144.png';
                break;
        }
        setReq({...req});
        category.open = false;
        setCategory({...category});
    }

    const flag = useRef(true);

    const submit = () => {
        if (!!!req.input.text.text_content) {
            message.error('请填写文字内容');
            return;
        }
        if (req.other.text.length == 0) {
            message.error('请选择文字风格');
            return;
        }
        if (flag.current) {
            flag.current = false;
            props.submit(req);
            setTimeout(() => {
                flag.current = true;
            }, 8000);
        } else {
            message.warning('请勿频繁点击');
        }
    }

    useEffect(() => {
        getCategory();
    }, []);

    useEffect(() => {
        Object.assign(req, props.data);
        setReq({...req});
    }, [props.data]);

    return <Container className={props.className}>
        <div className="side-body">
            <h3>文字内容(1-4个字符)</h3>
            <div className="input-group">
                <input type="text" value={req.input.text.text_content} onChange={(e) => setInput(e)} placeholder="支持中文、字母、数字" />
                <span className="suffix">{req.input.text.text_content.length}/4</span>
            </div>
            <h3>文字风格</h3>
            <div className="cell" onClick={() => disCategory()}>
                <div className="cell-body">
                    <img src={req.other.thumb || '/word-136.png'} />
                </div>
                <div className="cell-text">
                    <div className="body">
                        {req.other.text.length == 0 && '请选择文字风格'}{req.other.text.length > 0 && `${req.other.text[0]}-${req.other.text[1]}`}
                        {req.other.text[1] == '自定义' && <p>{req.input.prompt}</p>}
                    </div>
                    <Icon src="/icon/next.svg" />
                </div>
            </div>
            <h3>图片比例</h3>
            <div className="radio">
                <div className={`radio-item${req.input.text.output_image_ratio == '1:1' ? ' active' : ''}`} onClick={() => onSize('1:1')}>
                    <span className="size-ratio s-1v1"></span>
                    <span>1&nbsp;:&nbsp;1</span>
                </div>
                <div className={`radio-item${req.input.text.output_image_ratio == '16:9' ? ' active' : ''}`} onClick={() => onSize('16:9')}>
                    <span className="size-ratio s-16v9"></span>
                    <span>16&nbsp;:&nbsp;9</span>
                </div>
                <div className={`radio-item${req.input.text.output_image_ratio == '9:16' ? ' active' : ''}`} onClick={() => onSize('9:16')}>
                    <span className="size-ratio s-9v16"></span>
                    <span>9&nbsp;:&nbsp;16</span>
                </div>
            </div>
            <h3>图片背景</h3>
            <div className="radio">
                <a className={`radio-item${req.parameters.alpha_channel ? '' : ' active'}`} onClick={() => setReq({...req, parameters: {...req.parameters, alpha_channel: false}})}>生成背影</a>
                <a className={`radio-item${req.parameters.alpha_channel ? ' active' : ''}`} onClick={() => setReq({...req, parameters: {...req.parameters, alpha_channel: true}})}>透明背景</a>
            </div>
            <h3>生成张数</h3>
            <Slider
                min={1}
                max={4}
                defaultValue={req.parameters.n}
                marks={
                    {
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
        </div>
        <div className="side-foot">
            <Button onClick={() => submit()}>生成创意艺术字</Button>
        </div>
        {/* 文字风格 */}
        {category.open && ReactDOM.createPortal(<Popup>
            <div className="popup-head">
                <Icon className="text" src="/icon/text.svg" text="文字风格" />
                <Icon className="tool" src="/icon/close-bold.svg" onClick={() => setCategory({...category, open: false})} />
            </div>
            <div className="popup-body">
                <div className="tab-menu">
                    {category.list.map((m) => <a className={m.id == category.info.id ? 'active' : ''} key={m.id} onClick={() => onCategory(m)}>
                        {m.name}
                    </a>)}
                </div>
                <div className="radio-item" onClick={() => onRadio('风格模板')}>
                    <div className="cell">
                        <input type="radio" name="style" checked={category.styleType == '风格模板'} onChange={() => {}} id="style-1" />
                        <label htmlFor="style-1">风格模板</label>
                    </div>
                    <div className="tab-list">
                    {template.list.map((v, i) =>
                        <Card className={template.info.id == v.id ? 'active' : ''} key={i} onClick={() => setTemplate({...template, info: v})}>
                            <picture className="card-body">
                                <img src={v.innerImage} alt={v.name} />
                            </picture>
                            <div className="card-foot">{v.name}</div>
                        </Card>
                    )}
                    </div>
                </div>
                <div className="radio-item" onClick={() => onRadio('自定义')}>
                    <div className="cell">
                        <input type="radio" name="style" checked={category.styleType == '自定义'} onChange={() => {}} id="style-2" />
                        <label htmlFor="style-2">自定义</label>
                    </div>
                    <TextArea
                        className="textarea"
                        name="prompt"
                        value={req.input.prompt}
                        rows={5}
                        limit={200}
                        onChange={(v: string) => setReq({ ...req, input: { ...req.input, prompt: v } })}
                        placeholder="试试输入你心中的文字创意，输入自定义风格时已选择的风格模版将失效"
                    ></TextArea>
                    {category.info.prompt && <div className="cell">
                        <div className="cell-text">
                            <label>示例：</label>
                            <span onClick={() => setReq({...req, input: { ...req.input, prompt: category.info.prompt[category.random]}})}>{category.info.prompt[category.random]}</span>
                        </div>
                        <Icon className="cell-icon" src="/icon/update.svg" onClick={() => onPrompt()} />
                    </div>}
                </div>
            </div>
            <div className="popup-foot">
                <button className="btn-default" onClick={() => setCategory({...category, open: false})}>取消</button>
                <button className="btn-primary" onClick={() => onStyle()}>确认</button>
            </div>
        </Popup>, document.body)
        }
    </Container>
}
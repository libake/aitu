import { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import styled from "styled-components";

import { Icon, TextArea } from "@/common";
import { dao, srv } from "@/core";

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
                background-color: ${props => props.theme.primaryColor};
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
    background-color: ${props => props.theme.primaryColor};
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
            color: var(--wanx-wh);
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
            color: var(--wanx-wh);
            background-color: #282c38;
        }

        .active {
            border-radius: 4px;
            color: var(--wanx-wh-01);
            background-color: ${props => props.theme.primaryColor};
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
    }

    .cell-text {
        flex: 1;
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
            color: var(--wanx-wh);
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
        align-items: center;
        height: 34px;
        border-radius: 20px;
        color: var(--wanx-wh);
    }

    .btn-default {
        border: 1px solid var(--wanx-wh);
        background-color: transparent;
    }

    .btn-primary {
        background-color: ${props => props.theme.primaryColor};
    }
`
const Card = styled.div`
    display: grid;
    grid-template-rows: 1fr 24px;
    color: var(--wanx-wh);
    font-size: 10px;
    background-color: #2d3240;
    border-radius: 10px;
    border: 1px solid transparent;
    overflow: hidden;

    &.active {
        border-color: #f40;
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
            n: 4,
            alpha_channel: false,
        }
    });

    const onSize = (s: string) => {
        req.input.text.output_image_ratio = s;
        setReq({ ...req });
    }

    const setInput = (evt: any) => {
        req.input.text.text_content = evt.target.value;
        setReq({...req});
    }

    let [category, setCategory] = useState({
        info: new dao.Category(),
        open: false,
        list: new Array<dao.Category>(),
        selectKey: 0,
        styleType: 1,
    });

    const getCategory = async () => {
        let data = {
            currPage: 1,
            pageSize: 1000,
            queryBy: [
                {col:'scene', val: 'word_art'}
            ],
            tree: true
        }
        let res = await srv.Category.list(data);
        if (res.code == 1000) {
            category.list = res.data.list;
            if (category.list.length > 0) {
                category.info = category.list[0];
            }
        } else {
            category.list = [];
        }
        
        setCategory({ ...category });
    }

    const onCategory = (item?: dao.Category, childIdx?: number) => {
        console.log(item)
        if (!!item) {
            if (!!childIdx) {
                category.info.children.map((m) => {
                    m.active = m.id == childIdx ? true : false;
                    return m;
                });
            } else {
                category.info = item;
            }
        } else {
            category.info = new dao.Category();
        }
        setCategory({...category});
    }

    const onRadio = (v: number) => {
        category.styleType = v;
        setCategory({...category});
    }

    const submit = () => {
        props.submit(req);
    }

    useEffect(() => {
        getCategory();
    }, []);

    return <Container className={props.className}>
        <div className="side-body">
            <h3>文字内容(1-4个字符)</h3>
            <div className="input-group">
                <input type="text" value={req.input.text.text_content} onChange={(e) => setInput(e)} placeholder="支持中文、字母、数字" />
                <span className="suffix">0/4</span>
            </div>
            <h3>文字风格</h3>
            <div className="cell" onClick={() => setCategory({...category, open: true})}>
                <div className="cell-body">
                    <img src="/word-136.png" />
                </div>
                <div className="cell-text">
                    <label htmlFor="">{req.input.prompt ? category.info.name : '请选择文字风格'}</label>
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
                <div className="radio-item" onClick={() => onRadio(1)}>
                    <div className="cell">
                        <input type="radio" name="style" checked={category.styleType == 1} id="style-1" />
                        <label htmlFor="style-1">风格模板</label>
                    </div>
                    <div className="tab-list">
                    {category.info.children.map((v, i) =>
                        <Card className={v.active ? 'active' : ''} key={i} onClick={() => onCategory(v, v.id)}>
                            <picture className="card-body">
                                <img src={v.innerImage} alt={v.name} />
                            </picture>
                            <div className="card-foot">{v.name}</div>
                        </Card>
                    )}
                    </div>
                </div>
                <div className="radio-item" onClick={() => onRadio(2)}>
                    <div className="cell">
                        <input type="radio" name="style" checked={category.styleType == 2} id="style-2" />
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
                    <div className="cell">
                        <div className="cell-text">
                            <label>示例：</label>
                            <span>{category.info.prompt && category.info.prompt[0]}</span>
                        </div>
                        <Icon className="cell-icon" src="/icon/update.svg" />
                    </div>
                </div>
            </div>
            <div className="popup-foot">
                <button className="btn-default">取消</button>
                <button className="btn-primary">确认</button>
            </div>
        </Popup>, document.body)
        }
    </Container>
}
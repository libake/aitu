import { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import styled from "styled-components";

import { Upload } from "./Upload";
import { Icon, TextArea } from "@/common";
import { dao, srv } from "@/core";

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

    .box {
        position: relative;
        border-top: 1px solid #252934;

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
                border-color: ${props => props.theme.primaryColor};
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

    .box-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;
        padding: 16px;
        color: #fff;
        font-size: 14px;
        cursor: pointer;
    }
    
    .box-body {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(2, auto);
        gap: 16px;
        padding: 16px;
    }
`
const Popup = styled.div`
    position: fixed;
    top: 76px;
    left: 396px;
    width: 400px;
    height: 600px;
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
            color: var(--wanx-wh);
        }

        .tool {
            cursor: pointer;
        }
    }

    .popup-body {
        display: grid;
        grid-template-columns: 80px 1fr;
        height: 100%;
    }

    .tab-menu {
        gap: 16px;
        
        a {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 50px;
            position: relative;
            color: var(--wanx-wh-05);
        }

        .active {
            color: var(--wanx-wh);

            &::after {
                position: absolute;
                right: 0;
                content: "";
                width: 2px;
                height: 20px;
                background-color: ${props => props.theme.primaryColor};
            }
        }
    }

    .tab-list {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
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
    grid-template-rows: 1fr 34px;
    background-color: #2d3240;
    cursor: pointer;
    border-radius: 4px;
    box-sizing: border-box;
    overflow: hidden;
    border: 1px solid transparent;

    &:hover {
        color: var(--wanx-wh);
    }

    &.active {
        border-color: ${props => props.theme.primaryColor};
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
        color: var(--wanx-wh-05);
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
        },
        parameters: {
            size: '1024*1024',
        }
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

    const [style, setStyle] = useState({
        list: new Array<dao.Style>(),
        collapse: true,
        selectKeys: new Set<string>(),
    });

    const getStyle = async (hot = 1, categoryId = 0) => {
        let data = {
            currPage: 1,
            pageSize: 10,
            queryBy: [
                {
                    col: 'hot',
                    val: hot
                }
            ]
        }
        if (categoryId > 0) {
            data.queryBy.push({col: 'categoryId', val: categoryId});
        }
        let res = await srv.Style.list(data);
        if (!!hot) {
            style.list = res.data.list;
            setStyle({ ...style });
        } else {
            category.styleList = res.data.list;
            setCategory({...category});
        }
    }

    // 咒语书
    const onStyle = (item: dao.Style) => {
        if (!!req.input.prompt) {
            style.selectKeys = new Set(req.input.prompt.split(','));
        }
        if (style.selectKeys.has(item.name)) {
            style.selectKeys.delete(item.name);
        } else {
            style.selectKeys.add(item.name);
        }
        setStyle({ ...style });
        req.input.prompt = Array.from(style.selectKeys).join(',');
        setReq({ ...req });
    }

    const onMode = (i: number) => {
        mode.info = mode.list[i];
        setMode({ ...mode, collapse: false });
    }

    let [category, setCategory] = useState({
        info: new dao.Category(),
        open: false,
        list: new Array<dao.Category>(),
        styleList: new Array<dao.Style>()
    });

    const getCategory = async () => {
        let data = {
            currPage: 1,
            pageSize: 10
        }
        let res = await srv.Category.list(data);
        if (res.code == 1000) {
            category.list = res.data.list;
        } else {
            category.list = [];
        }
        setCategory({ ...category });
    }

    const onCategory = (item?: dao.Category) => {
        if (!!item) {
            getStyle(0, item.id);
            category.info = item;
        } else {
            getStyle(0, 0);
            category.info = new dao.Category();
        }
        setCategory({...category});
    }

    const submit = () => {
        props.submit(req);
    }

    useEffect(() => {
        getStyle();
        onMode(0);
        getCategory();
    }, []);

    return <Container className={props.className}>
        <div className="side-head">
            <div className="info" onClick={() => setMode({ ...mode, collapse: !mode.collapse })}>
                <div className="text">
                    <Icon src={mode.info.icon} text={mode.info.text} size="16px" />
                </div>
                <Icon src={mode.collapse ? "/icon/arrow-up-bold.svg" : "/icon/arrow-down-bold.svg"} />
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
                        onChange={(v: string) => setReq({ ...req, input: { ...req.input, prompt: v } })}
                        placeholder="试试输入你心中的画面，尽量描述具体，可以尝试用一些风格修饰词辅助你的表达。"
                    ></TextArea>
                    <div className="box">
                        <div className="box-head" onClick={() => setStyle({ ...style, collapse: !style.collapse })}>
                            <div className="text">
                                <Icon src="/icon/book.svg" text="咒语书" />
                            </div>
                            <Icon src="/icon/arrow-up-bold.svg" size="12px" />
                        </div>
                        <div className="box-body" style={{ display: style.collapse ? 'grid' : 'none' }}>
                            {style.list.map((v, i) =>
                                <Card className={style.selectKeys.has(v.name) ? ' active' : ''} key={i} onClick={() => onStyle(v)}>
                                    <picture className="card-body">
                                        <img src={v.cover} />
                                    </picture>
                                    <div className="card-foot">{v.name}</div>
                                </Card>
                            )}
                            <Card onClick={() => setCategory({...category, open: true})}>
                                <picture className="card-body">
                                    <img src="https://img.alicdn.com/imgextra/i4/O1CN01FUuMnX1NodMCJ9udy_!!6000000001617-0-tps-132-132.jpg" />
                                </picture>
                                <div className="card-foot">更多咒语</div>
                            </Card>
                        </div>
                    </div>
                </TextImage>
                <div className="demo">
                    <div className="demo-info">
                        <span>示例：</span>
                        <span className="demo-word" onClick={(e) => setReq({ ...req, input: { ...req.input, prompt: '大气，海盗船，满月航行，丙烯画' } })}>大气，海盗船，满月航行，丙烯画</span>
                    </div>
                    <div className="demo-tool">
                        <Icon src="/icon/refresh.svg" />
                    </div>
                </div>
                <Upload tag={{ text: '参考图', weak: true }} height="182px"></Upload>
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
            <Button onClick={() => submit()}>{mode.info.btnText}</Button>
        </div>
        {category.open && ReactDOM.createPortal(<Popup>
            <div className="popup-head">
                <Icon className="text" src="/icon/text.svg" text="咒语书" />
                <Icon className="tool" src="/icon/close-bold.svg" onClick={() => setCategory({...category, open: false})} />
            </div>
            <div className="popup-body">
                <div className="tab-menu">
                    <a className={0 == category.info.id ? 'active' : ''} onClick={() => onCategory()}>全部</a>
                    {category.list.map((m) => <a className={m.id == category.info.id ? 'active' : ''} key={m.id} onClick={() => onCategory(m)}>
                        {m.name}
                    </a>)}
                </div>
                <div className="tab-list">
                {category.styleList.map((v, i) =>
                    <Card className={style.selectKeys.has(v.name) ? ' active' : ''} key={i} onClick={() => onStyle(v)}>
                        <picture className="card-body">
                            <img src={v.cover} alt="" />
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
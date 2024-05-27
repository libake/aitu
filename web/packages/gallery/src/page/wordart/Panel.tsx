import { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import styled from "styled-components";

import { Icon } from "@/common";
import { dao, srv } from "@/core";

const Container = styled.div`
    display: grid;
    grid-template-rows: 1fr 90px;
    margin: 24px 0 24px 24px;
    /* min-height: 300px;
    max-height: calc(100vh - 100px); */
    border-radius: 20px;
    background-color: #202532;
    box-sizing: border-box;
    /* overflow: hidden; */
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
            gap: 24px;
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
        getCategory();
    }, []);

    return <Container className={props.className}>
        <div className="side-body">
            <h3>文字内容(1-4个字符)</h3>
            <div className="input-group">
                <input type="text" />
            </div>
            <h3>文字风格</h3>
            <div className="box">

            </div>
            <h3>图片比例</h3>
            <div className="radio">
                <div className={`radio-item${req.parameters.size == '1024*1024' ? ' active' : ''}`} onClick={() => onSize('1024*1024')}>
                    <span className="size-ratio s-1v1"></span>
                    <span>1&nbsp;:&nbsp;1</span>
                </div>
                <div className={`radio-item${req.parameters.size == '1280*720' ? ' active' : ''}`} onClick={() => onSize('1280*720')}>
                    <span className="size-ratio s-16v9"></span>
                    <span>16&nbsp;:&nbsp;9</span>
                </div>
                <div className={`radio-item${req.parameters.size == '720*1280' ? ' active' : ''}`} onClick={() => onSize('720*1280')}>
                    <span className="size-ratio s-9v16"></span>
                    <span>9&nbsp;:&nbsp;16</span>
                </div>
            </div>
            <h3>图片背景</h3>
            <div className="radio">
                <a className="radio-item">生成背影</a>
                <a className="radio-item">透明背景</a>
            </div>
        </div>
        <div className="side-foot">
            <Button onClick={() => submit()}>生成创意艺术字</Button>
        </div>
        {/* 文字风格 */}
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
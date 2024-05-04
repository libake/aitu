import styled from "styled-components";
import { useEffect, useState } from "react";
import { Divider } from "antd";

import {Icon} from "@/common";
import { SPELL } from '@/constant';

const Container = styled.div`
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
`
const Collapse = styled.div`
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
`

export function TextArea() {
    let [req, setReq] = useState({
        model: '',
        prompt: '',
        n: 0,
        size: ''
    });

    const setTextArea = (v: string) => {
        req.prompt = v;
        setReq({...req});
    }

    let [spell, setSpell] = useState({
        list: new Array(),
    });

    const getSpell = () => {
        spell.list = [];
        for (let i = 0; i < 8; i++) {
            let tmp = {
                url: 'https://img.alicdn.com/imgextra/i1/O1CN01MFW8PJ1Rs4mOiM6P2_!!6000000002166-0-tps-132-132.jpg',
                text: 'Q版' + i,
                active: false
            }
            spell.list.push(tmp);
        }
        setSpell({...spell});
    }

    const onSpell = (idx: number) => {
        spell.list[idx].active = !spell.list[idx].active;
        setSpell({...spell});
    }

    useEffect(() => {
        getSpell();
    }, []);

    return <Container>
        <div className="main">
            <textarea defaultValue={req.prompt} onChange={e => setTextArea(e.target.value)} placeholder="试试输入你心中的画面，尽量描述具体，可以尝试用一些风格修饰词辅助你的表达。"></textarea>
            <div className="tips">
                <div className="limit">{req.prompt.length}/500</div>
                {req.prompt.length > 0 && <>
                <Divider type="vertical" />
                <Icon src="/icon/menu.svg"></Icon>
                </>
                }
            </div>
        </div>
        <Collapse>
            <div className="info">
                <div className="text">
                    <Icon src="/icon/menu.svg" text="咒语书"></Icon>
                </div>
                <Icon src="/icon/menu.svg"></Icon>
            </div>
            <div className="list">
                {spell.list.map((v, i) => 
                <div className={`item${v.active ? ' active' : ''}`} key={i} onClick={() => onSpell(i)}>
                    <img src={v.url} alt="" />
                    <p>{v.text}</p>
                </div>
                )}
            </div>
        </Collapse>
    </Container>
}
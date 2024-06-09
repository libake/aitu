import { message } from "antd";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { srv } from "@/core";

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 4px;
    background-color: #14171f;

    input {
        flex: 1;
        min-height: 34px;
        padding: 4px 8px;
        box-sizing: border-box;
        outline: none;
        background-color: transparent;
    }

    .suffix {
        width: auto;
        margin-right: 8px;
        padding: 0;
        color: var(--text-color);
        background-color: transparent;
    }
`

interface IProps {
    mobile: string;
    scene?: number;
    value: string;

    className?: string;
    onChange: Function;
}

export function Captcha(props: IProps) {
    let [sms, setSms] = useState({
        text: '获取验证码',
        disable: false,
    });
    let interval: NodeJS.Timer;

    const sendSms = async () => {
        let data = {
            mobile: props.mobile,
            scene: props.scene || 1,
        }
        let res = await srv.Common.sendSms(data);
        if (res.code == 1000) {
            sms.disable = true;
            setSms({...sms});
            let time = 60;
            interval = setInterval(()=> {
                time--;
                if (time <= 0) {
                    sms.text = '获取验证码';
                    clearInterval(interval);
                    sms.disable = false;
                } else {
                    sms.text = `${time}秒后重发`;
                }
                setSms({...sms});
            }, 1000);
        } else {
            message.error(res.desc);
        }
    }

    return <Container className={props.className}>
        <input type="text" onChange={(v) => {props.onChange(v)}} />
        <button className="suffix" type="button" onClick={() => sendSms()} disabled={sms.disable}>
            {sms.text}
        </button>
    </Container>
}
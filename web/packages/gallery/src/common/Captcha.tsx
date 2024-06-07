import { Input, message } from "antd";

import { srv } from "@/core";
import { useEffect, useState } from "react";

interface IProps {
    mobile: string;
    scene?: number;
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

    useEffect(() => {
        
    }, [props]);

    return <Input suffix={
        <button className="link" onClick={() => sendSms()} disabled={sms.disable}>
            {sms.text}
        </button>
    } />
}
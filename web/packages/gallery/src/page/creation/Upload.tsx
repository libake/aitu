import styled from "styled-components";

import { Icon } from "@/common";
import { useRef, useState } from "react";
import { srv } from "core";

const Container = styled.div`
    position: relative;
    cursor: pointer;

    .tag {
        display: flex;
        gap: 4px;
        position: absolute;
        top: 0;
        left: 16px;
        padding: 0 4px;
        color: #333;
        font-size: 10px;
        border-radius: 8px 0;
        background-color: var(--primary-color);
    }

    .box {
        display: flex;
        border: 1px dashed #2d3240;
        border-radius: 8px;
        color: #999;
        font-size: 12px;
        background-color: #0f1319;
    }

    .box-view {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;

        img {
            max-width: 100%;
            max-height: 100%;
        }

        .drop {
            position: absolute;
            top: 8px;
            right: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 28px;
            height: 28px;
            border-radius: 4px;
            background-color: #2d3240;
        }
    }

    .box-body {
        display: grid;
        grid-template-rows: repeat(3, 28px);
        align-content: center;
        justify-items: center;
        align-items: center;
        width: 100%;

        p {
            margin: 0;
            text-align: center;
        }
    }
`

interface IProps {
    tag?: {
        text: string;
        weak: boolean;
    }
    height?: number | string;
}

export function Upload(props: IProps) {
    let inputRef = useRef<HTMLInputElement>(null);

    const onUpload = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (inputRef.current) {
            inputRef.current.click();
        }
    }

    const [file, setFile] = useState('');

    const change = async (f: any) => {
        const fileObj = f.target.files && f.target.files[0];
        if (!fileObj) {
            return;
        }

        let formData = new FormData();
        formData.append('file', fileObj);
        let res = await srv.Common.upload(formData);
        if (res.code == 1000) {
            setFile(res.data);
        }
    }

    const onDrop = () => {
        setFile('');
    }

    return <Container>
        {props.tag && <div className="tag">
            <div className="text">{props.tag.text}</div>
            {props.tag.weak && <div className="weak">(选填)</div>}
        </div>}
        <input
            ref={inputRef}
            type="file"
            // accept=".png,.jpg,.jpeg,.bmp"
            style={{ display: "none" }}
            onChange={change}
        />
        <div className="box" style={{ height: props.height }}>
            {file ? <div className="box-view">
                <img src={file} alt="" />
                <div className="drop" onClick={(e) => {e.stopPropagation; onDrop()}}>
                    <Icon src="/icon/ashbin.svg" />
                </div>
            </div> : <div className="box-body" onClick={(e) => onUpload(e)}>
                <Icon src="/icon/upload.svg" size="24px" />
                <p>支持将右侧图像拖入或上传不超过10M的</p>
                <p>JPG、JPEG、PNG、BMP图片</p>
            </div>
            }
        </div>
    </Container>
}
import { useEffect, useState } from "react";
import styled from "styled-components";

import { Icon } from "@/common";

const Container = styled.div`
    position: relative;
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

    textarea {
        border: none;
        width: 100%;
        height: 110px;
        outline: none;
        background-color: transparent;
    }

    .suffix {
        position: absolute;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: end;
        align-items: center;
        gap: 16px;
        height: 30px;
        padding: 8px;
        font-size: 12px;

        .icon {
            cursor: pointer;
        }
    }
`

interface IProps {
    value: string;
    onChange?: Function;
    name?: string;
    rows?: number;
    cols?: number;
    placeholder?: string;
}

export function TextArea(props: IProps) {
    let [value, setValue] = useState(props.value);

    const handlerChange = (evt: any) => {
        value = evt.target.value;
        setValue(value);
        if (!props.onChange) {
            return;
        }
        props.onChange(value);
    }

    useEffect(() => {
        setValue(props.value);
    }, [props.value]);

    const clear = () => {
        setValue('');
    }

    return <Container className="input-group">
        <textarea
            name={props.name}
            onChange={(e) => handlerChange(e)}
            value={value}
            rows={props.rows}
            cols={props.cols}
            placeholder={props.placeholder}
        ></textarea>
        <div className="suffix">
            <span className="limit">{value.length}/500</span>
            {value.length > 0 && <Icon className="icon" src="/icon/error.svg" onClick={() => clear()} />}
        </div>
    </Container>
}
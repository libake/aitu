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
        padding: 8px 0;
        outline: none;
        font-size: 14px;
        color: #fff;
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

        .limit {
            color: rgba(135,138,171,.5);
        }

        .loaded {
            color: #fff;
            font-weight: 600;
        }

        .clear {
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
    limit?: number;
    className?: string;
    placeholder?: string;
}

export function TextArea(props: IProps) {
    let [value, setValue] = useState(props.value);

    const handlerChange = (evt: any) => {
        value = evt.target.value;
        if (props.limit && value.length > props.limit) {
            return;
        }
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

    return <Container className={props.className}>
        <textarea
            name={props.name}
            onChange={(e) => handlerChange(e)}
            value={value}
            rows={props.rows}
            cols={props.cols}
            placeholder={props.placeholder}
        ></textarea>
        <div className="suffix">
            {props.limit && <div className="limit">
                <span className="loaded">{value.length}</span>
                <span>/{props.limit}</span>
            </div>}
            {value.length > 0 && <Icon className="clear" src="/icon/error.svg" onClick={() => clear()} />}
        </div>
    </Container>
}
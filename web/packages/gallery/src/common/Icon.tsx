import { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
`
const Img = styled.object`
    position: relative;
    left: -80px;
    width: 16px;
    height: 16px;
    filter: drop-shadow(#fff 80px 0);
    transform: translate(0px, 0px);
`

type Props = {
    src: string;
    size?: number | string;
    text?: string;
    onClick?: Function;
    className?: string;
}

export function Icon(props: Props) {
    let [size, setSize] = useState({width: '16px', height: '16px'});

    const handlerClick = (e: any) => {
        if (!props.onClick) {
            return;
        }
        props.onClick(e);
    }

    useEffect(() => {
        if (!!props.size) {
            if (typeof props.size === 'number') {
                setSize({width: `${props.size}px`, height: `${props.size}px`});
            } else {
                setSize({width: props.size, height: props.size});
            }
        }
    }, [props.size]);

    return <Container className={props.className} onClick={(e) => {e.stopPropagation;handlerClick(e)}}>
        <Img data={props.src} style={{...size}}  type="image/svg+xml" />
        {props.text && <span style={{marginLeft: "8px"}}>{props.text}</span>}
    </Container>
}
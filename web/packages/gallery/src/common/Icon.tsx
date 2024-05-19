import styled from "styled-components";

const Container = styled.div`
    overflow: hidden;
`
const Img = styled.img`
    width: 16px;
    height: 16px;
    position: relative;
    left: -80px;
    filter: drop-shadow(#fff 80px 0);
`

type Props = {
    src: string;
    size?: number | string;
    text?: string;
    onClick?: Function;
    className?: string;
}

export function Icon(props: Props) {

    const handlerClick = (e: any) => {
        if (!props.onClick) {
            return;
        }
        props.onClick(e);
    }

    return <Container className={props.className} onClick={(e) => handlerClick(e)}>
        <Img src={props.src} style={{width: props.size || "16px", height: props.size || "16px"}} />
        {props.text && <span style={{marginLeft: "8px"}}>{props.text}</span>}
    </Container>
}
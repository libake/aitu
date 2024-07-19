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

    const handlerClick = (e: any) => {
        if (!props.onClick) {
            return;
        }
        props.onClick(e);
    }

    return <Container className={props.className} onClick={(e) => {e.stopPropagation;handlerClick(e)}}>
        <Img data={props.src} style={{width: props.size, height: props.size}}  type="image/svg+xml" />
        {props.text && <span style={{marginLeft: "8px"}}>{props.text}</span>}
    </Container>
}
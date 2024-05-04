import styled from "styled-components";

import Icon from "./Icon";

const Container = styled.div`
    position: relative;
    cursor: pointer;

    .tag {
        display: flex;
        gap: 4px;
        position: absolute;
        top: 0;
        left: 16px;
        padding: 0 8px;
        color: #333;
        font-size: 12px;
        border-top-left-radius: 8px;
        border-bottom-right-radius: 8px;
        background-color: ${props => props.theme.primaryColor};
    }
`
const Content = styled.div`
    display: grid;
    grid-template-rows: repeat(3, 28px);
    align-content: center;
    justify-items: center;
    align-items: center;
    margin: 16px;
    padding: 24px 0;
    border: 1px dashed #2d3240;
    border-radius: 8px;
    color: #999;
    font-size: 12px;
    background-color: #0f1319;

    p {
        margin: 0;
        text-align: center;
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
    return <Container>
        {props.tag && <div className="tag">
            <div className="text">{props.tag.text}</div>
            {props.tag.weak && <div className="weak">(选填)</div>}
        </div>}
        <input type="file" accept=".png,.jpg,.jpeg,.bmp" style={{ display: "none" }} />
        <Content style={{height: props.height}}>
            <Icon src="/icon/menu.svg"></Icon>
            <p>支持将右侧图像拖入或上传不超过10M的</p>
            <p>JPG、JPEG、PNG、BMP图片</p>
        </Content>
    </Container>
}
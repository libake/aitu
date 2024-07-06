import styled from "styled-components"

import { bus } from "@/util/mitt";

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    img {
        height: 80px;
    }

    h2 {
        margin: 24px 0 60px;
        color: var(--text-color);
        font-weight: 400;
    }

    button {
        width: 200px;
        background: var(--primary-color);
        border-radius: 20px;
    }
`

export function Login() {

    const onLogin = () => {
        bus.emit('login', {
            open: true
        });
    }

    return <Container>
        <img src="/logo.png" alt="" />
        <h2>一个不断进化的人工智能艺术创作大模型</h2>
        <button onClick={() => onLogin()}>立即登录</button>
    </Container>
}
import styled from "styled-components"

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;

    img {
        width: 100%;
        max-width: 160px;
    }
`
export function Default()
{
    return <Container>
        <img src="/logo-01.png" />
    </Container>
}
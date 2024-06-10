import { Col, Row } from "antd";
import { useContext } from "react";
import styled from "styled-components";

import { UserContext } from "@/context";

const Container = styled.div`
    margin: 16px;
    min-height: calc(100vh - 86px);
    padding: 24px;
    box-sizing: border-box;
    background-color: #fff;

    h3 {
        margin-left: 5rem;
        font-weight: 500;
    }

    .avatar {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .item {
        display: flex;
        line-height: 50px;

        label {
            min-width: 100px;
        }

        a {
            margin-left: 1rem;
        }
    }

    .ant-alert {
        margin-bottom: 2rem;
    }
`;

const Avatar = styled.a`

    img {
        width: 100px;
        border-radius: 50%;
    }
`;

export function Profile() {
    document.title = document.title + ' - 基本信息';

    const userContext = useContext(UserContext);

    return <Container>
        <Row>
            <Col className="avatar" span={6}>
                <Avatar>
                    <img src="/avatar/01.jpg" alt="头像" />
                </Avatar>
            </Col>
            <Col span={9}>
                <div className="item">
                    <label htmlFor="">登录账号:</label>
                    <span>{userContext.state.mobile}</span>
                </div>
                <div className="item">
                    <label htmlFor="">账号ID:</label>
                    <span>{userContext.state.id}</span>
                </div>
            </Col>
            <Col span={9}>
                <div className="item">
                    <label htmlFor="">注册时间:</label>
                    <span>{userContext.state.createAt}</span>
                </div>
                <div className="item">
                    <label htmlFor="">上次登录时间:</label>
                    <span>{userContext.state.lastTime}</span>
                </div>
            </Col>
        </Row>
    </Container>
}
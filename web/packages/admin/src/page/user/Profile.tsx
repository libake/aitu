import { Alert, Button, Col, Form, Input, Row, Select } from "antd";
import styled from "styled-components";

const Container = styled.div`
    margin: 1rem;

    h3 {
        margin-left: 5rem;
        font-weight: 500;
    }

    .box {
        margin-bottom: 1rem;
        padding: 1rem;
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

    return <Container>
        <Row className="box">
            <Col className="avatar" span={6}>
                <Avatar>
                    <img src="/avatar/01.jpg" alt="头像" />
                </Avatar>
            </Col>
            <Col span={9}>
                <div className="item">
                    <label htmlFor="">登录账号:</label>
                    <span>zhong***@126.com</span>
                    <a>修改</a>
                </div>
                <div className="item">
                    <label htmlFor="">账号ID:</label>
                    <span>3756667868</span>
                </div>
                <div className="item">
                    <label htmlFor="">三方账号绑定:</label>
                    <a className="iconfont">&#xe67a;</a>
                </div>
            </Col>
            <Col span={9}>
                <div className="item">
                    <label htmlFor="">实名认证:</label>
                    <span>个人实名认证</span>
                    <a>详情</a>
                </div>
                <div className="item">
                    <label htmlFor="">注册时间:</label>
                    <span>2023-01-20 10:00:00</span>
                </div>
                <div className="item">
                    <label htmlFor="">上次登录时间:</label>
                    <span>2023-01-20 10:00:00</span>
                </div>
            </Col>
        </Row>
    </Container>
}
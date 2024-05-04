import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import md5 from 'md5';

import { srv } from "@/core";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: #f9f9f9;


    .main {
        display: grid;
        justify-content: center;
        align-content: center;
        min-height: 360px;
        border-radius: 8px;
        background-color: #fff;

        .ant-form {
            margin: 32px 56px;
            width: 300px;
        }
    }

`;

export function SignIn(props: any) {
    const [userForm] = Form.useForm();
    const navigate = useNavigate();

    const submit = async () => {
        let data = {
            account: userForm.getFieldValue('account'),
            password: md5(userForm.getFieldValue('password')),
        };
        let res = await srv.User.signIn(data);
        if (res.code == 1000) {
            navigate('/');
        } else {
            message.error(res.desc);
        }
    }

    return <Container>
        <div className="main">
            <Form form={userForm} layout="vertical" onFinish={submit}>
                <Form.Item name="account">
                    <Input placeholder="手机号/邮箱" />
                </Form.Item>
                <Form.Item name="password">
                    <Input.Password placeholder="密码" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>登录</Button>
                </Form.Item>
            </Form>
        </div>
    </Container>
}
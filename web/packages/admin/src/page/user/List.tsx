import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import dayjs from 'dayjs';
import { Badge, Button, Form, Input, Select, Space, Table, TablePaginationConfig } from "antd";
import styled from "styled-components";

import { dto, srv } from "core";

const Container = styled.div`
    margin: 1rem;
    padding: 1rem;
    min-height: calc(100vh - 84px);
`;

const columns = [{
    title: '手机号',
    dataIndex: 'mobile',
}, {
    title: '邮箱',
    dataIndex: 'email',
}, {
    title: '性别',
    dataIndex: 'gender',
    render: (v: number) => {
        let m = new Map([
            [1, '男'],
            [2, '女']
        ]);
        return m.has(v) ? m.get(v) : '-';
    }
}, {
    title: '生日',
    dataIndex: 'birthday',
    render: (v: string) => {
        return dayjs(v).format('YYYY-MM-DD');
    }
}, {
    title: '昵称',
    dataIndex: 'nickname',
}, {
    title: '能量值',
    dataIndex: 'power',
}, {
    title: '状态',
    dataIndex: 'status',
    render: (v: number) => {
        let badge;
        switch (v) {
            case 1:
                badge = <Badge color="green" text="正常" />
                break;
            default:
                badge = <Badge color="gold" text="冻结" />
        }
        return badge;
    }
}, {
    title: '最后登录时间',
    dataIndex: 'lastTime',
    render: (v: string) => {
        return dayjs(v).format('YYYY-MM-DD HH:mm:ss');
    }
}, {
    title: '注册时间',
    dataIndex: 'createAt',
    render: (v: string) => {
        return dayjs(v).format('YYYY-MM-DD HH:mm:ss');
    }
}];


export function List() {
    let [req, setReq] = useState(new dto.Request());
    const [userList, setUserList] = useState();
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [searchForm] = Form.useForm();

    const getUser = async () => {
        setLoading(true);
        let data: dto.Request = {
            ...req,
        };
        if (!!searchForm.getFieldValue('val')) {
            data.queryBy = [{
                ...searchForm.getFieldsValue()
            }];
        }
        let res = await srv.User.list(data);
        if (res.code == 1000) {
            setUserList(res.data.list);
            setTotal(res.data.total);
        } else {
            setUserList(undefined);
            setTotal(0);
        }
        setLoading(false);
    }

    const onTable = (pagination: TablePaginationConfig) => {
        req.currPage = pagination.current;
        req.pageSize = pagination.pageSize;
        setReq({
            ...req,
        });
    }

    useEffect(() => {
        getUser();
    }, [req.currPage]);

    return <Container className="box">
        <div className="box-head">
            <Form form={searchForm} onFinish={getUser} layout="inline" initialValues={{ col: 'nickname' }}>
                <Form.Item name="col">
                    <Select options={[{ label: '昵称', value: 'nickname' }]} />
                </Form.Item>
                <Form.Item name="val">
                    <Input allowClear />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">搜索</Button>
                </Form.Item>
            </Form>
        </div>
        <div className="box-body">
            <Table
                rowKey={(record) => record.id}
                columns={columns}
                dataSource={userList}
                pagination={{ current: req.currPage, pageSize: req.pageSize, total }}
                loading={loading}
                onChange={onTable}
            />
        </div>
    </Container>
}
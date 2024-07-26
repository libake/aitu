import { useEffect, useState } from "react";
import { Button, Form, Input, Select, Table, TablePaginationConfig } from "antd";
import styled from "styled-components";

import { dao, dto, srv } from "core";
import dayjs from "dayjs";

const Container = styled.div`
    margin: 16px;
    min-height: calc(100vh - 84px);

    img {
        max-height: 40px;
    }
`;

const columns = [
    {
        title: '内容',
        dataIndex: 'content',
    }, {
        title: '手机号',
        dataIndex: 'mobile',
    }, {
        title: '创建时间',
        dataIndex: 'createAt',
        width: 180,
        render: (v: string) => {
            return dayjs(v).format('YYYY-MM-DD HH:mm:ss');
        }
    }
];

export function List() {
    const [req, setReq] = useState(new dto.Request());
    const [feedback, setTemplate] = useState({
        list: new Array<dao.Feedback>(),
        total: 0,
    });
    const [loading, setLoading] = useState(false);
    const [queryBy] = Form.useForm();

    const getFeedback = async () => {
        setLoading(true);
        let data: dto.Request = {
            ...req,
        };
        if (!!queryBy.getFieldValue('val')) {
            data.queryBy = [];
            data.queryBy.push({ 'col': queryBy.getFieldValue('col'), 'val': queryBy.getFieldValue('val') });
        }
        let res = await srv.Feedback.list(data);
        if (res.code == 1000) {
            feedback.list = res.data.list;
            feedback.total = res.data.total;
        } else {
            feedback.list = [];
            feedback.total = 0;
        }
        setTemplate({ ...feedback });
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
        getFeedback();
    }, [req]);

    return <Container className="box">
        <div className="box-head">
            <Form layout="inline" form={queryBy} onFinish={getFeedback} initialValues={{ col: 'content' }}>
                <Form.Item name="col">
                    <Select
                        options={[{ label: '内容', value: 'content' }]}
                        value="content"
                    />
                </Form.Item>
                <Form.Item name="val">
                    <Input />
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
                dataSource={feedback.list}
                pagination={{ current: req.currPage, pageSize: req.pageSize, total: feedback.total }}
                loading={loading}
                onChange={onTable}
            />
        </div>
    </Container>
}
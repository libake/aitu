import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import dayjs from 'dayjs';
import { TableColumnsType, Button, Form, Input, Select, Space, Table, TablePaginationConfig, Image } from "antd";
import styled from "styled-components";

import { dao, dto, srv } from "core";

const Container = styled.div`
    margin: 1rem;
    padding: 1rem;
    min-height: calc(100vh - 84px);
`;

const columns: TableColumnsType<dao.Task> = [{
    title: '模型',
    dataIndex: 'model',
    fixed: 'left',
    width: 200,
}, {
    title: '任务ID',
    dataIndex: 'taskId',
}, {
    title: '任务状态',
    dataIndex: 'taskStatus',
}, {
    title: '任务类型',
    dataIndex: 'taskType',
}, {
    title: 'input参数',
    dataIndex: 'input',
    render: (v: any) => {
        return JSON.stringify(v);
    }
}, {
    title: 'parameters参数',
    dataIndex: 'parameters',
    render: (v: any) => {
        return JSON.stringify(v);
    }
}, {
    title: '图像',
    dataIndex: 'image',
    render: (v: string, r: dao.Task) => {
        if (!!!r.results) {
            return '';
        }
        let items = r.results.map(m => {
            return m.url;
        });
        return <Image width={60} src={items[0]} />
    }
}, {
    title: '更新时间',
    dataIndex: 'updateAt',
    render: (v: string) => {
        return dayjs(v).format('YYYY-MM-DD HH:mm:ss');
    }
}, {
    title: '创建时间',
    dataIndex: 'createAt',
    render: (v: string) => {
        return dayjs(v).format('YYYY-MM-DD HH:mm:ss');
    }
}];


export function List() {
    const [req, setReq] = useState(new dto.Request());
    let [task, setTask] = useState({
        list: new Array<dao.Task>(),
        total: 0,
    });
    const [loading, setLoading] = useState(false);
    const [searchForm] = Form.useForm();

    const getTask = async () => {
        setLoading(true);
        let data: dto.Request = {
            ...req,
        };
        if (!!searchForm.getFieldValue('val')) {
            data.queryBy = [{
                ...searchForm.getFieldsValue()
            }];
        }
        let res = await srv.Task.list(data);
        if (res.code == 1000) {
            task.list = res.data.list;
            task.total = res.data.total;
        } else {
            task.total = 0;
            task.list = [];
        }
        setTask({...task});
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
        getTask();
    }, [req.currPage]);

    return <Container className="box">
        <div className="box-head">
            <Form form={searchForm} onFinish={getTask} layout="inline" initialValues={{ col: 'model' }}>
                <Form.Item name="col">
                    <Select options={[{ label: '模型', value: 'model' },{ label: '任务状态', value: 'taskStatus' }]} />
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
                dataSource={task.list}
                pagination={{ current: req.currPage, pageSize: req.pageSize, total: task.total }}
                loading={loading}
                onChange={onTable}
                scroll={{ x: 1100 }}
            />
        </div>
    </Container>
}
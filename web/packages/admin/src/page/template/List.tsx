import { useEffect, useState } from "react";
import { Button, Drawer, Form, Input, message, Popconfirm, Select, Space, Switch, Table, Tooltip, Image } from "antd";
import styled from "styled-components";

import { dao, dto, srv } from "core";

const Container = styled.div`
    margin: 16px;
    min-height: calc(100vh - 84px);

    img {
        max-height: 40px;
    }
`;


export function List() {
    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            width: 200,
        }, {
            title: '编码',
            dataIndex: 'code',
        }, {
            title: '图像',
            dataIndex: 'image',
            width: 100,
            render: (f: string, r: dao.Template) => {
                return <Image.PreviewGroup
                preview={{
                  onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                }}
                items={[r.innerImage, r.outerImage]}
              >
                <Image width={60} src={r.innerImage || r.outerImage} />
              </Image.PreviewGroup>;
            }
        }, {
            title: '状态',
            dataIndex: 'status',
            render: (v: number, r: dao.Template) => <Switch checked={Boolean(v)} onChange={() => setStatus(r)} size="small" />
        }, {
            title: '排序',
            dataIndex: 'sort',
            width: 80,
            render: (v: number, r: dao.Template) => {
                let e = <span onClick={() => selCell(r)}>{v}</span>;
                if (editable.some(e => e == r.id)) {
                    e = <Input defaultValue={v} onPressEnter={(event) => setSort(event, r)} onBlur={(event) => setSort(event, r)} size="small" />;
                }
                return <Tooltip title="单击编辑">{e}</Tooltip>
            }
        }, {
            title: '操作',
            key: 'action',
            width: 110,
            render: (text: undefined, record: dao.Template) => {
                return <Space size={16}>
                    <a className="iconfont" onClick={() => disTemplate(record)} title="编辑">&#xe640;</a>
                    <Popconfirm
                        placement="left"
                        title="确定要删除吗？"
                        onConfirm={() => delTemplate(record)}
                    >
                        <a className="iconfont" href="#" title="删除">&#xe618;</a>
                    </Popconfirm>
                </Space>
            }
        },
    ];

    const [template, setTemplate] = useState({
        list: new Array<dao.Template>(),
    });
    const [loading, setLoading] = useState(false);
    const [queryBy] = Form.useForm();

    const [editable, setEditable] = useState<number[]>([]);
    const selCell = (item: dao.Template) => {
        let s = new Set([...editable]);
        s.add(item.id);
        setEditable([...s]);
    }

    const getTemplate = async () => {
        setLoading(true);
        let data: dto.Request = {
            currPage: 1,
            pageSize: 1000,
<<<<<<< HEAD
=======
            tree: true,
>>>>>>> 74bab2a2266bffcc4706d74d0917dbe8f7d62b46
        };
        if (!!queryBy.getFieldValue('val')) {
            data.queryBy = [];
            data.queryBy.push({ 'col': queryBy.getFieldValue('col'), 'val': queryBy.getFieldValue('val') });
        }
        let res = await srv.Template.list(data);
        if (res.code == 1000) {
            template.list = res.data.list;
        } else {
            template.list = [];
        }
        setTemplate({...template});
        setLoading(false);
    }

    const [drawer, setDrawer] = useState({ open: false, title: '' });
    const [categoryForm] = Form.useForm();

    const disTemplate = (item?: dao.Template) => {
        drawer.open = !drawer.open;
        if (!!item) {
            drawer.title = '编辑分类';
            categoryForm.setFieldsValue(item);
        } else {
            drawer.title = '新增分类';
            categoryForm.setFieldsValue(new dao.Template());
        }
        setDrawer({ ...drawer });
    }

    const onTemplate = async () => {
        let valid = await categoryForm.validateFields().catch(e => console.log(e));
        if (!valid) {
            return;
        }
        let data = {
            ...categoryForm.getFieldsValue(),
        };
        let res: dto.Response;
        if (data.id > 0) {
            res = await srv.Template.update(data);
        } else {
            res = await srv.Template.create(data);
        }
        if (res.code == 1000) {
            disTemplate();
            getTemplate();
        } else {
            message.error(res.desc);
        }
    }

    const delTemplate = async (item: dao.Template) => {
        let data = {
            id: item.id,
        };
        let res = await srv.Template.delete(data);
        if (res.code == 1000) {
            message.success('删除成功');
            getTemplate();
        } else {
            message.error(res.desc);
        }
    }

    const setSort = (event: any, r: dao.Template) => {
        let sort = Number(event.target.value);
        if (sort != r.sort) {
            let data = {
                id: r.id,
                sort: sort,
            };
            srv.Template.setSort(data).then(res => {
                if (res.code == 1000) {
                    getTemplate();
                    message.success('修改成功');
                } else {
                    message.error(res.desc);
                }
            });
        }
        let s = new Set([...editable]);
        s.delete(r.id);
        setEditable([...s]);
    }

    const setStatus = async (r: dao.Template) => {
        let data = {
            id: r.id,
            status: Number(r.status),
        };
        let res = await srv.Template.setStatus(data);
        if (res.code == 1000) {
            getTemplate();
        } else {
            message.error(res.desc);
        }
    }

    const [category, setCategory] = useState(new Array<dao.Category>());

    const getCategory = async () => {
        let data = {
            currPage: 1,
            pageSize: 1000,
        }
        let res = await srv.Category.list(data);
        if (res.code == 1000) {
            setCategory(res.data.list);
        } else {
            setCategory([]);
        }
    }

    useEffect(() => {
        getTemplate();
        getCategory();
    }, []);

    return <Container className="box">
        <div className="box-head">
            <Form layout="inline" form={queryBy} onFinish={getTemplate} initialValues={{ col: 'name' }}>
                <Form.Item name="col">
                    <Select
                        options={[{ label: '名称', value: 'name' }]}
                        value="name"
                    />
                </Form.Item>
                <Form.Item name="val">
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">搜索</Button>
                </Form.Item>
            </Form>
            <div className="tool">
                <Button type="primary" onClick={() => disTemplate()}>新增模板</Button>
            </div>
            {/* 新增、编辑 */}
            <Drawer
                open={drawer.open}
                onClose={() => disTemplate()}
                title={drawer.title}
                footer={
                    <Space>
                        <Button onClick={() => disTemplate()}>取消</Button>
                        <Button type="primary" onClick={onTemplate}>确定</Button>
                    </Space>
                }
            >
                <Form form={categoryForm} layout="vertical">
                    <Form.Item
                        name="name"
                        label="名称"
                        rules={[{ required: true, message: '请输入节点名称!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="code" label="编码" rules={[{ required: false, message: '请输入元数据!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="innerImage" label="内部图像">
                        <Input />
                    </Form.Item>
                    <Form.Item name="outerImage" label="外部图像">
                        <Input />
                    </Form.Item>
                    <Form.Item name="categoryId" label="归属分类">
                        <Select options={category} fieldNames={{ label: 'name', value: 'id' }} allowClear />
                    </Form.Item>
                    <Form.Item name="id" hidden>
                        <Input />
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
        <div className="box-body">
            <Table
                rowKey={(record) => record.id}
                columns={columns}
                dataSource={template.list}
                pagination={false}
                loading={loading}
                // scroll={{ x: 1500 }}
            />
        </div>
    </Container>
}
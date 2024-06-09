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
            title: '图标',
            dataIndex: 'icon',
            width: 100,
            render: (f: string) => {
                return <Image.PreviewGroup
                preview={{
                  onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                }}
                items={[f]}
              >
                <Image width={60} src={f} />
              </Image.PreviewGroup>;
            }
        }, {
            title: '场景',
            dataIndex: 'scene',
        }, {
            title: '状态',
            dataIndex: 'status',
            render: (v: number, r: dao.Category) => <Switch checked={Boolean(v)} onChange={() => setStatus(r)} size="small" />
        }, {
            title: '排序',
            dataIndex: 'sort',
            width: 80,
            render: (v: number, r: dao.Category) => {
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
            render: (text: undefined, record: dao.Category) => {
                return <Space size={16}>
                    <a className="iconfont" onClick={() => disCategory(record, true)} title="新增子节点">&#xe600;</a>
                    <a className="iconfont" onClick={() => disCategory(record)} title="编辑">&#xe640;</a>
                    <Popconfirm
                        placement="left"
                        title="确定要删除吗？"
                        onConfirm={() => delCategory(record)}
                    >
                        <a className="iconfont" href="#" title="删除">&#xe618;</a>
                    </Popconfirm>
                </Space>
            }
        },
    ];

    const [category, setCategory] = useState({
        list: new Array<dao.Category>(),
    });
    const [loading, setLoading] = useState(false);
    const [queryBy] = Form.useForm();

    const [editable, setEditable] = useState<number[]>([]);
    const selCell = (item: dao.Category) => {
        let s = new Set([...editable]);
        s.add(item.id);
        setEditable([...s]);
    }

    const getCategory = async () => {
        setLoading(true);
        let data: dto.Request = {
            currPage: 1,
            pageSize: 1000,
            tree: true,
        };
        if (!!queryBy.getFieldValue('val')) {
            data.queryBy = [];
            data.queryBy.push({ 'col': queryBy.getFieldValue('col'), 'val': queryBy.getFieldValue('val') });
        }
        let res = await srv.Category.list(data);
        if (res.code == 1000) {
            category.list = res.data.list;
        } else {
            category.list = [];
        }
        setCategory({...category});
        setLoading(false);
    }

    const [drawer, setDrawer] = useState({ open: false, title: '' });
    const [categoryForm] = Form.useForm();

    const disCategory = (item?: dao.Category, isSub?: boolean) => {
        drawer.open = !drawer.open;
        if (!!item) {
            if (!!isSub) {
                drawer.title = '新增分类';
                let category = new dao.Category();
                category.parentId = item.id;
                categoryForm.setFieldsValue(category);
            } else {
                drawer.title = '编辑分类';
                categoryForm.setFieldsValue(item);
            }
        } else {
            drawer.title = '新增分类';
            categoryForm.setFieldsValue(new dao.Category());
        }
        setDrawer({ ...drawer });
    }

    const onCategory = async () => {
        let valid = await categoryForm.validateFields().catch(e => console.log(e));
        if (!valid) {
            return;
        }
        let data = {
            ...categoryForm.getFieldsValue(),
        };
        if (!Array.isArray(data.prompt)) {
            data.prompt = data.prompt.split(',');
        }
        console.log(data)
        // data.prompt = !!data.prompt ? data.prompt.toString().split(',') : [];
        let res: dto.Response;
        if (data.id > 0) {
            res = await srv.Category.update(data);
        } else {
            res = await srv.Category.create(data);
        }
        if (res.code == 1000) {
            disCategory();
            getCategory();
        } else {
            message.error(res.desc);
        }
    }

    const delCategory = async (item: dao.Category) => {
        let data = {
            id: item.id,
        };
        let res = await srv.Category.delete(data);
        if (res.code == 1000) {
            message.success('删除成功');
            getCategory();
        } else {
            message.error(res.desc);
        }
    }

    const setSort = (event: any, r: dao.Category) => {
        let sort = Number(event.target.value);
        if (sort != r.sort) {
            let data = {
                id: r.id,
                sort: sort,
            };
            srv.Category.setSort(data).then(res => {
                if (res.code == 1000) {
                    getCategory();
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

    const setStatus = async (r: dao.Category) => {
        let data = {
            id: r.id,
            status: Number(r.status),
        };
        let res = await srv.Category.setStatus(data);
        if (res.code == 1000) {
            getCategory();
        } else {
            message.error(res.desc);
        }
    }

    useEffect(() => {
        getCategory();
    }, []);

    return <Container className="box">
        <div className="box-head">
            <Form layout="inline" form={queryBy} onFinish={getCategory} initialValues={{ col: 'name' }}>
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
                <Button type="primary" onClick={() => disCategory()}>新增分类</Button>
            </div>
            {/* 新增、编辑 */}
            <Drawer
                open={drawer.open}
                onClose={() => disCategory()}
                title={drawer.title}
                footer={
                    <Space>
                        <Button onClick={() => disCategory()}>取消</Button>
                        <Button type="primary" onClick={onCategory}>确定</Button>
                    </Space>
                }
            >
                <Form form={categoryForm} layout="vertical">
                    <Form.Item name="parentId" label="上级分类">
                        <Select options={category.list} fieldNames={{ label: 'name', value: 'id' }} allowClear />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="名称"
                        rules={[{ required: true, message: '请输入节点名称!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="icon" label="图标">
                        <Input />
                    </Form.Item>
                    <Form.Item name="code" label="编码" rules={[{ required: false, message: '请输入元数据!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="scene"
                        label="场景"
                        rules={[{ required: true, message: '请选择场景!' }]}
                    >
                        <Select options={[
                            { label: '文本生成图像', value: 'text_to_image' },
                            { label: '艺术字生成', value: 'word_art_image' },
                        ]} />
                    </Form.Item>
                    <Form.Item name="prompt" label="提示语">
                        <Input.TextArea />
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
                dataSource={category.list}
                pagination={false}
                loading={loading}
                // scroll={{ x: 1500 }}
            />
        </div>
    </Container>
}
import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Input, Button, Table, Space, message, InputNumber, Popconfirm } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import ModalForm from './ModalForm';
import { postData, getSex, formatGQLParams } from '../utils';
import { URL } from '../constants';
import './Content.css';
import momemt from 'moment';
const PAGE_SIZE = 10;

const Content = () => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurPage] = useState(1);
    const [curRecord, setCurRecord] = useState({});

    useEffect(() => {
        queryData()
    }, []);

    // 搜索
    const onSearch = (values) => {
        console.log(values);
        setCurPage(1);
        queryData({ pageNo: 0, ...values })
    };

    // 新增/编辑完成
    function handleUpdate() {
        queryData()
    }

    // 查询
    function queryData(values) {
        const params = formatGQLParams({ pageNo: currentPage - 1, pageSize: PAGE_SIZE, ...values })
        return postData(URL,
            {
                query: `query{
                    getStudent(${params}){
                        data{
                            name
                            sex
                            age
                            phone
                            major
                            grade
                            meta {
                                createdAt
                                updatedAt
                            }
                            _id
                        }
                        count
                        pageNo
                    }
                }`
            }
        )
            .then(res => {
                console.log('res', res)
                const { data = [], count = 0, pageNo = 0 } = res?.data?.getStudent || {}
                setData(data);
                setTotal(count);
            })
            .catch(error => console.error(error))
    }

    // 显示弹窗
    const showUserModal = () => {
        setCurRecord({});
        setVisible(true);
    };

    // 新增/编辑 弹窗
    const hideUserModal = () => {
        setVisible(false);
    };

    // 分页
    const changePagination = current => {
        console.log(current);
        setCurPage(current);
        queryData({ pageNo: current - 1 })
    }

    // 修改
    const handleEdit = (record) => {
        // 带入当前数据
        setCurRecord(record);
        // 显示弹窗
        setVisible(true);
    }

    // 删除
    const handleDelete = (id) => {
        return postData(URL,
            {
                query: `mutation{
                    deleteStudent(delete: { _id: "${id}"}){
                        count
                    }
                }`
            }
        )
            .then(res => {
                console.log('deleteStudent', res)
                queryData()
            })
            .catch(error => console.error(error))

    }

    const getFields = () => {
        const children = [
            <Col span={6} key={"name"}>
                <Form.Item
                    name={"name"}
                    label={"姓名"}
                >
                    <Input />
                </Form.Item>
            </Col>,
            <Col span={6} key="grade">
                <Form.Item
                    name={"grade"}
                    label={"年级"}
                >
                    <Input />
                </Form.Item>
            </Col>,
            <Col span={6} key="major">
                <Form.Item
                    name={"major"}
                    label={"专业"}
                >
                    <Input />
                </Form.Item>
            </Col>,
            <Col span={6} key="age">
                <Form.Item
                    name={"age"}
                    label={"年龄"}
                >
                    <InputNumber />
                </Form.Item>
            </Col>,
        ];

        return children;
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '性别',
            dataIndex: 'sex',
            key: 'sex',
            render: sex => getSex(sex)
        },
        {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: '电话',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '年级',
            dataIndex: 'grade',
            key: 'grade',
        },
        {
            title: '专业',
            dataIndex: 'major',
            key: 'major',
        },
        {
            title: '操作时间',
            dataIndex: 'meta',
            key: 'meta',
            render: (text, record) => (
                <span>{momemt(Number(record.meta.updatedAt)).format('YYYY-MM-DD HH:mm:ss')}</span>
            ),
        },
        {
            title: '操作',
            dataIndex: 'edit',
            key: 'edit',
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={() => handleEdit(record)}>修改</a>
                    <Popconfirm
                        title="是否确定删除?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="是的"
                        cancelText="取消"
                    ><a>删除</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return <>
        <Form
            form={form}
            name="advanced_search"
            className="ant-advanced-search-form"
            onFinish={onSearch}
        >
            <Row gutter={24}>{getFields()}</Row>
            <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                        Search
        </Button>
                    <Button
                        style={{ margin: '0 8px' }}
                        onClick={() => {
                            form.resetFields();
                            setCurPage(1);
                            queryData();
                        }}
                    >
                        Reset
        </Button>
                    <Button type="primary" onClick={showUserModal} icon={<PlusOutlined />}>Add</Button>

                </Col>
            </Row>
        </Form>
        <ModalForm visible={visible} onCancel={hideUserModal} handleUpdate={handleUpdate} defaultData={curRecord} />
        <Table className="table" dataSource={data} columns={columns}
            rowKey={record => record._id}
            pagination={
                {
                    onChange: current => changePagination(current),
                    total,
                    current: currentPage,
                    showTotal: (total) => `Total ${total}`,
                }
            } />;
    </>

}

export default Content;
import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Input, Button, Table, Space, message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import ModalForm from './ModalForm';
import { postData, getSex } from '../utils';
import './Content.css';


const Content = () => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState([]);
    // todo 待开发，接口直接返回，加分页查询
    const [total, setTotal] = useState(0);

    useEffect(() => {
        queryData()
    }, []);

    function handleUpdate() {
        queryData()
    }

    function queryData() {
        return postData('http://localhost:5000/graphql',
            {
                query: `query {
                    getStudent{
                        name
                        sex
                        age
                        phone
                        major
                        grade
                        _id
                    }
                }`
            }
        )
            .then(data => {
                console.log('queryData', data)
                const result = data?.data?.getStudent || [];
                const total = result.length;
                setData(result);
                setTotal(total);
            })
            .catch(error => console.error(error))
    }

    const showUserModal = () => {
        setVisible(true);
    };

    const hideUserModal = () => {
        setVisible(false);
    };


    const onFinish = (values) => {
        console.log(values);
    };

    const changePagination = current => {
        console.log(current);
    }

    const handleEdit = () => {
        message.error('待开发')
    }

    const handleDelete = () => {
        message.error('待开发')
    }

    const getFields = () => {
        const children = [
            <Col span={8} key={"name"}>
                <Form.Item
                    name={"name"}
                    label={"姓名"}
                >
                    <Input />
                </Form.Item>
            </Col>,
            <Col span={8} key="major">
                <Form.Item
                    name={"major"}
                    label={"专业"}
                >
                    <Input />
                </Form.Item>
            </Col>,
            <Col span={8} key="grade">
                <Form.Item
                    name={"grade"}
                    label={"年级"}
                >
                    <Input />
                </Form.Item>
            </Col>,
        ];

        return children;
    };

    const columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: '性别',
            dataIndex: 'sex',
            key: 'sex',
            render: sex => getSex(sex)
        },
        {
            title: '电话',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '专业',
            dataIndex: 'major',
            key: 'major',
        },
        {
            title: '年级',
            dataIndex: 'grade',
            key: 'grade',
        },
        {
            title: '操作',
            dataIndex: 'edit',
            key: 'edit',
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={handleEdit}>修改</a>
                    <a onClick={handleDelete}>删除</a>
                </Space>
            ),
        },
    ];

    return <>
        <Form
            form={form}
            name="advanced_search"
            className="ant-advanced-search-form"
            onFinish={onFinish}
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
                        }}
                    >
                        Reset
        </Button>
                    <Button type="primary" onClick={showUserModal} icon={<PlusOutlined />}>Add</Button>

                </Col>
            </Row>
        </Form>
        <ModalForm visible={visible} onCancel={hideUserModal} handleUpdate={handleUpdate} />
        <Table className="table" dataSource={data} columns={columns} pagination={
            {
                onChange: current => changePagination(current),
                total,
                showTotal: (total) => `Total ${total}`,
            }
        } />;
    </>

}

export default Content;
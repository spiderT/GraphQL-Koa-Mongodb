import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, InputNumber, Modal, Radio } from 'antd';
import { postData } from '../utils';
const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

const useResetFormOnCloseModal = ({ form, visible }) => {
    const prevVisibleRef = useRef();
    useEffect(() => {
        prevVisibleRef.current = visible;
    }, [visible]);
    const prevVisible = prevVisibleRef.current;
    useEffect(() => {
        if (!visible && prevVisible) {
            form.resetFields();
        }
    }, [visible]);
};

const ModalForm = ({ visible, onCancel, handleUpdate }) => {
    const [form] = Form.useForm();
    useResetFormOnCloseModal({
        form,
        visible,
    });

    const onOk = () => {
        form.submit();
    };

    const onFinish = (values) => {
        console.log(values)
        const { name, sex, age, phone, major, grade } = values;
        // todo 调新增接口
        postData('http://localhost:5000/graphql', {
            query: `
              mutation {
                addStudent (post: {
                    name: "${name}"
                    sex: "${sex}"
                    age: ${Number(age)}
                    phone: "${phone}"
                    major: "${major}"
                    grade: "${grade}"
                }) {
                    name
                    sex
                    age
                    phone
                    major
                    grade
                }
              }
            `
        })
            .then(data => {
                console.log(data)
                onCancel();
                handleUpdate();
            })
            .catch(error => console.error(error))

    };

    return (
        <Modal title="Basic Drawer" visible={visible} onOk={onOk} onCancel={onCancel}>
            <Form form={form} layout="horizontal" name="userForm" onFinish={onFinish}>
                <Form.Item
                    name="name"
                    label="姓名"
                    rules={[
                        {
                            required: true,
                            message: "姓名必填",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="age"
                    label="年龄"
                    rules={[
                        {
                            required: true,
                            message: "年龄必填",
                        },
                    ]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    name="sex"
                    label="性别"
                    rules={[
                        {
                            required: true,
                            message: "性别必填",
                        },
                    ]}
                >
                    <Radio.Group>
                        <Radio value={'MALE'}>男</Radio>
                        <Radio value={'FEMALE'}>女</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    name="phone"
                    label="手机号"
                    rules={[
                        {
                            required: true,
                            message: "手机号必填",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="major"
                    label="专业"
                    rules={[
                        {
                            required: true,
                            message: "专业必填",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="grade"
                    label="年级"
                    rules={[
                        {
                            required: true,
                            message: "年级必填",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalForm;
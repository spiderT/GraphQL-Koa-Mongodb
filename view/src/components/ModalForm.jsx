import React, { useEffect, useRef } from 'react';
import { Form, Input, InputNumber, Modal, Radio } from 'antd';
import { postData, formatGQLParams } from '../utils';
import { URL } from '../constants';

const useResetFormOnCloseModal = ({ form, visible, defaultData }) => {
    const prevVisibleRef = useRef();
    useEffect(() => {
        prevVisibleRef.current = visible;
        // 编辑回填
        if (defaultData?._id) {
            form.setFieldsValue(defaultData);
        }
    }, [visible]);
    const prevVisible = prevVisibleRef.current;
    useEffect(() => {
        if (!visible && prevVisible) {
            form.resetFields();
        }
    }, [visible]);
};

const ModalForm = ({ visible, onCancel, handleUpdate, defaultData }) => {
    const [form] = Form.useForm();
    useResetFormOnCloseModal({
        form,
        visible,
        defaultData
    });

    const onOk = () => {
        form.submit();
    };

    const addData = (params) => {
        return postData(URL, {
            query: `
                mutation {
                    addStudent (post: {
                       ${formatGQLParams(params)}
                    }) {
                        count
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
    }

    const editData = (params) => {
        return postData(URL, {
            query: `
                mutation {
                    editStudent (post: {
                        ${formatGQLParams(params)}
                    }) {
                        count
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
    }

    const onFinish = (values) => {
        console.log(values)
        const params = {
            ...values, age: Number(values.age)
        }
        if (defaultData?._id) {
            // 编辑接口
            editData({ ...params, _id: defaultData._id })
        } else {
            // 新增接口
            addData(params)
        }
    };

    return (
        <Modal title="新增/编辑学生信息" visible={visible} onOk={onOk} onCancel={onCancel}>
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
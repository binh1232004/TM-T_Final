"use client";

import { Button, Checkbox, DatePicker, Form, Input, Modal, Select, Switch } from "antd";
import { useEffect, useState } from "react";
import moment from "moment";


export default function UserForm({ user, open = false, onClose = null, onComplete = null }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const closeModal = () => {
        setIsModalOpen(false);
        if (onClose) {
            onClose();
        }
    };

    const clearForm = () => {
        form.resetFields();
    };

    const onFinish = (values) => {
        console.log(values);
        // TODO: update user info
    };

    useEffect(() => {
        setIsModalOpen(open);
    }, [open]);

    useEffect(() => {
        if (isModalOpen) {
            user?.info?.name && form.setFieldsValue({ name: user.info.name });
            user?.info?.name && form.setFieldsValue({ phone: user.info.phone });
            user?.info?.name && form.setFieldsValue({ gender: user.info.gender });
            user?.info?.birthday && form.setFieldsValue({ birthday: new moment(user.info.birthday) });
            form.setFieldsValue({ admin: user.admin });
        }
    }, [user, isModalOpen]);

    return <Modal title="Edit user info" open={isModalOpen} onOk={closeModal}
                  onCancel={closeModal} footer={null} destroyOnClose style={{ top: 20 }}
                  forceRender afterClose={clearForm}>
        <Form
            form={form}
            layout="horizontal"
            labelCol={{ span: 6 }}
            requiredMark={false}
            onFinish={onFinish}
            onFinishFailed={() => {
            }}
            autoComplete="off"
        >
            <Form.Item
                name="name"
                label="Name"
                rules={[
                    { required: true, message: "Please input name!" }
                ]}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{
                    pattern: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
                    message: "Invalid number!"
                }]}
            >
                <Input style={{ width: "100%" }}/>
            </Form.Item>
            <Form.Item
                name="gender"
                label="Gender"
            >
                <Select placeholder="select your gender">
                    <Select.Option value="male">Male</Select.Option>
                    <Select.Option value="female">Female</Select.Option>
                    <Select.Option value="other">Other</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item name="birthday" label="Birthday" valuePropName="value">
                <DatePicker format="YYYY/MM/DD"/>
            </Form.Item>
            <Form.Item
                name="admin"
                label="Admin"
                valuePropName="checked"
            >
                <Switch />
            </Form.Item>
            <Form.Item>
                <div className="flex flex-row gap-2">
                    <Button type="default" onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </div>
            </Form.Item>
        </Form>
    </Modal>;
}
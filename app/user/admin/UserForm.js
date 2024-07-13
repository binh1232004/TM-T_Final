"use client";

import { Button, DatePicker, Form, Input, Modal, Select, Switch } from "antd";
import { useEffect, useState } from "react";
import { updateUserAdmin, updateUserInfo } from "@/lib/firebase";
import { useMessage } from "@/lib/utils";
import dayjs from "dayjs";

const Form_ = ({ form, onFinish, closeModal, modal = true }) => {
    return <Form
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
            <DatePicker multiple={false} onChange={(e) => {
                console.log(e);
            }}/>
        </Form.Item>
        {modal ? <Form.Item
            name="admin"
            label="Admin"
            valuePropName="checked"
        >
            <Switch/>
        </Form.Item> : null}
        <Form.Item>
            <div className="flex flex-row gap-2 w-full justify-end">
                {modal ? <Button type="default" onClick={closeModal}>
                    Cancel
                </Button> : null}
                <Button type="primary" htmlType="submit">
                    Save
                </Button>
            </div>
        </Form.Item>
    </Form>;
};

export default function UserForm({ user, open = false, onClose = null, onComplete = null, modal = true }) {
    const { error, loading, success, contextHolder } = useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const closeModal = () => {
        setIsModalOpen(false);
        onClose?.();
    };

    const clearForm = () => {
        form.resetFields();
    };

    const onFinish = (values) => {
        const result = {
            name: values.name,
            phone: values.phone || "",
            gender: values.gender || "",
            birthday: values.birthday?.toString() || "",
        };

        const destroy = loading("Saving...");
        closeModal();
        updateUserInfo(user.uid, result).then(() => {
            if (modal) {
                updateUserAdmin(user.uid, values.admin).then((result) => {
                    if (result.status === "success") {
                        destroy();
                        success("User info saved");
                    } else {
                        destroy();
                        error(result.message);
                    }
                });
            } else {
                destroy();
                success("User info saved");
            }
        }).catch((e) => {
            destroy();
            error("Save user info failed " + e.message);
        }).finally(() => {
            onComplete?.();
        });
    };

    useEffect(() => {
        setIsModalOpen(open);
    }, [open]);

    useEffect(() => {
        if (!modal || isModalOpen) {
            user?.info?.name && form.setFieldsValue({ name: user.info.name });
            user?.info?.phone && form.setFieldsValue({ phone: user.info.phone });
            user?.info?.gender && form.setFieldsValue({ gender: user.info.gender });
            user?.info?.birthday && form.setFieldsValue({ birthday: new dayjs(user.info.birthday) });
            form.setFieldsValue({ admin: user.admin });
        }
    }, [user, isModalOpen, modal, form]);

    if (modal) {
        return <Modal title="Edit user info" open={isModalOpen} onOk={closeModal}
                      onCancel={closeModal} footer={null} destroyOnClose style={{ top: 20 }}
                      forceRender afterClose={clearForm}>
            {contextHolder}
            <Form_ form={form} onFinish={onFinish} closeModal={closeModal}></Form_>
        </Modal>;
    } else {
        return <>
            {contextHolder}
            <Form_ form={form} onFinish={onFinish} closeModal={closeModal} modal={modal}></Form_>
        </>;
    }

}
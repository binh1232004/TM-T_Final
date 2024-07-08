"use client";

import { Button, DatePicker, Form, Input, message, Modal, Select } from "antd";
import { createUser, login } from "@/lib/firebase";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useLayoutEffect, useState } from "react";

export const LoginForm = ({ register = false, onClose = null, open = false }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [_register, setRegister] = useState(register);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const closeModal = () => {
        setIsModalOpen(false);
        if (onClose) {
            onClose();
        }
    }

    const error = (message) => {
        messageApi.open({
            type: "error",
            content: message,
        }).then(r => {
        });
    };

    const success = (message) => {
        messageApi.open({
            type: "success",
            content: message,
        }).then(r => {
        });
    };

    const onFinish = (values) => {
        if (_register) {
            createUser(values.email, values.password, {
                displayName: values.name,
                phoneNumber: values.phone || "",
                gender: values.gender || "",
                birthday: values.birthday || ""
            }).then(result => {
                if (result.status === "success") {
                    success("Register successful");
                    closeModal();
                } else {
                    error("Register failed " + result.message);
                }
            });
        } else {
            login(values.email, values.password).then(result => {
                if (result.status === "success") {
                    success("Login successful");
                    closeModal();
                } else {
                    error("Login failed " + result.message);
                }
            });
        }

    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    useLayoutEffect(() => {
        setIsModalOpen(true);
    }, []);

    useLayoutEffect(() => {
        setIsModalOpen(open);
    }, [open]);

    return (
        <>
            {contextHolder}
            <Modal title={_register ? "Register" : "Login"} open={isModalOpen} onOk={closeModal} onCancel={closeModal} footer={null} destroyOnClose>
                <div className="p-2 bg-white m-auto top-0 left-0 rounded-lg">
                    {!_register ?
                        <Form
                            name="normal_login"
                            className="login-form"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                        >
                            <Form.Item
                                name="email"
                                rules={[
                                    { type: "email", message: "The input is not valid E-mail!" },
                                    { required: true, message: "Please input your Email!" }
                                ]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Email"/>
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    { required: true, message: "Please input your Password!" },
                                    { min: 6, message: "Password must be at least 6 characters!" }
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="site-form-item-icon"/>}
                                    placeholder="Password"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button w-full mb-2">
                                    Log in
                                </Button>
                                    Or <button className="underline text-blue-500" onClick={() => {
                                    setRegister(true);
                                }}>register now!</button>
                            </Form.Item>
                        </Form>
                        : <Form
                            name="register"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            scrollToFirstError
                        >
                            <Form.Item
                                name="email"
                                label="E-mail"
                                rules={[
                                    { type: "email", message: "The input is not valid E-mail!", },
                                    { required: true, message: "Please input your E-mail!", },
                                ]}
                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[
                                    { required: true, message: "Please input your password!" },
                                    { min: 6, message: "Password must be at least 6 characters!" },
                                ]}
                            >
                                <Input.Password/>
                            </Form.Item>
                            <Form.Item
                                name="confirm"
                                label="Confirm Password"
                                dependencies={["password"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please confirm your password!",
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue("password") === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error("Password do not match!"));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password/>
                            </Form.Item>
                            <Form.Item
                                name="name"
                                label="Name"
                                rules={[{ required: true, message: "Please input your name!", whitespace: true }]}
                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item
                                name="phone"
                                label="Phone Number"
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
                            <Form.Item name="birthday" label="Birthday">
                                <DatePicker/>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button w-full mb-2">
                                    Register
                                </Button>
                                <p>
                                    Or <button className="underline text-blue-500" onClick={() => {
                                        setRegister(false);
                                    }}>login now!</button>
                                </p>
                            </Form.Item>
                        </Form>
                    }
                </div>
            </Modal>
        </>
    );
};
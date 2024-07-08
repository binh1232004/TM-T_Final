"use client";

import { Button, DatePicker, Form, Input, message, Select } from "antd";
import { createUser, login } from "@/lib/firebase";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useLayoutEffect, useState } from "react";

export const LoginForm = ({ absolute = true, x = 0, y = 0, register = false }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [_register, setRegister] = useState(register);

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
            createUser(values.email, values.password).then(result => {
                if (result.status === "success") {
                    success("Register successful");
                } else {
                    error("Register failed " + result.message);
                }
            });
        } else {
            login(values.email, values.password).then(result => {
                if (result.status === "success") {
                    success("Login successful");
                } else {
                    error("Login failed " + result.message);
                }
            });
        }

    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    return (
        <div className={`outline-1 outline-red-500 outline p-2 ${absolute ? "absolute" : ""}`}
             style={{ left: x, top: y }}>
            {contextHolder}
            {!_register ?
                <>
                    <h1 className="w-full text-center my-2">Login</h1>
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
                            window.history.replaceState({}, document.title, window.location.pathname + "?register");
                            setRegister(true);
                        }}>register now!</button>
                        </Form.Item>
                    </Form>
                </>
                : <>
                    <h1 className="w-full text-center my-2">Register</h1>
                    <Form
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
                            rules={[{ required: true, message: "Please input your phone number!" }]}
                        >
                            <Input style={{ width: "100%" }}/>
                        </Form.Item>
                        <Form.Item
                            name="gender"
                            label="Gender"
                            rules={[{ required: true, message: "Please select gender!" }]}
                        >
                            <Select placeholder="select your gender">
                                <Select.Option value="male">Male</Select.Option>
                                <Select.Option value="female">Female</Select.Option>
                                <Select.Option value="other">Other</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="Birthday" label="Birthday"
                                   rules={[{ required: true, message: "Please select your birthday!" }]}>
                            <DatePicker/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button w-full mb-2">
                                Register
                            </Button>
                            <p>
                                Or <button className="underline text-blue-500" onClick={() => {
                                window.history.replaceState({}, document.title, window.location.pathname);
                                setRegister(false);
                            }}>login now!</button>
                            </p>

                        </Form.Item>
                    </Form>
                </>
            }

        </div>
    );
};
"use client";

import {
    HomeOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    PoweroffOutlined,
    SettingOutlined,
    BellOutlined,
    CreditCardOutlined,
} from "@ant-design/icons";
import { Button, Input, Popover, Menu, Badge, Tooltip } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { blue } from "@ant-design/colors";
import { useLayoutEffect, useState } from "react";
import { getUser, logout } from "@/lib/firebase";
import { LoginForm } from "@/app/LoginForm";
import { Image } from "antd";

const list = [
    {
        name: (
            <span>
                <HomeOutlined /> Home
            </span>
        ),
        path: "/",
    },
    {
        name: "Shirts",
        path: "/shirts",
    },
    {
        name: "Pants",
        path: "/pants",
    },
    {
        name: "Accessories",
        path: "/accessories",
    },
];

const menu = [
    {
        key: "1",
        icon: <SettingOutlined />,
        label: "Manage account",
    },
    {
        key: "2",
        icon: <CreditCardOutlined />,
        label: "Oders",
    },
    {
        key: "3",
        icon: <PoweroffOutlined />,
        label: "Sign out",
    },
];

const Nav = () => {
    const { Search } = Input;
    const pathName = usePathname();
    const [user, setUser] = useState(null);
    const [loginForm, setLoginForm] = useState(false);
    const [open, setOpen] = useState(false);
    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };

    useLayoutEffect(() => {
        getUser((u) => {
            setUser(u?.email);
        });
    }, []);

    // const onSearch = (value, _e, info) => console.log(info?.source, value);
    return (
        <nav>
            <div></div>
            <div className="flex flex-row justify-between items-center h-14 bg-[#29292c]">
                <LoginForm open={loginForm} onClose={() => setLoginForm(false)} />
                <div className="mx-3 my-5">
                    <Button
                        className="!border-none !text-white !bg-transparent hover:!text-blue-500"
                        icon={<UserOutlined style={{ fontSize: "20px" }} />}
                        onClick={() => {
                            if (user) setOpen(true);
                            else setLoginForm(!loginForm);
                        }}
                    >
                        {user ? user : "Tài khoản"}
                    </Button>
                    <Popover
                        content={<Menu mode="inline" items={menu} onClick={(item) => {
                            if(item.key === "3") {
                                logout().then(() => setOpen(false));
                            }
                        }} />}
                        // title="Title"
                        trigger="click"
                        open={open}
                        placement="bottomLeft"
                        onOpenChange={handleOpenChange}
                        defaultSelectedKeys={[]}
                        className="absolute left-0 top-12"
                    />
                </div>
                <div className="h-full w-full flex gap-8 justify-evenly items-center">
                    {list.map((item, index) => {
                        return (
                            <div
                                className="w-fit text-white hover:text-blue-500 flex justify-center items-center"
                                key={index}
                            >
                                <Link
                                    href={item.path}
                                    className={`${
                                        item.path === pathName &&
                                        "border-b-2 border-white hover:border-blue-500"
                                    } capitalize font-medium transition-all`}
                                >
                                    {item.name}
                                </Link>
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-center items-center mx-3 my-5">
                    <Tooltip
                        placement="bottom"
                        title="Cart"
                        color="white"
                        overlayInnerStyle={{ color: "black" }}
                    >
                        <Button className="!border-none !bg-transparent !text-white group">
                            <Badge
                                size="small"
                                count={5}
                                className="!text-white group-hover:!text-blue-500"
                            >
                                <ShoppingCartOutlined
                                    style={{ fontSize: "25px" }}
                                />
                            </Badge>
                        </Button>
                    </Tooltip>
                    <Tooltip
                        placement="bottom"
                        title="Notification"
                        color="white"
                        overlayInnerStyle={{ color: "black" }}
                    >
                        <Button className="!border-none !bg-transparent group">
                            <Badge
                                size="small"
                                count={2}
                                className="!text-white group-hover:!text-blue-500"
                            >
                                <BellOutlined style={{ fontSize: "25px" }} />
                            </Badge>
                        </Button>
                    </Tooltip>
                </div>
            </div>
            <div className="mx-3 my-5 flex gap-8 absolute right-0">
                <Search
                    placeholder="Search"
                    // onSearch={onSearch}
                    enterButton
                    className="!w-[200px]"
                />
            </div>
        </nav>
    );
};

export default Nav;

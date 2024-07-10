"use client";

import {
    HomeOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    PoweroffOutlined,
    SettingOutlined,
    BellOutlined,
    CreditCardOutlined,
    KeyOutlined,
} from "@ant-design/icons";
import {
    Button,
    Input,
    Popover,
    Menu,
    Badge,
    Tooltip,
    Spin,
    Image,
} from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { blue } from "@ant-design/colors";
import { useEffect, useLayoutEffect, useState } from "react";
import { logout, useUser } from "@/lib/firebase";
import { LoginForm } from "@/app/LoginForm";

const list = [
    {
        key: "/",
        label: (
            <Link href="/">
                <span>
                    <HomeOutlined /> Home
                </span>
            </Link>
        ),
    },
    {
        key: "/shirts",
        label: (
            <Link href="/shirts">
                <span>Shirts</span>
            </Link>
        ),
    },
    {
        key: "/pants",
        label: (
            <Link href="/pants">
                <span>Pants</span>
            </Link>
        ),
    },
    {
        key: "/accessories",
        label: (
            <Link href="/accessories">
                <span>Accessories</span>
            </Link>
        ),
    },
];

const Nav = () => {
    const pathName = usePathname();
    const user = useUser();
    const [loginForm, setLoginForm] = useState(false);
    const [open, setOpen] = useState(false);
    const [menu, setMenu] = useState([
        {
            key: "1",
            icon: <SettingOutlined />,
            label: (
                <Link href="">
                    <span>Manage account</span>
                </Link>
            ),
        },
        {
            key: "2",
            icon: <CreditCardOutlined />,
            label: (
                <Link href="">
                    <span>Oders</span>
                </Link>
            ),
        },
        {
            key: "3",
            icon: <PoweroffOutlined />,
            label: (
                <Link href="">
                    <span>Sign out</span>
                </Link>
            ),
        },
    ]);
    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };

    useEffect(() => {
        if (user?.admin) {
            if (menu[0].key !== "/admin") {
                setMenu([
                    {
                        key: "/admin",
                        icon: <KeyOutlined />,
                        label: (
                            <Link href="/user/admin">
                                <span>Admin</span>
                            </Link>
                        ),
                    },
                    ...menu,
                ]);
            }
        }
    }, [user]);

    return (
        <nav>
            <div className="flex flex-row justify-between items-center h-14">
                <LoginForm
                    open={loginForm}
                    onClose={() => setLoginForm(false)}
                />
                <div className="">
                    <Button
                        className="!border-none !text-white !bg-transparent hover:!text-blue-500"
                        icon={<UserOutlined style={{ fontSize: "20px" }} />}
                        onClick={() => {
                            if (user) setOpen(true);
                            else setLoginForm(!loginForm);
                        }}
                    >
                        {user !== undefined ? (
                            user?.email || "Sign in"
                        ) : (
                            <Spin size="small" />
                        )}
                    </Button>
                    <Popover
                        content={
                            <Menu
                                mode="inline"
                                items={menu}
                                onClick={(item) => {
                                    if (item.key === "3") {
                                        logout().then(() => setOpen(false));
                                    } else {
                                        setOpen(false);
                                    }
                                }}
                                selectedKeys={[]}
                            />
                        }
                        // title="Title"
                        trigger="click"
                        open={open}
                        placement="bottomLeft"
                        onOpenChange={handleOpenChange}
                        defaultSelectedKeys={[]}
                        className="absolute left-10 top-12"
                    />
                </div>
                <div className="h-full w-full !flex gap-8 !justify-center !items-center">
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        items={list}
                        selectedKeys={[pathName]}
                        style={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                    />
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
        </nav>
    );
};

export default Nav;

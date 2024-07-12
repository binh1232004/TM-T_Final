"use client";

import { LoginForm } from "@/app/LoginForm";
import { getCart, logout, useUser } from "@/lib/firebase";
import { getCatalogs } from "@/lib/firebase_server";
import {
    BellOutlined,
    CreditCardOutlined,
    HomeOutlined,
    KeyOutlined,
    PoweroffOutlined,
    SettingOutlined,
    ShoppingCartOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Badge, Button, Menu, Popover, Spin, Input } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Nav = () => {
    const pathName = usePathname();
    const user = useUser();
    const [loginForm, setLoginForm] = useState(false);
    const [open, setOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [nav, setNav] = useState([
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
    ]);
    const [userMenu, setUserMenu] = useState([
        {
            key: "1",
            icon: <SettingOutlined />,
            label: (
                <Link href={"/user"}>
                    <span>Manage account</span>
                </Link>
            ),
        },
        {
            key: "2",
            icon: <CreditCardOutlined />,
            label: (
                <Link href={"/user/orders"}>
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
    const { Search } = Input;

    useEffect(() => {
        getCatalogs().then((data) => {
            setNav([
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
                ...Object.keys(data).map((key) => {
                    return {
                        key: `/${data[key].name.toLowerCase()}`,
                        label: (
                            <Link href={`/${data[key].name.toLowerCase()}`}>
                                <span>{data[key].name}</span>
                            </Link>
                        ),
                    };
                }),
            ]);
            setLoaded(true);
        });
    }, []);

    useEffect(() => {
        if (user?.admin) {
            if (userMenu[0].key !== "/admin") {
                setUserMenu([
                    {
                        key: "/admin",
                        icon: <KeyOutlined />,
                        label: (
                            <Link href={"/user/admin"}>
                                <span>Admin</span>
                            </Link>
                        ),
                    },
                    ...userMenu,
                ]);
            }
        }
        if (user) {
            setCartCount(getCart(user).length);
        }
    }, [user, userMenu]);

    return (
        loaded && (
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
                                    items={userMenu}
                                    onClick={(item) => {
                                        if (item.key === "3") {
                                            logout().then(() => {
                                                setOpen(false);
                                                setCartCount(0);
                                            });
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
                    <div className="h-full w-fit !flex gap-8 !justify-center !items-center">
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            items={nav}
                            selectedKeys={[pathName]}
                            className="w-full"
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        />
                    </div>
                    <div className="flex justify-center items-center w-96">
                        <Search
                            placeholder="input search text"
                            enterButton="Search"
                            // style={{width:"500px md:300px"}}
                            // size="large"
                            // onSearch={onSearch}
                        />
                    </div>
                    <div className="flex justify-center items-center mx-3 my-5">
                        <div className="translate-y-1">
                            <Link
                                href="/user/cart"
                                className="!border-none !bg-transparent !text-white group"
                            >
                                <Badge
                                    size="small"
                                    count={cartCount}
                                    className="!text-white group-hover:!text-blue-500 !outline-none"
                                    classNames={{
                                        indicator: "!shadow-none",
                                    }}
                                >
                                    <ShoppingCartOutlined
                                        style={{ fontSize: "25px" }}
                                    />
                                </Badge>
                            </Link>
                        </div>
                        <Button className="!border-none !bg-transparent group">
                            <Badge
                                size="small"
                                count={0}
                                className="!text-white group-hover:!text-blue-500"
                            >
                                <BellOutlined style={{ fontSize: "25px" }} />
                            </Badge>
                        </Button>
                    </div>
                </div>
            </nav>
        )
    );
};

export default Nav;

"use client";

import { LoginForm } from "@/app/LoginForm";
import { logout, useCart, usePendingOrder, useUser } from "@/lib/firebase";
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
    NotificationOutlined,
} from "@ant-design/icons";
import { Badge, Button, Input, List, Menu, Popover, Spin, Tooltip } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cart from "./user/[userAction]/Cart";

const Nav = () => {
    const pathName = usePathname();
    const router = useRouter();
    const user = useUser();
    const [loginForm, setLoginForm] = useState(false);
    const [open, setOpen] = useState(false);
    const [mailchimpOpen, setMailchimpOpen] = useState(false); // State for Mailchimp popover
    const cart = useCart();
    const pendingOder = usePendingOrder();
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
    const [notification, setNotification] = useState({});
    useEffect(() => {
        if (pendingOder.length)
            setNotification((prev) => {
                return {
                    ...prev,
                    pendingOder: (
                        <Link href={"/user/payment"} className="text-red-500">
                            You have a pending oder!
                        </Link>
                    ),
                };
            });
        else
            setNotification((prev) => {
                delete prev.pendingOder;
                return prev;
            });
    }, [pendingOder]);
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
        } else {
            if (userMenu[0].key === "/admin") {
                setUserMenu(userMenu.slice(1));
            }
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
                        <Popover
                            content={
                                <Menu
                                    mode="inline"
                                    items={userMenu}
                                    onClick={(item) => {
                                        if (item.key === "3") {
                                            logout().then(() => {
                                                setOpen(false);
                                            });
                                        } else {
                                            setOpen(false);
                                        }
                                    }}
                                    selectedKeys={[]}
                                />
                            }
                            trigger="click"
                            open={open}
                            placement="bottomLeft"
                            onOpenChange={handleOpenChange}
                            defaultSelectedKeys={[]}
                        >
                            <Button
                                className="!border-none !text-white !bg-transparent hover:!text-blue-500"
                                icon={
                                    <UserOutlined
                                        style={{ fontSize: "20px" }}
                                    />
                                }
                                onClick={() => {
                                    if (!user) {
                                        setLoginForm(!loginForm);
                                        setOpen(false);
                                    }
                                }}
                                disabled={user === undefined}
                            >
                                {user !== undefined ? (
                                    user?.email || "Sign in"
                                ) : (
                                    <Spin size="small" />
                                )}
                            </Button>
                        </Popover>
                    </div>
                    <div className="h-full w-96 !flex gap-8 !justify-evenly !items-center">
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
                            placeholder="Search"
                            enterButton
                            defaultValue={
                                new URL(window.location.href).searchParams.get(
                                    "q"
                                ) || ""
                            }
                            onSearch={(value) => {
                                if (!value) return;
                                router.push(`/search?q=${value}`);
                                window.location.reload();
                            }}
                            // style={{width:"500px md:300px"}}
                            // size="large"
                            // onSearch={onSearch}
                        />
                    </div>
                    <div className="flex justify-center items-center mx-3 my-5 gap-4">
                        <div className="translate-y-1">
                            <Link
                                href={"/news"}
                                className="!border-none !bg-transparent !text-white group"
                            >
                                <Tooltip title="News" color="white" overlayClassName="[&_*]:!text-black">
                                    <NotificationOutlined
                                        className="!text-white group-hover:!text-blue-500 !outline-none"
                                        style={{ fontSize: "25px" }}
                                    />
                                </Tooltip>
                            </Link>
                        </div>
                        <div className="translate-y-1">
                            <Popover
                                fresh
                                placement="bottomRight"
                                arrow={{ pointAtCenter: true }}
                                title={
                                    user ? (
                                        "New product added to cart"
                                    ) : (
                                        <div className="text-center m-0">
                                            Sign in to view cart
                                        </div>
                                    )
                                }
                                content={
                                    user ? (
                                        <div className="flex flex-col gap-4">
                                            <Cart c={cart} small></Cart>
                                        </div>
                                    ) : null
                                }
                            >
                                <Link
                                    href={"/user/cart"}
                                    className="!border-none !bg-transparent !text-white group"
                                >
                                    <Badge
                                        size="small"
                                        count={cart.length}
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
                            </Popover>
                        </div>
                        <div className="translate-y-1">
                            <Popover
                                fresh
                                placement="bottomRight"
                                arrow={{ pointAtCenter: true }}
                                title={
                                    user ? (
                                        "Notifications"
                                    ) : (
                                        <div className="text-center m-0">
                                            Sign in to view notifications
                                        </div>
                                    )
                                }
                                content={
                                    user ? (
                                        <List
                                            bordered
                                            dataSource={Object.keys(
                                                notification
                                            )}
                                            renderItem={() => (
                                                <List.Item>
                                                    {Object.keys(
                                                        notification
                                                    ).map((key) => {
                                                        return notification[
                                                            key
                                                        ];
                                                    })}
                                                </List.Item>
                                            )}
                                        ></List>
                                    ) : null
                                }
                            >
                                <Link
                                    href=""
                                    className="!border-none !bg-transparent group"
                                >
                                    <Badge
                                        size="small"
                                        count={Object.keys(notification).length}
                                        className="!text-white group-hover:!text-blue-500"
                                    >
                                        <BellOutlined
                                            style={{ fontSize: "25px" }}
                                        />
                                    </Badge>
                                </Link>
                            </Popover>
                        </div>
                    </div>
                </div>
            </nav>
        )
    );
};

export default Nav;

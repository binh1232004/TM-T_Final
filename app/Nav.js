"use client";

import { LoginForm } from "@/app/LoginForm";
import { logout, useCart, useUser, usePendingOrder } from "@/lib/firebase";
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
    MailOutlined
} from "@ant-design/icons";
import { Badge, Button, Input, Menu, Popover, Spin, List } from "antd";
import { blue } from "@ant-design/colors";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Cart from "./user/[userAction]/Cart";

const Nav = () => {
    const pathName = usePathname();
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
                        <Link href="/user/payment" className="text-red-500">
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
                            placeholder="input search text"
                            enterButton="Search"
                            // style={{width:"500px md:300px"}}
                            // size="large"
                            // onSearch={onSearch}
                        />
                    </div>
                    <div className="flex justify-center items-center mx-3 my-5 gap-4">
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
                                    <List
                                        bordered
                                        dataSource={Object.keys(notification)}
                                        renderItem={() => (
                                            <List.Item>
                                                {Object.keys(notification).map(
                                                    (key, index) => {
                                                        return notification[
                                                            key
                                                        ];
                                                    }
                                                )}
                                            </List.Item>
                                        )}
                                    ></List>
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
                        {/* Mailchimp Icon and Popover */}
                        <Popover
                            content={
                                <div id="mc_embed_shell">
                                    <link href="//cdn-images.mailchimp.com/embedcode/classic-061523.css" rel="stylesheet" type="text/css" />
                                    <style type="text/css">
                                        {`
                                            #mc_embed_signup{background:#fff; clear:left; font:14px Helvetica,Arial,sans-serif; width: 600px;}
                                            /* Add your own Mailchimp form style overrides in your site stylesheet or in this style block.
                                               We recommend moving this block and the preceding CSS link to the HEAD of your HTML file. */
                                        `}
                                    </style>
                                    <div id="mc_embed_signup">
                                        <form action="https://zohomail.us17.list-manage.com/subscribe/post?u=16511ef613aa60fd4375c250b&amp;id=02fd0253cd&amp;f_id=0087c2e1f0" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank">
                                            <div id="mc_embed_signup_scroll">
                                                <h2>Subscribe</h2>
                                                <div className="indicates-required">
                                                    <span className="asterisk">*</span> indicates required
                                                </div>
                                                <div className="mc-field-group">
                                                    <label htmlFor="mce-EMAIL">Email Address <span className="asterisk">*</span></label>
                                                    <input type="email" name="EMAIL" className="required email" id="mce-EMAIL" required value="" />
                                                </div>
                                                <div className="mc-field-group">
                                                    <label htmlFor="mce-FNAME">First Name </label>
                                                    <input type="text" name="FNAME" className="text" id="mce-FNAME" value="" />
                                                </div>
                                                <div className="mc-field-group">
                                                    <label htmlFor="mce-LNAME">Last Name </label>
                                                    <input type="text" name="LNAME" className="text" id="mce-LNAME" value="" />
                                                </div>
                                                <div className="mc-field-group">
                                                    <label htmlFor="mce-PHONE">Phone Number </label>
                                                    <input type="text" name="PHONE" className="REQ_CSS" id="mce-PHONE" value="" />
                                                </div>
                                                <div id="mce-responses" className="clear foot">
                                                    <div className="response" id="mce-error-response" style={{display: "none"}}></div>
                                                    <div className="response" id="mce-success-response" style={{display: "none"}}></div>
                                                </div>    
                                                <div style={{position: "absolute", left: "-5000px"}} aria-hidden="true">
                                                    <input type="text" name="b_16511ef613aa60fd4375c250b_02fd0253cd" tabIndex="-1" value="" />
                                                </div>
                                                <div className="clear">
                                                    <input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" className="button" />
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            }
                            trigger="click"
                            open={mailchimpOpen}
                            placement="bottomRight"
                            onOpenChange={setMailchimpOpen}
                        >
                            <Button className="!border-none !bg-transparent group">
                                <MailOutlined style={{ fontSize: "25px", color: "white" }} />
                            </Button>
                        </Popover>
                    </div>
                </div>
            </nav>
        )
    );
};

export default Nav;

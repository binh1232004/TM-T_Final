"use client";

import { LoginForm } from "@/app/LoginForm";
import {
    getCart,
    logout,
    useUser,
    setCart as setCartDb,
    setPendingOrder,
} from "@/lib/firebase";
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
    DeleteOutlined,
    ExclamationCircleFilled,
    EyeOutlined,
} from "@ant-design/icons";
import {
    Badge,
    Button,
    Menu,
    Popover,
    Spin,
    Input,
    List,
    Checkbox,
    Typography,
    Modal,
    Select,
    InputNumber,
    Image,
} from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { numberWithSeps, useMessage } from "@/lib/utils";
import { getProduct } from "@/lib/firebase_server";
import { useRouter } from "next/navigation";

const Nav = () => {
    const pathName = usePathname();
    const user = useUser();
    const [loginForm, setLoginForm] = useState(false);
    const [open, setOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [cart, setCart] = useState([]);
    const [checkOut, setCheckOut] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const { success, error, loading, contextHolder } = useMessage();
    const router = useRouter();
    const { Title, Text, Paragraph } = Typography;
    const { confirm } = Modal;

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
                    <span>Orders</span>
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
    }, [user, userMenu]);

    const CartItem = ({ cartItem, onEdit, onDelete, onChecked }) => {
        return (
            <List.Item>
                <div className="grid grid-cols-6 justify-between w-full">
                    <div className="flex flex-row gap-2 col-span-2">
                        <Checkbox
                            className="my-auto"
                            checked={cartItem.checked}
                            onChange={(e) => {
                                onChecked?.({
                                    ...cartItem,
                                    checked: e.target.checked,
                                });
                            }}
                        />
                        <div className="flex w-full">
                            <div className="h-fit w-fit my-auto shrink-0">
                                <Image
                                    src={cartItem.images[0]}
                                    className="aspect-square object-fit max-h-16 rounded-lg"
                                    preview={{
                                        mask: (
                                            <EyeOutlined className="text-xl" />
                                        ),
                                        maskClassName: "rounded-lg",
                                    }}
                                />
                            </div>
                            <div className="col-span-2 p-3 my-auto pr-4">
                                <Paragraph ellipsis={{ rows: 2 }}>
                                    {cartItem.name}
                                </Paragraph>
                            </div>
                        </div>
                    </div>
                    <div className="my-auto">
                        <p>${numberWithSeps(cartItem.price)}</p>
                    </div>
                    <div className="my-auto">
                        <Select
                            defaultValue={cartItem.variant}
                            onChange={(value) => {
                                onEdit?.({
                                    ...cartItem,
                                    variant: value,
                                });
                            }}
                        >
                            {["s", "m", "l", "xl"].map((i) => {
                                return (
                                    <Select.Option key={i} value={i}>
                                        {i.toUpperCase()}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </div>
                    <div className="my-auto">
                        <div>
                            <InputNumber
                                min={1}
                                max={cartItem.variants[cartItem.variant]}
                                defaultValue={cartItem.amount}
                                onChange={(value) => {
                                    if (
                                        value >
                                        cartItem.variants[cartItem.variant]
                                    ) {
                                        return;
                                    }
                                    onEdit?.({
                                        ...cartItem,
                                        amount: value,
                                    });
                                }}
                            />
                            <p>
                                <Text type="secondary">
                                    Stock: {cartItem.variants[cartItem.variant]}
                                </Text>
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-row justify-end gap-2 h-fit my-auto">
                        <Button
                            size="small"
                            type="primary"
                            danger
                            onClick={() => {
                                onDelete?.(cartItem);
                            }}
                        >
                            <DeleteOutlined />
                        </Button>
                    </div>
                </div>
            </List.Item>
        );
    };

    useEffect(() => {
        if (!user) return;
        Promise.all(
            getCart(user).map(async (cartItem) => {
                return getProduct(cartItem.id, cartItem.catalog).then(
                    (product) => {
                        return {
                            ...cartItem,
                            ...product,
                            checked: false,
                        };
                    }
                );
            })
        ).then((data) => {
            setCart(data);
            setLoaded(true);
        });
    }, [user]);

    useEffect(() => {
        if (!user || !loaded) return;
        const destroy = loading("Updating cart...");
        setCheckOut(() => {
            if (cart.length === 0) return false;
            for (let i = 0; i < cart.length; i++) {
                if (cart[i].checked) return true;
            }
            return false;
        });
        setCartDb(
            user,
            cart.map((item) => {
                return {
                    id: item.id,
                    catalog: item.catalog,
                    amount: item.amount,
                    variant: item.variant,
                };
            })
        )
            .then((result) => {
                if (result.status === "success") {
                    destroy();
                    success("Cart updated");
                } else {
                    destroy();
                    error("Failed to update cart");
                }
            })
            .catch(() => {
                error("Failed to update cart");
                destroy();
            });
        return destroy;
    }, [cart, user]);

    const checkAll = (checked) => {
        setCart(
            cart.map((item) => {
                return {
                    ...item,
                    checked: checked,
                };
            })
        );
    };

    const onChecked = (item) => {
        setCart(
            cart.map((cartItem) => {
                if (cartItem.id === item.id) {
                    return item;
                }
                return cartItem;
            })
        );
    };

    const onEdit = (item) => {
        setCart(
            cart.map((cartItem) => {
                if (cartItem.id === item.id) {
                    return item;
                }
                return cartItem;
            })
        );
    };

    const onDelete = (item) => {
        confirm({
            title: "Do you want to delete this items?",
            icon: <ExclamationCircleFilled />,
            okType: "danger",
            maskClosable: true,
            onOk() {
                setCart(cart.filter((cartItem) => cartItem.id !== item.id));
            },
            onCancel() {},
        });
    };

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
                    <div className="flex justify-center items-center mx-3 my-5">
                        <Popover
                            placement="bottom"
                            title="My cart"
                            content={
                                <List
                                    size="small"
                                    bordered
                                    header={
                                        <div className="flex flex-row gap-2 justify-between">
                                            <div className="grid grid-cols-6 w-full">
                                                <Checkbox
                                                    className="!my-auto !h-fit col-span-2"
                                                    onChange={(e) => {
                                                        checkAll(
                                                            e.target.checked
                                                        );
                                                    }}
                                                >
                                                    Product
                                                </Checkbox>
                                                <div className="my-auto">
                                                    <p>Price</p>
                                                </div>
                                                <div className="my-auto">
                                                    <p>Size</p>
                                                </div>
                                                <div className="my-auto">
                                                    <p>Amount</p>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    footer={
                                        <div className="flex flex-initial justify-center items-center">
                                            <Button
                                                disabled={!checkOut}
                                                type="primary"
                                                onClick={() => {
                                                    setPendingOrder(
                                                        user,
                                                        cart
                                                            .filter(
                                                                (item) =>
                                                                    item.checked
                                                            )
                                                            .map((item) => {
                                                                return {
                                                                    id: item.id,
                                                                    catalog:
                                                                        item.catalog,
                                                                    amount: item.amount,
                                                                    variant:
                                                                        item.variant,
                                                                };
                                                            })
                                                    ).then(() => {
                                                        setCart(
                                                            cart.filter(
                                                                (item) =>
                                                                    !item.checked
                                                            )
                                                        );
                                                        router.push(
                                                            "/user/payment"
                                                        );
                                                    });
                                                }}
                                            >
                                                Checkout
                                            </Button>
                                        </div>
                                    }
                                    dataSource={cart}
                                    renderItem={(item) => {
                                        return (
                                            <CartItem
                                                onChecked={onChecked}
                                                onEdit={onEdit}
                                                onDelete={onDelete}
                                                cartItem={item}
                                            ></CartItem>
                                        );
                                    }}
                                />
                            }
                            className="translate-y-1"
                        >
                            <Link
                                href="/user/cart"
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

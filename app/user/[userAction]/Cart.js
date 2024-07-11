"use client";

import { Button, Checkbox, Divider, Image, InputNumber, List, Modal, Select, Spin, Typography } from "antd";
import { getCart, setCart as setCartDb, useUser } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { getProduct } from "@/lib/firebase_server";
import { DeleteOutlined, ExclamationCircleFilled, EyeOutlined } from "@ant-design/icons";
import { numberWithSeps, useMessage } from "@/lib/utils";

const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

const CartItem = ({ cartItem, onEdit, onDelete, onChecked }) => {
    return <List.Item>
        <div className="grid grid-cols-7 justify-between w-full">
            <div className="flex flex-row gap-2 col-span-2">
                <Checkbox className="my-auto" checked={cartItem.checked} onChange={(e) => {
                    onChecked?.({
                        ...cartItem,
                        checked: e.target.checked,
                    });
                }}/>
                <div className="flex w-full">
                    <div className="h-fit w-fit my-auto shrink-0">
                        <Image src={cartItem.images[0]} className="aspect-square object-fit max-h-16 rounded-lg"
                               preview={{
                                   mask: <EyeOutlined className="text-xl"/>,
                                   maskClassName: "rounded-lg"
                               }}/>
                    </div>
                    <div className="col-span-2 p-3 my-auto pr-4">
                        <Paragraph ellipsis={{ rows: 2 }}>{cartItem.name}</Paragraph>
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
                        return <Select.Option key={i} value={i}>{i.toUpperCase()}</Select.Option>;
                    })}
                </Select>
            </div>
            <div className="my-auto">
                <div>
                    <InputNumber min={1} max={cartItem.variants[cartItem.variant]} defaultValue={cartItem.amount}
                                 onChange={(value) => {
                                     if (value > cartItem.variants[cartItem.variant]) {
                                         return;
                                     }
                                     onEdit?.({
                                         ...cartItem,
                                         amount: value,
                                     });
                                 }}/>
                    <p><Text type="secondary">Stock: {cartItem.variants[cartItem.variant]}</Text></p>
                </div>
            </div>
            <div className="my-auto">
                ${numberWithSeps(cartItem.price * cartItem.amount)}
            </div>
            <div className="flex flex-row justify-end gap-2 h-fit my-auto">
                <Button size="small" type="primary" danger onClick={() => {
                    onDelete?.(cartItem);
                }}><DeleteOutlined/></Button>
            </div>
        </div>
    </List.Item>;
};

export default function Cart() {
    const { success, error, loading, contextHolder } = useMessage();
    const user = useUser();
    const [cart, setCart] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [checkOut, setCheckOut] = useState(false);

    useEffect(() => {
        if (!user) return;
        Promise.all(getCart(user).map(async (cartItem) => {
            return getProduct(cartItem.id, cartItem.catalog).then((product) => {
                return {
                    ...cartItem,
                    ...product,
                    checked: false,
                };
            });
        })).then((data) => {
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
        setCartDb(user, cart.map(item => {
            return {
                id: item.id,
                catalog: item.catalog,
                amount: item.amount,
                variant: item.variant,
            };
        })).then(result => {
            if (result.status === "success") {
                destroy();
                success("Cart updated");
            } else {
                destroy();
                error("Failed to update cart");
            }
        }).catch(() => {
            error("Failed to update cart");
            destroy();
        });
        return destroy;
    }, [cart, user]);

    const checkAll = (checked) => {
        setCart(cart.map((item) => {
            return {
                ...item,
                checked: checked,
            };
        }));
    };

    const onChecked = (item) => {
        setCart(cart.map((cartItem) => {
            if (cartItem.id === item.id) {
                return item;
            }
            return cartItem;
        }));
    };

    const onEdit = (item) => {
        setCart(cart.map((cartItem) => {
            if (cartItem.id === item.id) {
                return item;
            }
            return cartItem;
        }));
    };

    const onDelete = (item) => {
        confirm({
            title: "Do you want to delete this items?",
            icon: <ExclamationCircleFilled/>,
            okType: "danger",
            maskClosable: true,
            onOk() {
                setCart(cart.filter((cartItem) => cartItem.id !== item.id));
            },
            onCancel() {
            },
        });
    };

    return <Spin size="large" spinning={!loaded}>
        {contextHolder}
        <Divider orientation="left" className="!my-0" orientationMargin="0">
            <Title level={3}>Your cart</Title>
        </Divider>
        <List
            size="small"
            bordered
            header={<div className="flex flex-row gap-2 justify-between">
                <div className="grid grid-cols-7 w-full">
                    <Checkbox className="!my-auto !h-fit col-span-2" onChange={e => {
                        checkAll(e.target.checked);
                    }}>Product</Checkbox>
                    <div className="my-auto">
                        <p>Price</p>
                    </div>
                    <div className="my-auto">
                        <p>Size</p>
                    </div>
                    <div className="my-auto">
                        <p>Amount</p>
                    </div>
                    <div className="my-auto">
                        <p>Total</p>
                    </div>
                    <Button disabled={!checkOut} type="primary" onClick={() => {
                        console.log(cart.filter((item) => item.checked));
                    }}>Checkout</Button>
                </div>
            </div>}
            dataSource={cart}
            renderItem={(item) => {
                return <CartItem onChecked={onChecked} onEdit={onEdit} onDelete={onDelete} cartItem={item}></CartItem>;
            }}
        />
    </Spin>;
};
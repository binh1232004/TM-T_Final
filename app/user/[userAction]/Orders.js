"use client";

import { Button, Card, Collapse, Divider, List, Popconfirm, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { getOrders, setPendingOrder, usePendingOrder } from "@/lib/firebase";
import { numberWithSeps } from "@/lib/utils";
import Cart from "@/app/user/[userAction]/Cart";
import { useRouter } from "next/navigation";
import { WarningTwoTone } from "@ant-design/icons";

const { Title, Text } = Typography;

const orderListItem = (order) => {
    return <Card key={order.id} className="!my-2">
        <div className="flex flex-col justify-between w-full">
            <div>
                <div className="flex flex-row justify-between">
                    <div>
                        <Title level={5}>{order.date}</Title>
                        <p className="opacity-60">{order?.transactionID || order.id}</p>
                    </div>
                    <Text type={order.status ? "success" : "warning"}
                          className={`flex flex-col justify-center`}>{order.status ? "Complete" : "Ongoing"}</Text>
                </div>
                <hr className="my-2"/>
            </div>
            <div>
                <Collapse items={[{
                    key: "1",
                    label: "Items",
                    children: <Cart c={order?.cart || order?.products} small/>,
                }]}/>
            </div>
            <div className="flex flex-row justify-end w-full">
                <div>
                    <p className="flex flex-row justify-end">Payment: {order.deliveryOption || order.delivery_option}</p>
                    <p>Total: ${numberWithSeps(order.total)}</p>
                </div>
            </div>
        </div>
    </Card>;
};


export default function Orders({ uid = null }) {
    const [orders, setOrders] = useState({});
    const [loaded, setLoaded] = useState(false);
    const router = useRouter();
    const pendingOrder = usePendingOrder();

    useEffect(() => {
        getOrders(uid).then((orders) => {
            if (orders.status === "success") {
                setOrders(Object.keys(orders.data).map((key) => {
                    return {
                        ...orders.data[key],
                        id: key,
                        date: new Date(parseInt(key.slice(0, 13))).toLocaleString(),
                    };
                }));
                setLoaded(true);
            }
        });
    }, [uid]);

    return <Spin spinning={!loaded}>
        <Divider orientation="left" className="!my-0" orientationMargin="0">
            <Title level={3}>{uid ? "" : "Your orders"} <span
                className="opacity-50 text-base">({Object.keys(orders).length})</span></Title>
        </Divider>
        {(!uid) && (pendingOrder.length) ? <div className={"flex flex-row gap-2"}>
            <div className="flex flex-col justify-center">
                You currently have a pending orders.
            </div>
            <Button type="primary" className="!my-2" onClick={() => {
                router.push("/user/payment");
            }}>
                View pending orders
            </Button>
            <Popconfirm
                title="Do you want to cancel the current pending order?"
                description="This action cannot be undone"
                okType={"danger"}
                onConfirm={() => setPendingOrder(null, null)}
                icon={<WarningTwoTone twoToneColor="red"/>}
            >
                <Button danger className="!my-2">
                    Cancel pending orders
                </Button>
            </Popconfirm>
        </div> : null}
        <List
            dataSource={Object.values(orders).sort((a, b) => a.id.localeCompare(b.id)).reverse()}
            renderItem={orderListItem}
        />
    </Spin>;
};
"use client";

import { Layout, Menu, Spin } from "antd";
import { useUser } from "@/lib/firebase";
import { ContainerOutlined, IdcardOutlined, SafetyOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Privacy from "@/app/user/[userAction]/Privacy";
import Link from "next/link";
import UserInfo from "@/app/user/[userAction]/UserInfo";
import Cart from "@/app/user/[userAction]/Cart";
import Orders from "@/app/user/[userAction]/Orders";

const items = [
    {
        label: "User info",
        key: "info",
        icon: <Link href={"/user/info"}><IdcardOutlined/></Link>,
    },
    {
        label: "Cart",
        key: "cart",
        icon: <Link href={"/user/cart"}><ShoppingCartOutlined/></Link>,
    },
    {
        label: "Orders",
        key: "orders",
        icon: <Link href={"/user/orders"}><ContainerOutlined/></Link>,
    },
    {
        label: "Privacy",
        key: "privacy",
        icon: <Link href={"/user/privacy"}><SafetyOutlined/></Link>,
    },
];

export default function UserPage() {
    const user = useUser();
    const router = useRouter();
    const pathName = usePathname();
    const [currentAction, setCurrentAction] = useState("info");
    const [display, setDisplay] = useState(false);

    useEffect(() => {
        if (user !== undefined) {
            if (user === null) {
                router.push("/");
            } else {
                setDisplay(true);
            }
        }
    }, [user, router]);

    useEffect(() => {
        if (items.map((item) => item.key).includes(pathName.split("/")[2])) {
            setCurrentAction(pathName.split("/")[2]);
        } else {
            router.push("/user");
        }
    }, [pathName, router]);


    if (user && display) {
        return <div className="py-12 px-20">
            <Layout className="overflow-hidden">
                <h1 className="w-full text-center text-2xl font-bold my-2">User console</h1>
                <div className="flex flex-row bg-white p-3 rounded-lg">
                    <Menu
                        onClick={() => {
                        }}
                        selectedKeys={[currentAction]}
                        mode="vertical"
                        items={items}
                        className="!bg-transparent max-w-[200px] min-w-[160px]"
                    />
                    <div className="m-3 w-full">
                        {currentAction === "info" && <UserInfo></UserInfo>}
                        {currentAction === "cart" && <Cart></Cart>}
                        {currentAction === "orders" && <Orders></Orders>}
                        {currentAction === "privacy" && <Privacy></Privacy>}
                    </div>
                </div>
            </Layout>
        </div>;
    } else {
        return <div className="w-full h-full flex justify-center p-12"><Spin size="large"/></div>;
    }
}
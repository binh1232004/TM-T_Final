"use client";

import { Layout, Menu, Spin } from "antd";
import ProductList from "@/app/user/admin/ProductList";
import UserList from "@/app/user/admin/UserList";
import { useUser } from "@/lib/firebase";
import { ContainerOutlined, IdcardOutlined, SafetyOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Privacy from "@/app/user/[userAction]/Privacy";
import Link from "next/link";

const items = [
    {
        label: "User info",
        key: "info",
        icon: <Link href="/user/info"><IdcardOutlined/></Link>,
    },
    {
        label: "Cart",
        key: "cart",
        icon: <Link href="/user/cart"><ShoppingCartOutlined/></Link>,
    },
    {
        label: "Orders",
        key: "orders",
        icon: <Link href="/user/orders"><ContainerOutlined/></Link>,
    },
    {
        label: "Privacy",
        key: "privacy",
        icon: <Link href="/user/privacy"><SafetyOutlined/></Link>,
    },
];

export default function UserPage() {
    const user = useUser();
    const router = useRouter();
    const pathName = usePathname();
    const [currentAction, setCurrentAction] = useState("info");
    const [display, setDisplay] = useState(false);

    const onClick = ({ key }) => {
        // setCurrentAction(key);
    };

    useEffect(() => {
        if (user !== undefined) {
            if (user === null) {
                router.push("/");
            } else {
                setDisplay(true);
            }
        }
        console.log("user", user);
    }, [user, router]);

    useEffect(() => {
        setCurrentAction(pathName.split("/")[2] || "info");
    }, [pathName]);


    if (user && display) {
        return <div className="py-12 px-20">
            <Layout className="overflow-hidden">
                <h1 className="w-full text-center text-2xl font-bold my-2">User console</h1>
                <div className="flex flex-row bg-white p-3 rounded-lg">
                    <Menu
                        onClick={onClick}
                        selectedKeys={[currentAction]}
                        mode="vertical"
                        items={items}
                        className="!bg-transparent max-w-[200px] min-w-[160px]"
                    />
                    <div className="m-3 w-full">
                        {currentAction === "1" && <ProductList></ProductList>}
                        {currentAction === "2" && <UserList></UserList>}
                        {currentAction === "privacy" && <Privacy></Privacy>}
                    </div>
                </div>
            </Layout>
        </div>;
    } else {
        return <div className="w-full h-full flex justify-center p-12"><Spin size="large"/></div>;
    }
}
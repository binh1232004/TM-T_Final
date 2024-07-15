"use client";

import { useUser } from "@/lib/firebase";
import { useLayoutEffect, useState } from "react";
import { Layout, Menu, Spin } from "antd";
import { useRouter } from "next/navigation";
import { ContainerOutlined, FireOutlined, ProductOutlined, UserOutlined } from "@ant-design/icons";
import ProductList from "@/app/user/admin/ProductList";
import UserList from "@/app/user/admin/UserList";
import Banners from "@/app/user/admin/Banners";

export default function AdminPage() {
    const user = useUser();
    const router = useRouter();
    const [currentAction, setCurrentAction] = useState("banners");
    const [display, setDisplay] = useState(false);

    const items = [
        {
            label: "Banners",
            key: "banners",
            icon: <FireOutlined/>,
        },
        {
            label: "Products",
            key: "products",
            icon: <ProductOutlined/>,
        },
        {
            label: "Users",
            key: "users",
            icon: <UserOutlined/>,
        },
        {
            label: "Orders",
            key: "orders",
            icon: <ContainerOutlined/>,
        },
    ];

    useLayoutEffect(() => {
        if (user !== undefined) {
            if (!user?.admin) {
                router.push("/");
            } else {
                setDisplay(true);
            }
        }
    }, [user, router]);

    const onClick = ({ key }) => {
        setCurrentAction(key);
    };

    if (user && display) {
        return <div className="py-12 px-20">
            <Layout className="overflow-hidden">
                <h1 className="w-full text-center text-2xl font-bold my-2">Admin console</h1>
                <div className="flex flex-row bg-white p-3 rounded-lg">
                    <Menu
                        onClick={onClick}
                        selectedKeys={[currentAction]}
                        mode="vertical"
                        items={items}
                        className="!bg-transparent max-w-[200px] min-w-[160px]"
                    />
                    <div className="m-3 w-full">
                        {currentAction === "banners" && <Banners></Banners>}
                        {currentAction === "products" && <ProductList></ProductList>}
                        {currentAction === "users" && <UserList></UserList>}
                    </div>
                </div>
            </Layout>
        </div>;
    } else {
        return <div className="w-full h-full flex justify-center p-12"><Spin size="large"/></div>;
    }
}
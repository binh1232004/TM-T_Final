"use client";

import { getUsers, useUser } from "@/lib/firebase";
import { useEffect, useLayoutEffect, useState } from "react";
import { Layout, Menu, Spin } from "antd";
import { useRouter } from "next/navigation";
import { ProductOutlined, UserOutlined } from "@ant-design/icons";
import ProductList from "@/app/user/admin/ProductList";

export default function AdminPage() {
    const user = useUser();
    const router = useRouter();
    const [currentAction, setCurrentAction] = useState("products");

    const items = [
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
    ];

    useLayoutEffect(() => {
        if (user !== undefined) {
            if (!user?.admin) {
                router.push("/");
            }
        }
    }, [user, router]);

    useEffect(() => {
        if (currentAction === "products") {

        } else if (currentAction === "users") {
            getUsers().then((data) => {
                console.log(data);
            });
        }
    }, [currentAction]);

    const onClick = ({ key }) => {
        setCurrentAction(key);
    };

    if (user) {
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
                        {currentAction === "products" && <ProductList></ProductList>}
                        {currentAction === "users" && <div>
                            Users
                        </div>}
                    </div>
                </div>
            </Layout>
        </div>;
    } else {
        return <div className="w-full h-full flex justify-center p-12"><Spin size="large"/></div>;
    }
}
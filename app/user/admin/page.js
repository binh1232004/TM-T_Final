"use client";

import { useUser } from "@/lib/firebase";
import { useEffect, useLayoutEffect, useState } from "react";
import { Layout, Menu, Spin } from "antd";
import { useRouter } from "next/navigation";
import { ProductOutlined, UserOutlined } from "@ant-design/icons";
import { getProducts } from "@/lib/firebase_server";

const items = [
    {
        label: "Products",
        key: "products",
        icon: <ProductOutlined />,
    },
    {
        label: "Users",
        key: "app",
        icon: <UserOutlined />,
    },
];

export default function AdminPage() {
    const user = useUser();
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [current, setCurrent] = useState(items[0].key);

    useLayoutEffect(() => {
        if (user !== undefined) {
            if (!user?.admin) {
                router.push("/");
            }
        }
    }, [user, router]);

    useEffect(() => {
        if (current === "products") {
            getProducts("1").then((data) => {
                setProducts(data);
                console.log("getProducts", current, data);
            });
        }
    }, [current]);

    const onClick = ({ key }) => {
        console.log("click ", key);
        setCurrent(key);
    };

    if (user) {
        return <div className="p-20">
            <Layout className="rounded-lg overflow-hidden">
                <div className="flex flex-row bg-white p-3">
                    <Menu
                        onClick={onClick}
                        selectedKeys={[current]}
                        mode="inline"
                        items={items}
                        className="!bg-transparent max-w-[200px]"
                    />
                    <div className="m-3">
                        {current}
                    </div>
                </div>
            </Layout>
        </div>;
    } else {
        return <div className="w-full h-full flex justify-center p-12"><Spin size="large"/></div>;
    }
}
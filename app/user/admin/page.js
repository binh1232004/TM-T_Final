"use client";

import { useUser } from "@/lib/firebase";
import { useEffect, useLayoutEffect, useState } from "react";
import { Layout, List, Menu, Spin } from "antd";
import { useRouter } from "next/navigation";
import { ProductOutlined, UserOutlined } from "@ant-design/icons";
import { getCatalogs, getProducts } from "@/lib/firebase_server";
import ProductListItem from "@/app/user/admin/ProductListItem";

export default function AdminPage() {
    const user = useUser();
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [catalogs, setCatalogs] = useState([]);
    const [currentState, setCurrentState] = useState("products");
    const [productState, setProductState] = useState();

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

    useLayoutEffect(() => {
        if (user !== undefined) {
            if (!user?.admin) {
                router.push("/");
            }
        }
    }, [user, router]);

    useEffect(() => {
        if (currentState === "products") {
            // getProducts("1").then((data) => {
            //     setProducts(data);
            //     console.log("getProducts", current, data);
            // });
            getCatalogs().then((data) => {
                setCatalogs(Object.keys(data).map((key) => {
                    return {
                        label: data[key].name,
                        key: key,
                        icon: <ProductOutlined />,
                    };
                }));
                setProductState(Object.keys(data)[0]);
            });
        }
    }, [currentState]);

    useEffect(() => {
        if (productState) {
            getProducts(productState, -1).then((data) => {
                setProducts(data);
                console.log("getProducts", productState, data);
            });
        }
    }, [productState]);

    const onClick = ({ key }) => {
        console.log("click ", key);
        setCurrentState(key);
    };

    const onClick2 = ({ key }) => {
        console.log("click2 ", key);
        setProductState(key);
    }

    if (user) {
        return <div className="p-20">
            <Layout className="rounded-lg overflow-hidden">
                <div className="flex flex-row bg-white p-3">
                    <Menu
                        onClick={onClick}
                        selectedKeys={[currentState]}
                        mode="vertical"
                        items={items}
                        className="!bg-transparent max-w-[200px] min-w-[160px]"
                    />
                    <div className="m-3 w-full">
                        {currentState === "products" && <div>
                            <Menu onClick={onClick2} selectedKeys={[productState]} mode="horizontal" items={catalogs} />
                            <List
                                size="small"
                                bordered
                                dataSource={Object.keys(products).map((key) => products[key])}
                                pagination={{position: "bottom", align: "center"}}
                                renderItem={(item) => <ProductListItem product={item}></ProductListItem>}
                            />
                        </div>}
                        {currentState} {productState ?? ""}
                    </div>
                </div>
            </Layout>
        </div>;
    } else {
        return <div className="w-full h-full flex justify-center p-12"><Spin size="large"/></div>;
    }
}
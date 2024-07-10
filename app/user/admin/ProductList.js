"use client";

import { Button, List, Menu, Modal, Spin, Typography } from "antd";
import { ExclamationCircleFilled, PlusCircleOutlined, ProductOutlined } from "@ant-design/icons";
import ProductListItem from "@/app/user/admin/ProductListItem";
import { useEffect, useState } from "react";
import { getCatalogs, getProducts } from "@/lib/firebase_server";
import ProductForm from "@/app/user/admin/ProductForm";
import { updateProduct } from "@/lib/firebase";

const { confirm } = Modal;
const { Title } = Typography;

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [catalogs, setCatalogs] = useState([]);
    const [currentProductCatalog, setCurrentProductCatalog] = useState();
    const [productModal, setProductModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({});
    const [reload, setReload] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCatalogs().then((data) => {
            setCatalogs(Object.keys(data).map((key) => {
                return {
                    label: data[key].name,
                    key: key,
                    icon: <ProductOutlined/>,
                };
            }));
            if (!currentProductCatalog) setCurrentProductCatalog(Object.keys(data)[0]);
        });
    }, []);

    useEffect(() => {
        if (!currentProductCatalog) return;
        setLoading(true);
        getProducts(currentProductCatalog, -1).then((data) => {
            setProducts(data);
            setLoading(false);
        });
    }, [currentProductCatalog, reload]);

    const onClick = ({ key }) => {
        setCurrentProductCatalog(key);
    };

    const onAdd = () => {
        setProductModal(true);
        setCurrentProduct({});
    };

    const onEdit = (product) => {
        setProductModal(true);
        setCurrentProduct(product);
    };


    const onDelete = (product) => {
        confirm({
            title: "Do you want to delete this items?",
            icon: <ExclamationCircleFilled/>,
            content: "This action cannot be undone",
            okType: "danger",
            maskClosable: true,
            onOk() {
                return updateProduct(currentProductCatalog, {}, product.id).then(() => {
                    setReload(!reload);
                });
            },
            onCancel() {
            },
        });
    };

    return (
        <div>
            <Spin size="large" spinning={loading}>
                <Title level={3}>Edit products</Title>
                <ProductForm product={currentProduct} open={productModal} onComplete={() => setReload(!reload)}
                             onClose={() => setProductModal(false)}></ProductForm>
                <div className="flex flex-row justify-between px-2">
                    <Menu onClick={onClick} selectedKeys={[currentProductCatalog]} mode="horizontal"
                          items={catalogs} className="w-full"/>
                    {catalogs.length ? <Button className="my-auto" type="primary" onClick={onAdd}><PlusCircleOutlined/>Add
                        product</Button> : null}
                </div>
                <List
                    size="small"
                    bordered
                    dataSource={Object.keys(products).map((key) => products[key])}
                    pagination={{ position: "bottom", align: "center" }}
                    renderItem={(item) => {
                        return <ProductListItem product={item} onEdit={onEdit}
                                                onDelete={onDelete}></ProductListItem>;
                    }}
                />
            </Spin>
        </div>
    );
}
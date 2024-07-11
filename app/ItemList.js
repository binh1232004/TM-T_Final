"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/firebase_server";
import { Card, Image, Spin, Typography } from "antd";
import Link from "next/link";

const { Title } = Typography;

const width = "w-36";

export default function ItemList({
    catalog = null,
    limit = 10,
    sort = -1,
    title = "Products",
    full = false,
    extra = ""
}) {
    const [products, setProducts] = useState({});

    useEffect(() => {
        getProducts(catalog, limit, sort).then((data) => {
            if (data) {
                setProducts(data);
            }
        });
    }, []);

    return <Spin spinning={Object.keys(products).length === 0}>
        <Card title={<Title level={3} className="!my-auto">{title}</Title>} className={full ? "!mx-0" : "!mx-12"}
              extra={extra ? <Link href={extra}>See more</Link> : null}>
            {!full ?
                <div className="w-full overflow-x-scroll bg-white">
                    <div
                        className="flex flex-row gap-2 py-2 px-6 m-auto place-items-center w-fit">
                        <Contents products={products}/>
                    </div>
                </div>
                : <div className="overflow-x-hidden bg-white">
                    <div
                        className="w-full grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-2 py-2 px-2 m-auto place-items-center">
                        <Contents products={products}/>
                    </div>
                </div>
            }
        </Card>
    </Spin>;
};

const Contents = ({ products }) => {
    return Object.keys(products).map((key) => {
        return <div key={key} className={`rounded-lg relative ${width} h-full transition-all`}>
            <Card hoverable cover={<Image src={products[key].images[0]} className="aspect-square object-fit rounded-lg"
                                          preview={false}/>}>
                <p>{products[key].name}</p>
                <p>${products[key].price}</p>
            </Card>
        </div>;
    });
};
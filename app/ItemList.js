"use client";

import { useEffect, useState } from "react";
import { getProducts, searchProducts } from "@/lib/firebase_server";
import { Badge, Card, Divider, Image, Spin, Tag, Typography } from "antd";
import Link from "next/link";
import { numberWithSeps } from "@/lib/utils";

const { Title, Paragraph } = Typography;

const width = "w-36";

export default function ItemList({
    catalog = null,
    search = null,
    limit = 10,
    sort = -1,
    title = "Products",
    full = false,
    extra = "",
    ribbon = true,
}) {
    const [products, setProducts] = useState({});
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!search) {
            getProducts(catalog, limit, sort).then((data) => {
                if (data) {
                    setProducts(data);
                    setLoaded(true);
                }
            });
        } else {
            searchProducts(search, limit).then((data) => {
                if (data) {
                    setProducts(data);
                    setLoaded(true);
                }
            });
        }

    }, [catalog, limit, search, sort]);

    return <Spin spinning={Object.keys(products).length === 0 && !loaded}>
        <Card title={<Title level={3} className="!my-auto">{title}</Title>} className={full ? "!mx-0" : "!mx-12"}
              extra={extra ? <Link href={extra}>See more</Link> : null}>
            {!full ?
                <div className="w-full overflow-x-scroll bg-white">
                    <div
                        className="flex flex-row gap-2 py-2 px-6 m-auto place-items-center w-fit">
                        <Contents products={products} ribbon={ribbon}/>
                    </div>
                </div>
                : <div className="overflow-x-hidden bg-white">
                    <div
                        className="w-full grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-2 py-2 px-2 m-auto place-items-center">
                        <Contents products={products} ribbon={ribbon}/>
                    </div>
                </div>
            }
        </Card>
    </Spin>;
};

const Contents = ({ products, ribbon = true }) => {
    return Object.keys(products).map((key, i) => {
        const inStock = Object.keys(products[key].variants).some(k => products[key].variants[k] > 0);
        return <Link
            href={`/${products[key].catalog}/${products[key].id}-${products[key].name.replaceAll(" ", "-").replaceAll(/[^a-zA-Z0-9-_]/g, "")}`}
            key={key}
            className={`rounded-lg relative ${width} h-full transition-all`}>
            <Badge.Ribbon text="Newest" className={i !== 0 || !ribbon ? "hidden" : ""}>
                <Card hoverable
                      cover={<Spin spinning={!inStock} indicator={<>
                          <div className="text-base w-full h-full flex flex-col justify-center">
                              <p className="text-white w-fit h-fit m-auto aspect-square bg-[#00000070] rounded-full p-3 flex flex-col justify-center">Sold
                                  out!</p>
                          </div>
                      </>} size="small">
                          <Image alt={products[key].name} src={products[key].images[0]}
                                 className="aspect-square object-fit rounded-lg"
                                 preview={false}/></Spin>}
                      classNames={{
                          body: "!p-0 !m-2 !h-[5.5rem]",
                          cover: "border-2 border-gray-100 rounded-t-lg",
                      }}
                >
                    <div className="h-full flex flex-col justify-between">
                        <Paragraph ellipsis={{ rows: 2 }}>{products[key].name}</Paragraph>
                        <Divider className="!m-0 !mt-auto !mb-1"/>
                        <Tag color="blue" className="w-fit">
                            <span className="text-[0.9rem]">${numberWithSeps(products[key].price)}</span>
                        </Tag>
                    </div>
                </Card>
            </Badge.Ribbon>
        </Link>;
    });
};
"use client";

import { Button, Image, List, Popconfirm, Tag } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined, WarningTwoTone } from "@ant-design/icons";
import { numberWithSeps } from "@/lib/utils";

export default function ProductListItem({ product, onEdit = null, onDelete = null }) {

    return <List.Item>
        <div className="flex flex-row justify-between w-full">
            <div className="flex flex-row gap-2">
                <div className="h-fit my-auto">
                    <Image alt={product.name} src={product.images[0]}
                           className="aspect-square object-fit max-h-16 rounded-lg" preview={{
                        mask: <EyeOutlined className="text-xl"/>,
                        maskClassName: "rounded-lg"
                    }}/>
                </div>
                <div>
                    <p>{product.name}</p>
                    <p>${numberWithSeps(product.price)}</p>
                    <Tag className="flex flex-col !h-fit !w-fit !my-auto !p-0" bordered={false}>
                        <div className="flex flex-row border-gray-200 gap-0">
                            {["s", "m", "l", "xl"].map((i) => {
                                return <Tag key={i} className="!h-full !w-full !m-0" bordered={false}
                                            color={product.variants[i] === 0 ? "red" : "default"}
                                >{i.toUpperCase()}: {product.variants[i]}</Tag>;
                            })}
                        </div>
                    </Tag>
                </div>

            </div>
            <div className="flex flex-row gap-2 h-fit my-auto">
                <Button size="small" type="default" onClick={() => {
                    onEdit?.(product);
                }}><EditOutlined/></Button>
                <Popconfirm
                    title="Do you want to delete this product?"
                    description="This action cannot be undone"
                    okType={"danger"}
                    onConfirm={() => onDelete?.(product)}
                    icon={<WarningTwoTone twoToneColor="red"/>}
                >
                    <Button size="small" type="primary" danger><DeleteOutlined/></Button>
                </Popconfirm>
            </div>
        </div>
    </List.Item>;
}
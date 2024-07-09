'use client';

import { Button, List, Image, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { numberWithSeps } from "@/lib/utils";

export default function ProductListItem({ product, onEdit = null, onDelete = null }) {

    return <List.Item>
        <div className="flex flex-row justify-between w-full">
            <div className="flex flex-row gap-2">
                <Image src={product.images[0]} width={45} height={45}/>
                <div>
                    <p>{product.name}</p>
                    <p>{numberWithSeps(product.price)}$</p>
                </div>
                <Tag className="flex flex-col !h-fit !w-fit !my-auto !p-0" bordered={false}>
                    <div className="flex flex-row border-gray-200 gap-0">
                        {["s", "m", "l", "xl"].map((i) => {
                            return <Tag key={i} className="!h-full !w-full" bordered={false} color={product.variants[i] === 0 ? "red" : "default"}
                            >{i.toUpperCase()}: {product.variants[i]}</Tag>;
                        })}
                    </div>
                </Tag>
            </div>
            <div className="flex flex-row gap-2 h-fit my-auto">
                <Button size="small" type="default" onClick={() => {
                    if (onEdit) {
                        onEdit(product);
                    }
                }}><EditOutlined/></Button>
                <Button size="small" type="primary" danger onClick={() => {
                    if (onDelete) {
                        onDelete(product);
                    }
                }}><DeleteOutlined/></Button>
            </div>
        </div>
    </List.Item>;
}
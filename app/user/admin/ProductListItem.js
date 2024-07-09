'use client';

import { Button, List, Image } from "antd";
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
            </div>
            <div className="flex flex-row gap-2">
                <Button size="small" type="default" onClick={() => {
                    if (onEdit) {
                        onEdit(product);
                    }
                }}><EditOutlined /></Button>
                <Button size="small" type="primary" danger onClick={() => {
                    if (onDelete) {
                        onDelete(product);
                    }
                }}><DeleteOutlined /></Button>
            </div>
        </div>
    </List.Item>;
}
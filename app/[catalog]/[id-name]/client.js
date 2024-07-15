"use client";


import { useEffect, useState } from "react";
import { getProduct } from "@/lib/firebase_server";
import { Button, Carousel, Descriptions, Image, InputNumber, Radio, Typography } from "antd";
import { getCart, setCart, useUser } from "@/lib/firebase";
import { numberWithSeps, useMessage } from "@/lib/utils";
import { CreditCardOutlined, ShoppingCartOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const options = [
    { label: "S", value: "s" },
    { label: "M", value: "m" },
    { label: "L", value: "l" },
    { label: "XL", value: "xl" },
];

export default function Product({ params }) {
    const { error, success, contextHolder } = useMessage();
    const catalog = params["catalog"];
    const user = useUser();
    const [id] = params["id-name"].split("-", 2);
    const [product, setProduct] = useState({});
    const [option, setOption] = useState("s");
    const [amount, setAmount] = useState(1);

    useEffect(() => {
        getProduct(id, catalog).then(result => {
            setProduct(result);
            window.history.replaceState({}, "", `/${catalog}/${id}-${result.name.replaceAll(" ", "-").replaceAll(/[^a-zA-Z0-9-_]/g, "")}`);
        });
    }, [catalog, id]);

    const onChange = ({ target: { value } }) => {
        setOption(value);
    };

    return Object.keys(product).length ? (
        <div className="bg-white m-8 rounded-lg flex flex-row">
            {contextHolder}
            <div className="p-3 w-[38%]">
                <Carousel autoplay arrows className="!overflow-hidden !rounded-lg">
                    {product.images.map((image, i) => {
                        return <div key={i}>
                            <Image alt={product.name} className="rounded-lg" src={image} preview={{
                                mask: "",
                                maskClassName: "rounded-lg !bg-transparent"
                            }}></Image>
                        </div>;
                    })}
                </Carousel>
            </div>
            <div className="px-8 py-2 my-6 w-full">
                <Title>{product.name}</Title>
                <Title level={3} className="!my-1">${numberWithSeps(product.price)}</Title>
                <div className="flex flex-row gap-2 my-2">
                    <p className="h-fit my-auto">Size: </p>
                    <Radio.Group buttonStyle="solid" options={options} onChange={onChange} value={option}
                                 optionType="button"/>

                </div>
                <p className="h-fit my-auto">{product.variants[option]} left</p>
                <div className="flex flex-row gap-2">
                    <p className="h-fit my-auto">Amount: </p>
                    <InputNumber className="!my-3" min={1} max={product.variants[option]}
                                 defaultValue={amount} onChange={setAmount}></InputNumber>
                </div>
                <div className="grid grid-cols-3">
                    <div className="grid grid-cols-2 gap-3 my-3 w-full col-span-2">
                        <Button disabled={product.variants[option] === 0 || !(product.variants[option] >= amount)}
                                size="large" type="primary">
                            <CreditCardOutlined/> Buy now
                        </Button>
                        <Button disabled={product.variants[option] === 0 || !(product.variants[option] >= amount)}
                                size="large" ghost type="primary" onClick={() => {
                            const cart = getCart(user);
                            if (cart.some(item => item.id === product.id)) {
                                error("Item already in cart");
                                return;
                            }
                            setCart(user, [
                                ...cart,
                                {
                                    id: product.id,
                                    catalog: product.catalog,
                                    variant: option,
                                    amount: amount,
                                }
                            ]).then(result => {
                                if (result.status === "success") {
                                    success("Added to cart");
                                } else {
                                    error("An error occurred " + result.message);
                                }
                            });
                        }}>
                            <ShoppingCartOutlined/> Add to cart
                        </Button>
                    </div>
                </div>

                <Descriptions title="Product details" column={1} className="!my-3">
                    <Text>{product.description}</Text>
                </Descriptions>
            </div>
        </div>
    ) : null;
}
"use client";

import { Divider, Typography } from "antd";

const { Title } = Typography;

export default function Cart() {
    return <div>
        <Divider orientation="left" className="!my-0" orientationMargin="0">
            <Title level={3}>Your cart</Title>
        </Divider>
    </div>;
};
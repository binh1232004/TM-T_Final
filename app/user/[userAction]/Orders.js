"use client";

import { Divider, Typography } from "antd";

const { Title } = Typography;

export default function Orders() {
    return <div>
        <Divider orientation="left" className="!my-0" orientationMargin="0">
            <Title level={3}>Your orders</Title>
        </Divider>
    </div>;
};
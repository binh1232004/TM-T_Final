"use client";

import { Divider, Spin, Typography } from "antd";
import UserForm from "@/app/user/admin/UserForm";
import { useUser } from "@/lib/firebase";

const { Title } = Typography;

export default function UserInfo() {
    const user = useUser();

    return <div>
        <Divider orientation="left" className="!my-0" orientationMargin="0">
            <Title level={3}>Profile setting</Title>
        </Divider>
        <Spin spinning={user === undefined} size="large">
            <div className="px-36">
                {user ? <UserForm user={user} modal={false}/> : null}
            </div>
        </Spin>
    </div>;
}
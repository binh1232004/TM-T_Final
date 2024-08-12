"use client";

import { Button, Divider, Popconfirm, Tooltip, Typography } from "antd";
import { deleteUser, useUser } from "@/lib/firebase";
import { useMessage } from "@/lib/utils";
import { WarningTwoTone } from "@ant-design/icons";

const { Title } = Typography;

export default function Privacy() {
    const { error, success, contextHolder } = useMessage();
    const user = useUser();

    return <div>
        <Divider orientation="left" className="!my-0" orientationMargin="0">
            <Title level={3}>Privacy settings</Title>
        </Divider>
        {contextHolder}
        <div className="flex flex-row justify-between">
            <p>Request account deletion</p>
            <Tooltip title={user?.deleted ? "This account has been marked for deletion" : ""}>
                <Popconfirm
                    title="Do you want to delete this account?"
                    description="This action cannot be undone"
                    okType={"danger"}
                    onConfirm={() => {
                        deleteUser().then((result) => {
                            if (result.status === "success") success("Deletion request sent");
                            else error(result.message);
                        });
                    }}
                    icon={<WarningTwoTone twoToneColor="red"/>}
                >
                    <Button type="primary" danger disabled={user?.deleted}>Request deletion</Button>
                </Popconfirm>
            </Tooltip>
        </div>
    </div>;
}
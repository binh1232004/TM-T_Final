"use client";

import { Button, Divider, Tooltip, Typography } from "antd";
import { deleteUser, useUser } from "@/lib/firebase";
import { useMessage } from "@/lib/utils";

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
                <Button type="primary" danger disabled={user?.deleted} onClick={() => {
                    deleteUser().then((result) => {
                        if (result.status === "success") {
                            success("Deletion request sent");
                        } else {
                            error(result.message);
                        }
                    });
                }}>Request deletion</Button>
            </Tooltip>
        </div>
    </div>;
}
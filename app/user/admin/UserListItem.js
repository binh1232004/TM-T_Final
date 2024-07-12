"use client";

import { Button, List, Typography } from "antd";
import { CrownTwoTone, DeleteOutlined, EditOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function UserListItem({ user, onEdit = null, onDelete = null }) {

    const deleted = user.deleted || user?.will_delete;

    return <List.Item>
        <div className="flex flex-row justify-between w-full">
            <div className="flex flex-row gap-2">
                <div className="flex flex-col">
                    {deleted ? <Text type="danger" delete>{user.info.name}</Text> : <p>
                        {user.info.name} {user.admin ? <CrownTwoTone/> : null}
                    </p>}
                    {deleted ? <Text type="danger" delete>{user?.info?.email}</Text> : <p>{user.info.email}</p>}
                </div>
            </div>
            <div className="flex flex-row gap-2 h-fit my-auto">
                {deleted ? <Button size="small" type="primary" danger onClick={() => {
                    // TODO: find a way to delete user data
                }}>Delete data</Button> : null}
                <Button size="small" disabled={deleted} type="default" onClick={() => {
                    if (onEdit) {
                        onEdit(user);
                    }
                }}><EditOutlined/></Button>
                <Button size="small" type="primary" danger disabled={deleted} onClick={() => {
                    if (onDelete) {
                        onDelete(user);
                    }
                }}><DeleteOutlined/></Button>
            </div>
        </div>
    </List.Item>;
}
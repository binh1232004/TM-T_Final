"use client";

import { Button, List, Popconfirm, Tooltip, Typography } from "antd";
import {
    ContainerOutlined,
    CrownTwoTone,
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    WarningTwoTone
} from "@ant-design/icons";
import { downloadObjectAsJson } from "@/lib/utils";

const { Text } = Typography;

export default function UserListItem({ user, onEdit = null, onDelete = null, onOrder = null }) {

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
                {!deleted ? <>
                    <Tooltip title="Download user data">
                        <Button size="small" disabled={deleted} type="default" onClick={() => {
                            downloadObjectAsJson(user, "user-" + user.info.email);
                        }}><DownloadOutlined/></Button>
                    </Tooltip>
                    <Tooltip title="User's orders">
                        <Button size="small" disabled={deleted} type="default" onClick={() => {
                            onOrder?.(user);
                        }}><ContainerOutlined/></Button>
                    </Tooltip>
                    <Tooltip title="Edit user data">
                        <Button size="small" disabled={deleted} type="default" onClick={() => {
                            onEdit?.(user);
                        }}><EditOutlined/></Button>
                    </Tooltip>
                    <Tooltip title="Delete this user">
                        <Popconfirm
                            title="Do you want to delete this user?"
                            description="This action cannot be undone"
                            okType={"danger"}
                            onConfirm={() => onDelete?.(user)}
                            icon={<WarningTwoTone twoToneColor="red"/>}
                        >
                            <Button size="small" type="primary" danger disabled={deleted}><DeleteOutlined/></Button>
                        </Popconfirm>
                    </Tooltip>
                </> : null}
            </div>
        </div>
    </List.Item>;
}
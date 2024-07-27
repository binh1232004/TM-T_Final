"use client";

import { useEffect, useState } from "react";
import { deleteUser, getUsers } from "@/lib/firebase";
import { Button, List, Popover, Spin, Typography } from "antd";
import UserListItem from "@/app/user/admin/UserListItem";
import UserForm from "@/app/user/admin/UserForm";
import { downloadObjectAsCsv, downloadObjectAsJson, useMessage } from "@/lib/utils";
import { DownOutlined } from "@ant-design/icons";

const { Title } = Typography;

export default function UserList() {
    const { error, success, contextHolder } = useMessage();
    const [users, setUsers] = useState({});
    const [currentUser, setCurrentUser] = useState({});
    const [reload, setReload] = useState(false);
    const [userModal, setUserModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUsers().then((data) => {
            if (data.status === "success") {
                setUsers(data.data);
                setLoading(false);
            } else {
                error(data.message);
            }
        });
    }, [reload]);

    const onDelete = (user) => {
        return deleteUser(user.uid).then((result) => {
            if (result.status === "success") {
                setReload(!reload);
                success("User deleted");
            }
        });
    };

    const onEdit = (user) => {
        setUserModal(true);
        setCurrentUser(user);
    };

    return <div>
        <Spin spinning={loading} size="large">
            {contextHolder}
            <Title level={3}>Edit users</Title>
            <UserForm user={currentUser} open={userModal} onClose={() => setUserModal(false)}
                      onComplete={() => setReload(!reload)}></UserForm>
            <List
                size="small"
                bordered
                dataSource={Object.keys(users).map((key) => {
                    return { uid: key, ...users[key] };
                })}
                pagination={{ position: "bottom", align: "center" }}
                renderItem={(item) => {
                    return <UserListItem user={item} onDelete={onDelete} onEdit={onEdit}></UserListItem>;
                }}
            />
            <div className="w-full flex flex-row justify-end">
                <Popover placement="bottomRight" content={
                    <div className="flex flex-col justify-center">
                        <Button className="my-2" type="primary" onClick={() => {
                            downloadObjectAsJson(users, "users");
                        }}>
                            Export JSON data
                        </Button>
                        <Button className="my-2" type="primary" onClick={() => {
                            downloadObjectAsCsv(Object.keys(users).map((key) => {
                                return {
                                    uid: key,
                                    email: users[key].info.email,
                                };
                            }), "users");
                        }}>
                            Export CSV data
                        </Button>
                    </div>
                }>
                    <Button className="my-2" iconPosition="end" icon={<DownOutlined/>} onClick={() => {
                        // downloadObjectAsJson(users, "users");
                    }}>
                        Export data
                    </Button>
                </Popover>
            </div>
        </Spin>
    </div>;
}
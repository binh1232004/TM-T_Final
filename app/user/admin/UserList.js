"use client";

import { useEffect, useState } from "react";
import { deleteUser, getUsers } from "@/lib/firebase";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { List, Modal } from "antd";
import UserListItem from "@/app/user/admin/UserListItem";
import UserForm from "@/app/user/admin/UserForm";

const { confirm } = Modal;

export default function UserList() {
    const [users, setUsers] = useState({});
    const [currentUser, setCurrentUser] = useState({});
    const [reload, setReload] = useState(false);
    const [userModal, setUserModal] = useState(false);

    useEffect(() => {
        getUsers().then((data) => {
            if (data.status === "success") setUsers(data.data);
        });
    }, [reload]);

    const onDelete = (user) => {
        confirm({
            title: "Do you want to delete this user?",
            icon: <ExclamationCircleFilled/>,
            content: "This action cannot be undone",
            okType: "danger",
            maskClosable: true,
            onOk() {
                return deleteUser(user.uid).then((result) => {
                    if (result.status === "success") {
                        setReload(!reload);
                    }
                });
            },
            onCancel() {
            },
        });
    };

    const onEdit = (user) => {
        setUserModal(true);
        setCurrentUser(user);
    };

    return <div>
        <UserForm user={currentUser} open={userModal} onClose={() => setUserModal(false)} onComplete={() => setReload(!reload)}></UserForm>
        <List
            size="small"
            bordered
            dataSource={Object.keys(users).map((key) => {
                return {uid: key, ...users[key]}
            })}
            pagination={{ position: "bottom", align: "center" }}
            renderItem={(item) => {
                return <UserListItem user={item} onDelete={onDelete} onEdit={onEdit}></UserListItem>;
            }}
        />
    </div>;
}
"use client";

import { LoginForm } from "@/app/LoginForm";
import { getUser, logout } from "@/lib/firebase";
import { useEffect, useState } from "react";

export default function LoginTest() {
    const [user, setUser] = useState(null);
    const [modal, setModal] = useState(false);

    useEffect(() => {
        getUser((user) => {
            setUser(user);
            console.log("getUser", user);
        });
    }, []);

    return <div>
        <p>User: {user?.displayName}</p>
        <p>Email: {user?.email}</p>
        <button onClick={() => {
            setModal(true);
        }}>Click</button>
        <button onClick={() => {
            logout().then(() => {
                setUser(null);
            });
        }}>Logout</button>
        {modal && <LoginForm onClose={() => {
            setModal(false);
        }}></LoginForm>}
    </div>;
}

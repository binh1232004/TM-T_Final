"use client";

import { LoginForm } from "@/app/LoginForm";
import { getUser } from "@/lib/firebase";
import { useEffect, useState } from "react";

export default function LoginTest() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        getUser((user) => {
            setUser(user);
        });
    }, []);

    return <div>
        <p>User: {user?.email}</p>
        <LoginForm x="100px" y="100px"></LoginForm>
    </div>;
}

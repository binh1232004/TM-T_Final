"use client";

import { useEffect } from "react";
import { getCart, setCart, useUser } from "@/lib/firebase";

export default function ProductTest() {
    const user = useUser();

    useEffect(() => {
        if (user) {
            console.log(user);
            setCart(user, [
                    { id: "abc", variant: "s", quantity: 1 },
                    { id: "abde", variant: "s", quantity: 1 },
                    { id: "abc", variant: "s", quantity: 1 },
                    { id: "abc", variant: "s", quantity: 1 }
            ]).then(() => {
                console.log(getCart(user));
            });
        }
    }, [user]);

    return <div>
        <p>ProductTest</p>
    </div>;
};
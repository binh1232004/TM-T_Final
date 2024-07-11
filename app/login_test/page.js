"use client";

// Note: This is a test page for the login feature

import { LoginForm } from "@/app/LoginForm";
import { logout, useUser } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { getCatalogs, getProduct, getProducts, searchProducts } from "@/lib/firebase_server";

export default function LoginTest() {
    const user = useUser();
    const [modal, setModal] = useState(false);
    const [catalogs, setCatalogs] = useState(null);
    const [products, setProducts] = useState(null);

    useEffect(() => {
        getCatalogs().then((data) => {
            setCatalogs(data);
        });
        getProducts("1", 10).then((data) => {
            setProducts(data);
            getProduct(Object.keys(data)[0], "1").then((data) => {
                console.log("getProduct2", data);
            });
            searchProducts("1", -1).then((data) => {
                console.log("searchProducts", data);
            });
            console.log("getProducts", data);
        });
    }, []);

    useEffect(() => {
        console.log("user", user);
    }, [user]);

    return (user !== undefined) && <div>
        <p>{Object.keys(user || {}).join(' ')}</p>
        <p>Name: {user?.displayName}</p>
        <p>Email: {user?.email}</p>
        <p>{Object.keys(catalogs || {}).join(' ')}</p>
        <p>{Object.keys(products || {}).join(' ')} {Object.keys(products || {}).length}</p>
        <button onClick={() => {
            setModal(true);
        }}>Click</button>
        <button onClick={() => {
            logout().then(() => {});
        }}>Logout</button>
        <LoginForm open={modal} onClose={() => {setModal(false);}}></LoginForm>
    </div>;
}

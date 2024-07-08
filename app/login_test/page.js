"use client";

// Note: This is a test page for the login feature

import { LoginForm } from "@/app/LoginForm";
import { getCatalogs, getProduct, getProducts, getUser, logout, searchProducts } from "@/lib/firebase";
import { useEffect, useState } from "react";

export default function LoginTest() {
    const [user, setUser] = useState(null);
    const [modal, setModal] = useState(false);
    const [catalogs, setCatalogs] = useState(null);
    const [products, setProducts] = useState(null);

    useEffect(() => {
        getUser((user) => {
            setUser(user);
            console.log("getUser", user);
        });
        getCatalogs().then((data) => {
            setCatalogs(data);
        });
        getProducts("1", 10).then((data) => {
            setProducts(data);
            getProduct("1", Object.keys(data)[0]).then((data) => {
                console.log("getProduct", data);
            });
            searchProducts("1", -1).then((data) => {
                console.log("searchProducts", data);
            });
            console.log("getProducts", data);
        });
    }, []);

    return <div>
        <p>{Object.keys(user || {}).join(' ')}</p>
        <p>Name: {user?.displayName}</p>
        <p>Email: {user?.email}</p>
        <p>{Object.keys(catalogs || {}).join(' ')}</p>
        <p>{Object.keys(products || {}).join(' ')} {Object.keys(products || {}).length}</p>
        <button onClick={() => {
            setModal(true);
        }}>Click</button>
        <button onClick={() => {
            logout().then(() => {
                setUser(null);
            });
        }}>Logout</button>
        <LoginForm open={modal} onClose={() => {setModal(false);}}></LoginForm>
    </div>;
}

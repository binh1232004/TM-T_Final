"use client";


import { useEffect, useState } from "react";
import ItemList from "@/app/ItemList";

export default function Search() {
    const [search, setSearch] = useState("");

    useEffect(() => {
        const url = new URL(window.location.href);
        setSearch(url.searchParams.get("q"));
    }, []);

    return search ? <div className="m-8">
        <ItemList full search={search} title="Search" limit={50} ribbon={false}></ItemList>
    </div> : null;
}
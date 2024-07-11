"use client";

import ItemList from "@/app/ItemList";
import { getCatalogs } from "@/lib/firebase_server";
import { useEffect, useState } from "react";

export default function Home() {
    const [catalogs, setCatalogs] = useState({});

    useEffect(() => {
        getCatalogs().then((data) => {
            setCatalogs(data);
        });
    }, []);

    return (
        <div>
            {Object.keys(catalogs).map((key) => {
                return <div key={key} className="my-2">
                    <ItemList key={key} catalog={key} extra={`/${catalogs[key].name.toLowerCase()}`}
                              title={catalogs[key].name}></ItemList>;
                </div>;
            })}
        </div>
    );
}

"use client";

import ItemList from "@/app/ItemList";
import { getCatalogs } from "@/lib/firebase_server";
import { useEffect, useState } from "react";
import { Carousel } from "antd";

const contentStyle = {
    height: "30rem",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
};

export default function Home() {
    const [catalogs, setCatalogs] = useState({});

    useEffect(() => {
        getCatalogs().then((data) => {
            setCatalogs(data);
        });
    }, []);

    return (
        <div>
            <Carousel autoplay>
                <div>
                    <h3 style={contentStyle}>1</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>2</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>3</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>4</h3>
                </div>
            </Carousel>
            {Object.keys(catalogs).map((key) => {
                return <div key={key} className="my-2">
                    <ItemList key={key} catalog={key} extra={`/${catalogs[key].name.toLowerCase()}`}
                              title={catalogs[key].name}></ItemList>;
                </div>;
            })}
        </div>
    );
}

"use client";

import ItemList from "@/app/ItemList";
import { getCatalogs } from "@/lib/firebase_server";
import { useEffect, useState } from "react";
import { Carousel, Image } from "antd";
import { getBanners } from "@/lib/firebase";
import Link from "next/link";

export default function Home() {
    const [catalogs, setCatalogs] = useState({});
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        getCatalogs().then((data) => {
            setCatalogs(data);
        });
        getBanners().then((data) => {
            if (data.status === "success") {
                setBanners(data.data);
            }
        });
    }, []);

    return (
        <div>
            <Carousel autoplay adaptiveHeight className="min-h-6" arrows>
                {banners.map((banner, i) => {
                    return <Link href={banner.link} key={i} className="!my-auto w-full !flex flex-row justify-center">
                        <Image alt="Banner image" src={banner.image} className="w-full !mx-auto"
                               preview={false}></Image>
                    </Link>;
                })}
            </Carousel>
            {Object.keys(catalogs).map((key) => {
                return <div key={key} className="my-2">
                    <ItemList key={key} catalog={catalogs[key].name.toLowerCase()}
                              extra={`/${catalogs[key].name.toLowerCase()}`}
                              title={catalogs[key].name}></ItemList>;
                </div>;
            })}
        </div>
    );
}

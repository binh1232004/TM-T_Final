"use server";

import Product from "@/app/products/[catalog]/[id-name]/client";
import { getProduct } from "@/lib/firebase_server";

export default async function Page({ params, query }) {
    return <Product params={params} query={query}/>;
}

export async function generateMetadata({ params }) {
    const [id] = params["id-name"].split("-", 2);
    const catalog = params["catalog"];

    const product = await getProduct(id, catalog);

    if (product) {
        return {
            title: product.name,
            description: product.description,
            openGraph: {
                type: "website",
                title: product.name,
                description: product.description,
                images: product.images.map(image => {
                    return {
                        url: image,
                        width: 800,
                        height: 600,
                        alt: product.name,
                    };
                }),
            },
        };
    } else {
        return {};
    }

}
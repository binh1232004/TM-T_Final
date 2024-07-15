"use server";

import Product from "@/app/products/[catalog]/[id-name]/client";
import { getProduct } from "@/lib/firebase_server";
import { notFound } from "next/navigation";

// TODO: cache product

export default async function Page({ params, query }) {
    const [id] = params["id-name"].split("-", 2);
    const catalog = params["catalog"];

    const product = await getProduct(id, catalog);

    if (!product) {
        notFound();
    }

    return <Product params={params} query={query}/>;
}

export async function generateMetadata({ params }) {
    const [id] = params["id-name"].split("-", 2);
    const catalog = params["catalog"];

    const public_url = process.env.VERCEL_URL || "";

    const product = await getProduct(id, catalog);

    if (product) {
        return {
            title: product.name,
            description: product.description,
            openGraph: {
                type: "website",
                title: product.name,
                url: `${public_url}/products/${catalog}/${id}-${product.name.replaceAll(" ", "-").replaceAll(/[^a-zA-Z0-9-_]/g, "")}`,
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
"use server";

import Product from "@/app/[catalog]/[id-name]/client";
import { getProduct } from "@/lib/firebase_server";
import { notFound } from "next/navigation";

const public_url = process.env.VERCEL_URL || "";

// TODO: cache product

export default async function Page({ params, query }) {
    const [id] = params["id-name"].split("-", 2);
    const catalog = params["catalog"];

    const product = await getProduct(id, catalog);

    if (!product) {
        notFound();
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: product.images,
        offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: `${public_url}/${catalog}/${id}-${product.name.replaceAll(" ", "-").replaceAll(/[^a-zA-Z0-9-_]/g, "")}`,
        },
    };

    return <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}/>
        <Product params={params} query={query}/>
    </>;
}

export async function generateMetadata({ params }) {
    const [id] = params["id-name"].split("-", 2);
    const catalog = params["catalog"];

    const product = await getProduct(id, catalog);

    if (product) {
        return {
            title: product.name,
            description: product.description?.slice(0, 160) || "",
            openGraph: {
                type: "website",
                title: product.name,
                url: `${public_url}/${catalog}/${id}-${product.name.replaceAll(" ", "-").replaceAll(/[^a-zA-Z0-9-_]/g, "")}`,
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
import { getProducts, getCatalogs } from "@/lib/firebase_server"
import { unstable_noStore as noStore } from "next/cache";
export const fetchCache = 'force-no-store';
export default async function sitemap() {
    noStore();
    let products = [];
    let catalogs = await getCatalogs();
    console.log('catalogs',catalogs)
    products = Object.keys(catalogs).map(async (key) => {
        return Object.values(await getProducts(key))
    });  
    const data = await Promise.all(products);
    // console.log('data',data)    
    const arrShirts = data[0];
    const arrPants = data[1];
    const arrAccessories = data[2];
    arrShirts.map((shirt) => {
        shirt.catalog = catalogs[shirt.catalog].name;
    });
    arrPants.map((pant) => {
        pant.catalog = catalogs[pant.catalog].name;
    });
    arrAccessories.map((accessory) => {
        accessory.catalog = catalogs[accessory.catalog].name;
    });
    const arrDetailProduct = [...arrShirts, ...arrPants, ...arrAccessories];
    const siteMapDetailProduct = arrDetailProduct.map((product) => {
        return {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/${product.catalog}/${product.id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9
        }
    });
    return [
        ...siteMapDetailProduct,
        {
            url: process.env.NEXT_PUBLIC_BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/admin`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.7
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/payment`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.7
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/info`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.7
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/cart`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.7
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/orders`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.7
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.7
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/shirts`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/pants`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/accessories`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1
        }

    ]
}
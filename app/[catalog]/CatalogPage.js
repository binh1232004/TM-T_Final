"use client";

import ItemList from "@/app/ItemList";
import { capitalizeFirstLetter } from "@/lib/utils";

export default function CatalogPage({ catalog }) {
    return <div className="m-8">
        <ItemList full catalog={catalog.toLowerCase()} title={capitalizeFirstLetter(catalog)} limit={50}></ItemList>
    </div>;
}
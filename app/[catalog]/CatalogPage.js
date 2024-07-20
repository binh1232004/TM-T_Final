"use client";

import ItemList from "@/app/ItemList";
import { capitalizeFirstLetter } from "@/lib/utils";

const catalogMap = {
    shirts: "1",
    pants: "2",
    accessories: "3",
};

export default function CatalogPage({ catalog }) {
    return <div className="m-8">
        <ItemList full catalog={catalogMap[catalog]} title={capitalizeFirstLetter(catalog)} limit={50}></ItemList>
    </div>;
}
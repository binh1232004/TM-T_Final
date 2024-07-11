"use client";

import ItemList from "@/app/ItemList";

const catalogMap = {
    shirts: "1",
    pants: "2",
    accessories: "3",
};

export default function CatalogPage({ catalog }) {
    return <div>
        <ItemList full catalog={catalogMap[catalog]} title={catalog} limit={50}></ItemList>
    </div>;
}
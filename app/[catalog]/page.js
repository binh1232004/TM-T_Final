"use server";

import { redirect } from "next/navigation";
import CatalogPage from "@/app/[catalog]/CatalogPage";
import { getCatalogs } from "@/lib/firebase_server";

export default async function Catalog({ params }) {
    const catalogs = await getCatalogs();
    const allowed = Object.keys(catalogs).map((key) => catalogs[key].name.toLowerCase());

    if (allowed.includes(params.catalog)) {
        return <div>
            <CatalogPage catalog={params.catalog}/>
        </div>;
    } else {
        redirect("/");
    }
}
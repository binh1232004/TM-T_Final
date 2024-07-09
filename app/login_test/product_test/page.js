import { getCatalogs } from "@/lib/firebase_server";

export default async function ProductTest() {
    return <div>
        <p>ProductTest</p>
        <p>{Object.keys(await getCatalogs() || {}).join(' ')}</p>
    </div>;
};
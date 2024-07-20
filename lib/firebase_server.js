'use server';

import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/lib/firebase_config";
import { get, getDatabase, ref } from "firebase/database";

export const getCatalogs = () => {
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const dbRef = ref(database, "/products/catalogs");

    return get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            return Object.fromEntries(snapshot.val().map((item, i) => [i, item]).filter((item) => item?.[0]));
        } else {
            return null;
        }
    });
};

// TODO: optimize to fetch only the first limit items
export const getProducts = (catalog, limit = 10, sort = -1) => {
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const dbRef = ref(database, `/products/items/${catalog}`);

    if (sort !== 1 && sort !== -1) sort = -1;
    const sortFunc = (a, b) => {
        if (sort === 1) return a.localeCompare(b);
        else return b.localeCompare(a);
    }

    return get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            if (limit === null || limit < 0) return snapshot.val();
            else {
                let data = snapshot.val();
                let keys = Object.keys(data).sort(sortFunc);
                let result = {};
                for (let i = 0; i < limit && i < keys.length; i++) {
                    result[keys[i]] = data[keys[i]];
                }
                return result;
            }
        } else {
            return null;
        }
    });
}

export const getProduct = (id, catalog = null) => {
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);

    if (catalog === null) {
        throw new Error("Not implemented yet");
    }

    const dbRef = ref(database, `/products/items/${catalog}/${id}`);
    return get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            return null;
        }
    });
}

// TODO: optimize to search only the first limit items
// WARNING: this function is very slow
export const searchProducts = (query, limit = 10) => {
    return getCatalogs().then((catalogs) => {
        let result = {};
        Object.keys(catalogs).forEach((catalog) => {
            getProducts(catalog, -1).then((products) => {
                Object.keys(products).forEach((id) => {
                    if (products[id].name.includes(query)) {
                        result[id] = products[id];
                    }
                });
            });
        });
        return result;
    }).then((result) => {
        if (limit === null || limit < 0) return result;

        let keys = Object.keys(result);
        let data = {};
        for (let i = 0; i < limit && i < keys.length; i++) {
            data[keys[i]] = result[keys[i]];
        }
        return data;
    });
}
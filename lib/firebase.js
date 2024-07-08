"use client";

import { initializeApp } from "firebase/app";
import { child, get, getDatabase, ref, set, update } from "firebase/database";
import {
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from "firebase/auth";
import { firebaseConfig } from "@/lib/firebase_config";

export const createUser = (user, pass, optionalInfo = null, forceReload = true) => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    return createUserWithEmailAndPassword(auth, user, pass)
        .then((userCredential) => {
            const user = userCredential.user;
            if (optionalInfo) {
                return updateProfile(user, { displayName: optionalInfo.displayName }).then(() => {
                    return {
                        status: "success",
                        user: user
                    };
                }).catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    return {
                        status: "error",
                        code: errorCode,
                        message: errorMessage
                    };
                });
            }
            return {
                status: "success",
                user: user
            };
        }).then(status => {
            if (status.status === "success") {
                const database = getDatabase(app);
                const dbRef = ref(database);

                let value;
                if (optionalInfo) {
                    value = {
                        email: status.user.email,
                        name: optionalInfo.displayName,
                        phone: optionalInfo.phoneNumber,
                        gender: optionalInfo.gender,
                        birthday: optionalInfo.birthday
                    };
                } else {
                    value = {
                        email: status.user.email
                    };
                }
                return set(child(dbRef, `/users/${status.user.uid}/info`), value).then(() => {
                    return set(child(dbRef, `/users/${status.user.uid}/data`), {}).then(() => {
                        if (forceReload && typeof window !== "undefined") {
                            // TODO: find a way to avoid this because the onAuthStateChanged trigger before the set function complete
                            window.location.reload();
                        }
                        return {
                            status: "success",
                            user: status.user
                        };
                    });
                }).catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    return {
                        status: "error",
                        code: errorCode,
                        message: errorMessage
                    };
                });
            } else {
                return status;
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            return {
                status: "error",
                code: errorCode,
                message: errorMessage
            };
        });
};

export const login = (user, pass) => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    return signInWithEmailAndPassword(auth, user, pass)
        .then((userCredential) => {
            const user = userCredential.user;
            return {
                status: "success",
                user: user
            };
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            return {
                status: "error",
                code: errorCode,
                message: errorMessage
            };
        });
};

export const logout = () => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    return signOut(auth).then(() => {
        return {
            status: "success"
        };
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        return {
            status: "error",
            code: errorCode,
            message: errorMessage
        };
    });
};

export const getUser = (callback) => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const database = getDatabase(app);
    const dbRef = ref(database);

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const getInfo = async () => {
                const info = await get(child(dbRef, `/users/${user.uid}/info`));
                const data = await get(child(dbRef, `/users/${user.uid}/data`));
                const admin = await get(child(dbRef, `/users/${user.uid}/admin`));

                return {
                    info: info.val() || {},
                    data: data.val() || {},
                    admin: admin.val() || false,
                    ...user
                };
            };

            getInfo().then((result) => {
                callback(result);
            }).catch((error) => {
                console.log(error);
                callback(null);
            });
        } else {
            callback(null);
        }
    });
};

export const updateUserInfo = (uid, info) => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const database = getDatabase(app);
    const dbRef = ref(database);

    const updates = {};
    Object.keys(info).forEach((key) => {
        updates[`/users/${uid}/info/${key}`] = info[key];
    });

    return update(dbRef, updates).then(() => {
        if ((info?.displayName || info?.name) && auth.currentUser?.uid === uid) {
            return updateProfile(auth.currentUser, { displayName: info?.displayName || info.name }).then(() => {
                return {
                    status: "success"
                };
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                return {
                    status: "error",
                    code: errorCode,
                    message: errorMessage
                };
            });
        }
        return {
            status: "success"
        };
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        return {
            status: "error",
            code: errorCode,
            message: errorMessage
        };
    });
};

export const updateUserData = (uid, data) => {
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const dbRef = ref(database);

    const updates = {};
    Object.keys(data).forEach((key) => {
        updates[`/users/${uid}/data/${key}`] = data[key];
    });

    return update(dbRef, updates).then(() => {
        return {
            status: "success"
        };
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        return {
            status: "error",
            code: errorCode,
            message: errorMessage
        };
    });
};

export const getCatalogs = () => {
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const dbRef = ref(database, "/products/catalogs");

    return get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            return null;
        }
    }).catch((error) => {
        console.error(error);
        return null;
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
    }).catch((error) => {
        console.error(error);
        return null;
    });
}

export const getProduct = (catalog, id) => {
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const dbRef = ref(database, `/products/items/${catalog}/${id}`);

    return get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            return null;
        }
    }).catch((error) => {
        console.error(error);
        return null;
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
    }).catch(e => {
        console.error(e);
        return null;
    });
}
"use client";

import { initializeApp } from "firebase/app";
import { child, get, getDatabase, ref, set, update } from "firebase/database";
import { getDownloadURL, getStorage, ref as refStorage, uploadBytes } from "firebase/storage";
import {
    createUserWithEmailAndPassword,
    deleteUser as _deleteUser,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from "firebase/auth";
import { firebaseConfig } from "@/lib/firebase_config";
import { useEffect, useState } from "react";
import { makeId } from "@/lib/utils";

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
                    return {
                        status: "error",
                        code: error.code,
                        message: error.message
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
                    return {
                        status: "error",
                        code: error.code,
                        message: error.message
                    };
                });
            } else {
                return status;
            }
        })
        .catch((error) => {
            return {
                status: "error",
                code: error.code,
                message: error.message
            };
        });
};

export const login = (user, pass) => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const database = getDatabase(app);

    return signInWithEmailAndPassword(auth, user, pass)
        .then((userCredential) => {
            const user = userCredential.user;

            return get(ref(database, `/users/${user.uid}/deleted`)).then((snapshot) => {
                if (snapshot.exists() && snapshot.val()) {
                    return _deleteUser(user).then(() => {
                        return {
                            status: "error",
                            code: "auth/user-not-found",
                            message: "User not found"
                        };
                    }).catch((error) => {
                        return {
                            status: "error",
                            code: error.code,
                            message: error.message
                        };
                    });
                } else {
                    return get(ref(database, `/users/${user.uid}/will_delete`)).then((snapshot) => {
                        if (snapshot.exists() && snapshot.val()) {
                            return _deleteUser(user).then(() => {
                                return {
                                    status: "error",
                                    code: "auth/user-not-found",
                                    message: "User not found"
                                };
                            }).catch((error) => {
                                return {
                                    status: "error",
                                    code: error.code,
                                    message: error.message
                                };
                            });
                        } else {
                            return {
                                status: "success",
                                user: user
                            };
                        }
                    });
                }
            });
        }).catch((error) => {
            return {
                status: "error",
                code: error.code,
                message: error.message
            };
        });
};

export const deleteUser = (uid = null) => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const database = getDatabase(app);

    if (uid === null) uid = auth.currentUser.uid;

    return set(ref(database, `/users/${uid}/deleted`), true).then(() => {
        return {
            status: "success"
        };
    }).catch(() => {
        return set(ref(database, `/users/${uid}/will_delete`), true).then(() => {
            return {
                status: "success"
            };
        }).catch((error) => {
            return {
                status: "error",
                code: error.code,
                message: error.message
            };
        });
    });
};

const deleteUserData = (uid) => {
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const dbRef = ref(database);

    return set(child(dbRef, `/users/${uid}`), null).then(() => {
        return {
            status: "success"
        };
    }).catch((error) => {
        return {
            status: "error",
            code: error.code,
            message: error.message
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
        return {
            status: "error",
            code: error.code,
            message: error.message
        };
    });
};

export const _getUser = (callback) => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const database = getDatabase(app);
    const dbRef = ref(database);

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const getInfo = async () => {
                const info = await get(child(dbRef, `/users/${user.uid}/info`));
                const data = await get(child(dbRef, `/users/${user.uid}/data`));
                const deleted = await get(child(dbRef, `/users/${user.uid}/deleted`));
                const willDelete = await get(child(dbRef, `/users/${user.uid}/will_delete`));
                const admin = await get(child(dbRef, `/admins/${user.uid}`));

                return {
                    info: info.val() || {},
                    data: data.val() || {},
                    deleted: deleted.val() || willDelete.val() || false,
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

export const useUser = () => {
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        _getUser((u) => {
            setUser(u);
        });
    }, []);

    return user;
};

export const getAdmins = () => {
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const dbRef = ref(database);

    return get(child(dbRef, "/admins")).then((snapshot) => {
        if (snapshot.exists()) {
            return {
                status: "success",
                data: snapshot.val()
            };
        } else {
            return {
                status: "error",
                code: "database/empty",
                message: "No admin found"
            };
        }
    }).catch((error) => {
        return {
            status: "error",
            code: error.code,
            message: error.message
        };
    });
};

export const getUsers = () => {
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const dbRef = ref(database);

    return get(child(dbRef, "/users")).then((snapshot) => {
        return snapshot.val();
    }).then((data) => {
        return getAdmins().then((admins) => {
            if (admins.status === "error") {
                admins.data = {};
            }
            Object.keys(data).forEach((key) => {
                data[key].admin = admins?.data?.[key] || false;
            });
            return {
                status: "success",
                data: data
            };
        });
    }).catch((error) => {
        return {
            status: "error",
            code: error.code,
            message: error.message
        };
    });
};

export const getCart = (user) => {
    return user?.data?.cart || [];
};

export const setCart = (user, cart) => {
    return updateUserData(user?.uid, { cart: cart });
};

export const updateUserInfo = (uid, info) => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const database = getDatabase(app);
    const dbRef = ref(database);

    if (uid === null) uid = auth.currentUser.uid;

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
                return {
                    status: "error",
                    code: error.code,
                    message: error.message
                };
            });
        }
        return {
            status: "success"
        };
    }).catch((error) => {
        return {
            status: "error",
            code: error.code,
            message: error.message
        };
    });
};

export const updateUserData = (uid, data) => {
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const dbRef = ref(database);

    if (uid === null) uid = getAuth(app).currentUser.uid;

    const updates = {};
    Object.keys(data).forEach((key) => {
        updates[`/users/${uid}/data/${key}`] = data[key];
    });

    console.log(updates);

    return update(dbRef, updates).then(() => {
        return {
            status: "success"
        };
    }).catch((error) => {
        return {
            status: "error",
            code: error.code,
            message: error.message
        };
    });
};

export const updateUserAdmin = (uid, admin) => {
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const dbRef = ref(database);

    if (admin === true) {
        return set(child(dbRef, `/admins/${uid}`), true).then(() => {
            return {
                status: "success"
            };
        }).catch((error) => {
            return {
                status: "error",
                code: error.code,
                message: error.message
            };
        });
    } else {
        return set(child(dbRef, `/admins/${uid}`), null).then(() => {
            return {
                status: "success"
            };
        }).catch((error) => {
            return {
                status: "error",
                code: error.code,
                message: error.message
            };
        });
    }
};

export const updateProduct = (catalog, product, id = null) => {
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const dbRef = ref(database);

    let uploadFiles;
    if (product?.images?.some((image) => image instanceof File)) {
        uploadFiles = (async () => {
            const storage = getStorage(app);
            for (let i = 0; i < product.images.length; i++) {
                if (product.images[i] instanceof File) {
                    const storageRef = refStorage(storage, `/${catalog}/${id}/${makeId()}${product.images[i].name}`);
                    await uploadBytes(storageRef, product.images[i]).then((snapshot) => {
                        return getDownloadURL(snapshot.ref).then((url) => {
                            product.images[i] = url;
                        });
                    });
                }
            }
        })();
    } else {
        uploadFiles = new Promise((resolve) => {
            resolve();
        });
    }

    if (catalog === null && product?.catalog) {
        catalog = product.catalog;
    }

    const newId = id || makeId();

    product.id = product?.id || newId;
    if (Object.keys(product).length === 1) product = {};

    return uploadFiles.then(() => {
        set(child(dbRef, `/products/items/${catalog}/${newId}`), product).then(() => {
            return {
                status: "success",
                id: newId
            };
        }).catch((error) => {
            return {
                status: "error",
                code: error.code,
                message: error.message
            };
        });
    });
};
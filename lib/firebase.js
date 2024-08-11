"use client";

import { initializeApp } from "firebase/app";
import { child, get, getDatabase, onValue, ref, set, update } from "firebase/database";
import { getDownloadURL, getStorage, ref as refStorage, uploadBytes } from "firebase/storage";
import {
    browserLocalPersistence,
    createUserWithEmailAndPassword,
    deleteUser as _deleteUser,
    getAuth,
    onAuthStateChanged,
    setPersistence,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from "firebase/auth";
import { firebaseConfig } from "@/lib/firebase_config";
import { useEffect, useState } from "react";
import { makeId } from "@/lib/utils";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const dbRef = ref(database);

export const createUser = (user, pass, optionalInfo = null, forceReload = true) => {
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
    return setPersistence(auth, browserLocalPersistence).then(() => {
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

export const deleteUserData = (uid) => {
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

const _getUser = (callback) => {
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
            }).catch(() => {
                callback(null);
            });
        } else {
            callback(null);
        }
    });
};

export const useUser = (dep = null) => {
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        _getUser((u) => {
            setUser(u);
        });
    }, [dep]);

    return user;
};

export const useCart = () => {
    const user = useUser();
    const [cart, setCart] = useState([]);

    useEffect(() => {
        let remove;
        if (user) {
            remove = onValue(child(dbRef, `/users/${user?.uid}/data/cart`), (snapshot) => {
                setCart(snapshot.val() || []);
            });
        } else {
            setCart([]);
        }
        return () => {
            remove?.();
        };
    }, [user]);

    return cart;

};

export const getAdmins = () => {
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

export const getPendingOrder = (user) => {
    return user?.data?.pending_order || [];
};
export const setPendingOrder = (user, order) => {
    return updateUserData(user?.uid, { pending_order: order });
};

export const usePendingOrder = () => {
    const user = useUser();
    const [pendingOrder, setPendingOrder] = useState([]);

    useEffect(() => {
        let remove;
        if (user) {
            remove = onValue(child(dbRef, `/users/${user?.uid}/data/pending_order`), (snapshot) => {
                setPendingOrder(snapshot.val() || []);
            });
        } else {
            setPendingOrder([]);
        }
        return () => {
            remove?.();
        };
    }, [user]);

    return pendingOrder;
};

export const getOrders = (uid = null) => {
    if (uid === null) uid = auth.currentUser.uid;

    return get(child(dbRef, `/users/${uid}/orders`)).then((snapshot) => {
        if (snapshot.exists()) {
            return {
                status: "success",
                data: snapshot.val()
            };
        } else {
            return {
                status: "success",
                data: {}
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

export const setOrder = (user, order) => {
    const newId = makeId();

    return set(child(dbRef, `/users/${user?.uid}/orders/${newId}`), order).then(() => {
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
};

export const getBanners = () => {
    return get(child(dbRef, "/banners")).then((snapshot) => {
        return {
            status: "success",
            data: snapshot.val()
        };
    }).catch((error) => {
        return {
            status: "error",
            code: error.code,
            message: error.message
        };
    });
};

export const updateBanners = (banners) => {
    let uploadFiles;
    if (banners?.some((banner) => banner.image instanceof File)) {
        uploadFiles = (async () => {
            const storage = getStorage(app);
            for (let i = 0; i < banners.length; i++) {
                if (banners[i].image instanceof File) {
                    const storageRef = refStorage(storage, `/banners/${makeId()}${banners[i].image.name}`);
                    await uploadBytes(storageRef, banners[i].image).then((snapshot) => {
                        return getDownloadURL(snapshot.ref).then((url) => {
                            banners[i].image = url;
                            console.log(banners[i].image);
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

    return uploadFiles.then(() => {
        return set(child(dbRef, "/banners"), banners).then(() => {
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

export const updateUserInfo = (uid, info) => {
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
    if (!uid) uid = auth.currentUser.uid;
    if (!uid) {
        return Promise.resolve({
            status: "error",
            code: "auth/user-not-found",
            message: "User not found"
        });
    }

    const updates = {};
    Object.keys(data).forEach((key) => {
        updates[`/users/${uid}/data/${key}`] = data[key];
    });

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

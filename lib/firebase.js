"use client";

import { initializeApp } from "firebase/app";
import { child, get, getDatabase, ref, set, update } from "firebase/database";
import {
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    deleteUser
} from "firebase/auth";
import { firebaseConfig } from "@/lib/firebase_config";
import { useEffect, useState } from "react";

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
                    return deleteUser(user).then(() => {
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
                const admin = await get(child(dbRef, `/admins/${user.uid}`));

                return {
                    info: info.val() || {},
                    data: data.val() || {},
                    deleted: deleted.val() || false,
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

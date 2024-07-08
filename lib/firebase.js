"use client";

import { initializeApp } from "firebase/app";
import { child, get, getDatabase, ref, set } from "firebase/database";
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

export const updateUserInfo = (info) => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const database = getDatabase(app);
    const dbRef = ref(database);

    return updateProfile(auth.currentUser, info).then(() => {
        return set(child(dbRef, `/users/${auth.currentUser.uid}/info`), info).then(() => {
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

export const updateUserData = (data) => {
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const dbRef = ref(database);

    return set(child(dbRef, `/users/${getAuth(app).currentUser.uid}/data`), data).then(() => {
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
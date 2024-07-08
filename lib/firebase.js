'use client'

import { initializeApp } from "firebase/app";
import { child, get, set, getDatabase, ref } from "firebase/database";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import { firebaseConfig } from "@/lib/firebase_config";

export const createUser = (user, pass, optionalInfo = null) => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    return createUserWithEmailAndPassword(auth, user, pass)
        .then((userCredential) => {
            const user = userCredential.user;
            if (optionalInfo) {
                return updateProfile(user, { displayName: optionalInfo.displayName }).then((u) => {
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

                let value = {};
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
                    return {
                        status: "success",
                        user: status.user
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
            }
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
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            return {
                status: "error",
                code: errorCode,
                message: errorMessage
            }
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
}

export const getUser = (callback) => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    onAuthStateChanged(auth, (user) => {
        if (user) {
            callback(user);
        } else {
            callback(null);
        }
    });
};
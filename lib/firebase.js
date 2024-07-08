'use client'

import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "@/lib/firebase_config";

export const createUser = (user, pass) => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    return createUserWithEmailAndPassword(auth, user, pass)
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

export const getUser = (callback) => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            callback(user);
        } else {
            callback(null);
        }
    });
};
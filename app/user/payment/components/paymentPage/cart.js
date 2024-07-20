'use client'
import { useUser, getCart } from '@/lib/firebase';
import ItemCart from './itemCart';
import { useEffect, useState } from 'react';
import { getProduct } from '@/lib/firebase_server';
import { Spin } from 'antd';
export default function Cart({setTotal, user}) {

    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const getImgURLProduct = async (id, catalog) => {
        if (getCart(user).length !== 0) {
            const snapshot = await getProduct(id, catalog);
            return snapshot.images[0];
        }
    }
    const getNameProduct = async (id, catalog) => {
        if (getCart(user).length !== 0) {
            const snapshot = await getProduct(id, catalog);
            return snapshot.name;
        }
    }
    const getPriceProduct = async (id, catalog) => {
        if (getCart(user).length !== 0) {
            const snapshot = await getProduct(id, catalog);
            return snapshot.price;
        }
    }

    const styleItemCart = loading ? "w-full sm:w-1/2 flex justify-center items-center" : "w-full sm:w-1/2 flex flex-col";
    useEffect(() => {
        if (getCart(user).length !== 0) {
            let iTotal = 0;
            const updateCartWithImages = async () => {
                try {
                    const arrCart = getCart(user);
                    // Sử dụng vòng lặp for...of để xử lý bất đồng bộ
                    for (const element of arrCart) {
                        const imgURL = await getImgURLProduct(element['id'], element['catalog']);
                        element.imgURL = imgURL;
                        const name = await getNameProduct(element['id'], element['catalog']);
                        element.title = name;
                        const price = await getPriceProduct(element['id'], element['catalog']);
                        element.price = price;
                        iTotal += price * element.amount;
                    }
                    console.log(arrCart);
                    setTotal(iTotal);
                    setCart(arrCart);
                }
                catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            };

            updateCartWithImages();
        }
    }, [user])


    return (
        <div className={styleItemCart}>
            {loading ?
                (
                    <Spin size="large" />
                )
                : (
                    cart.map((item, index) => (
                        <ItemCart key={index} title={item.title} price={item.price} quantity={item.amount} imgURL={item.imgURL} size={item.variant} />
                    ))
                )}
        </div>

    )
}
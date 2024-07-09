'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Image from 'next/image';
import './global.css';
import SizeButton from '/components/detailPage/sizeButton.js';
export default function DetailPage({ imageURL, title, price }) {
    const [chosenSize, setChosenSize] = useState('null');
    const router = useRouter();
    const handleClick = () => {
        router.push('/');
    };
    return (
        <div style={{height: '100vh'}}>
            <div>
                <button
                    className="text-white font-bold bg-blue-500 rounded px-3 py-2 m-5"
                    onClick={() => handleClick()}
                >
                    Home
                </button>
            </div>
            <div className="mb-5 px-5 flex flex-col space-y-5 justify-center align-center  sm:flex-row sm:py-1">
                <div className="sm:px-5 sm:w-2/5">
                    <Image
                        className="rounded-lg "
                        // src= {imageURL}
                        src="https://media3.coolmate.me/cdn-cgi/image/format=auto/uploads/April2024/thumb7indanan1_4.jpg"
                        alt="Product imgage"
                        width={400}
                        height={400}
                    />
                </div>

                <div className="sm:w-2/5 text-left space-y-5">
                    <div className="whitespace-nowrap  text-lg font-bold sm:text-3xl">
                        {' '}
                        Combo 3 Quần Lót Nam Trunk Bamboo
                    </div>
                    {/* <div className="whitespace-nowrap text-center text-lg font-bold sm:text-3xl"> {title}</div> */}
                    <div className="font-bold text-base sm:text-xl whitespace-nowrap">
                        339.000đ
                    </div>
                    <div className="flex  justify-center">
                        <SizeButton
                            size="S"
                            chosenSize={chosenSize}
                            setChosenSize={setChosenSize}
                        />
                        <SizeButton
                            size="M"
                            chosenSize={chosenSize}
                            setChosenSize={setChosenSize}
                        />
                        <SizeButton
                            size="L"
                            chosenSize={chosenSize}
                            setChosenSize={setChosenSize}
                        />
                        <SizeButton
                            size="XL"
                            chosenSize={chosenSize}
                            setChosenSize={setChosenSize}
                        />
                    </div>
                    <div>
                        <button className="text-white border-2 bg-black font-bold border-black rounded w-full  py-3 hover:bg-gray-700 hover:border-gray-700">
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

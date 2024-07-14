'use client';
import Image from "next/image"
export default function ItemCart({ title, price, quantity, imgURL, size  }) {
    const convertPriceIntoDollar = (price) => {
        return '$' + new Intl.NumberFormat('en-US').format(price)  ;
    }
    return (
        <div className="flex flex-row items-center justify-between w-full border-b border-gray-300 py-5">
            <div className="flex flex-row items-center space-x-5">
                <div className="w-24 h-25">
                    <Image src={imgURL} alt={title} layout="responsive" width={200} height={200} />
                </div>
                <div className="flex flex-col space-y-2">
                    <p className="font-semibold text-lg">{title}</p>
                    <p className="text-sm font-bold text-gray-500">Price: {convertPriceIntoDollar( price )}</p>
                    <div className="text-sm font-semibold text-gray-500 flex items-center space-x-2 ">
                        <span>Amount: {quantity}</span>
                        <span>Size: {size}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
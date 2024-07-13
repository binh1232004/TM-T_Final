'use client'
import Image from "next/image"
export default function ItemPaymentOption({ staticPath, title}){
    const handleClick = (event) => {
        event.preventDefault();
    }
    return (
        <button className="items-center flex flex-row rounded border border-gray-300 w-full px-5 text-sm font-semibold space-x-5" onClick={handleClick}>
        <Image src={staticPath} alt={ title } width={90} height={90} />
            <p>{title}</p>
        </button>        
    )
}

'use client'
import Image from "next/image"
export default function ItemPaymentOption({ staticPath, title, codeDelivery, selectedDeliveryOption, setSelectedDeliveryOption}){
    const bSelected = codeDelivery === selectedDeliveryOption;
    const styleSelected = bSelected ? 'items-center flex flex-row rounded border border-blue-500 w-full p-3 text-lg font-semibold space-x-5' : 'items-center flex flex-row rounded border border-gray-300 w-full p-3 text-lg font-semibold space-x-5';
    const handleClick = (event) => {
        event.preventDefault();
        setSelectedDeliveryOption(codeDelivery);
    }
    return (
        <button style={ { marginBottom: 20 } }className={styleSelected} onClick={handleClick}>
        <Image src={staticPath} alt={ title } width={90} height={90} />
            <p>{title}</p>
        </button>        
    )
}

import Image from "next/image"
export default function ItemCart({ title, price, quantity, imageURL, onIncrease, onDecrease, onClick }) {
    return (
        <div className="flex flex-row items-center justify-between w-full border-b border-gray-300 py-5">
            <div className="flex flex-row items-center space-x-5">
                <div className="w-24 h-25">
                    <Image src={imageURL} alt={title} layout="responsive" width={200} height={200} />
                </div>
                <div className="flex flex-col space-y-2">
                    <p className="font-semibold text-lg">{title}</p>
                    <p className="text-sm font-bold text-gray-500">Giá: {price}đ</p>
                    <div className="text-sm font-semibold text-gray-500 flex items-center space-x-2 rounded border border-2">
                        <button onClick={onDecrease} className="px-2 py-1  text-gray-700">-</button>
                        <span>Số lượng: {quantity}</span>
                        <button onClick={onIncrease} className="px-2 py-1  text-gray-700">+</button>
                    </div>
                </div>
            </div>
            <button onClick={onClick} className="text-red-500 font-semibold">Xóa</button>
        </div>
    )
}
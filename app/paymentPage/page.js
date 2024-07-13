'use client';
import { useRouter } from 'next/navigation';
import './global.css';
import ItemInputText from '/components/paymentPage/itemInputText.js';
import useDeliveryAddress from '/hooks/paymentPage/useDeliveryAddress.js';
import ItemPaymentOption from '/components/paymentPage/itemPaymentOption';
import ItemCart from '@/components/paymentPage/itemCart';
import { useUser } from '@/lib/firebase';
import { useEffect, useState } from 'react';
export default function PaymetPage() {
    const router = useRouter();
    const user = useUser();
    const handleSubmit = (event) => {
        event.preventDefault();
        // console.log(typedAddress, typedNote, selectedDeliveryOption, transformIdToNameDistrict(selectedDistrictId), transformIdToNameProvince(selectedProvinceId), transformIdToNameWard(selectedWardId));
    };
    useEffect(() => {
        console.log(user);
    }, [user]); 
    const {
        provinces,
        districts,
        wards,
        selectedProvinceId,
        selectedDistrictId,
        selectedWardId,
        handleProvinceChange,
        handleDistrictChange,
        handleWardChange,
        transformIdToNameProvince,
        transformIdToNameDistrict,
        transformIdToNameWard,
    } = useDeliveryAddress();

    const [typedAddress, setTypedAddress] = useState('');
    const [typedNote, setTypedNote] = useState('');
    //selectedDeliveryOption: have values base on codeDelivery in ItemPaymentOption
    // {COD: THANH TOÁN KHI NHẬN HÀNG, PAYPAL: THANH TOÁN BẰNG PAYPAL}
    const [selectedDeliveryOption, setSelectedDeliveryOption] = useState('COD');
    const styleSelect =
        'w-full bg-white border border-gray-300 text-sm rounded px-3 py-2 my-2';
    const handleTypedAddress = (e) => {
        setTypedAddress(e.target.value);
    }
    const handleTypedNote = (e) => {
        setTypedNote(e.target.value);
    }
    return (
        <div style={{ height: '100vh' }} >

            <div className="flex flex-col w-full sm:flex-row space-y-5 sm:space-x-10 px-5">
                <div className="w-full sm:w-1/2">
                    <ItemCart imageURL={"/images/QR.png"} title={"test"} price={100.000} quantity={1}></ItemCart>
                    <ItemCart imageURL={"/images/QR.png"} title={"test"} price={100.000} quantity={1}></ItemCart>
                    <ItemCart imageURL={"/images/QR.png"} title={"test"} price={100.000} quantity={1}></ItemCart>
                 </div>
                <div className="w-full sm:w-1/2 sm:mx-5 mx-1">
                    <form className="flex flex-col w-full items-start  space-y-3   sm:w-5/6">
                        <h1 className="font-bold text-3xl mb-2">
                            Thông tin đặt hàng
                        </h1>
                        <div className="flex flex-row space-x-3 w-full">
                            <ItemInputText
                                forPropertyLabel="name"
                                labelValue="Họ và tên"
                                idInputValue="input-payment__name"
                                widthInputValue="w-full"
                                placeholderInputValue="Nhập tên của bạn"
                            />
                            <ItemInputText
                                forPropertyLabel="phone-number"
                                labelValue="Số điện thoại"
                                idInputValue="input-payment__phone-number"
                                widthInputValue="w-full"
                                placeholderInputValue="Nhập số điện thoại của bạn"
                            />
                        </div>
                        <div className="w-full">
                            <ItemInputText
                                forPropertyLabel="email"
                                labelValue="Email"
                                idInputValue="input-payment__email"
                                widthInputValue="w-full"
                                placeholderInputValue=""
                                inputValue="binhwork245@gmail.com"
                                readOnly={true}
                            />
                        </div>
                        <div className="w-full">
                            <ItemInputText
                                forPropertyLabel="address"
                                labelValue="Địa chỉ"
                                idInputValue="input-payment__address"
                                widthInputValue="w-full"
                                placeholderInputValue="Địa chỉ (ví dụ: 103 Vạn Phúc, phường Vạn Phúc)"
                                onChange={handleTypedAddress}
                            />
                        </div>
                        <div className="w-full flex sm:flex-row flex-col justify-center  items-center sm:space-x-5">
                            <select
                                id="select-payment__province"
                                onChange={(e) => {
                                    handleProvinceChange(e.target.value);
                                }}
                                className={styleSelect}
                            >
                                <option value="null">Chọn Tỉnh</option>
                                {provinces.map((province) => (
                                    <option
                                        key={province.PROVINCE_ID}
                                        value={province.PROVINCE_ID}
                                    >
                                        {province.PROVINCE_NAME}
                                    </option>
                                ))}
                            </select>
                            <select
                                id="select-payment__district"
                                onChange={(e) => {
                                    handleDistrictChange(e.target.value);
                                }}
                                className={styleSelect}
                            >
                                <option value="null">Chọn Quận/Huyện</option>
                                {districts.map((district) => (
                                    <option
                                        key={district.DISTRICT_ID}
                                        value={district.DISTRICT_ID}
                                    >
                                        {district.DISTRICT_NAME}
                                    </option>
                                ))}
                            </select>
                            <select
                                id="select-payment__ward"
                                onChange={(e) => {
                                    handleWardChange(e.target.value);
                                }}
                                className={styleSelect}
                            >
                                <option value="null">Chọn Phường/Xã</option>
                                {wards.map((ward) => (
                                    <option
                                        key={ward.WARDs_ID}
                                        value={ward.WARDs_ID}
                                    >
                                        {ward.WARDS_NAME}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full">
                            <ItemInputText
                                forPropertyLabel="note"
                                labelValue="Ghi chú"
                                idInputValue="input-payment__note"
                                widthInputValue="w-full"
                                placeholderInputValue="Ghi chú thêm (Ví dụ: Giao hàng giờ hành chính)"
                                onChange={handleTypedNote}
                            />
                        </div>
                        <div className="w-full my-5">
                            <div className="border-t border-gray-300 w-full my-2"></div>
                        </div>

                        <h1 className="font-bold text-3xl mb-2">
                            Hình thức thanh toán
                        </h1>
                        {
                            //codeDelivery: dung de xac dinh phuong thuc thanh toan
                            //COD: THANH TOÁN KHI NHẬN HÀNG
                            //PAYPAL: THANH TOÁN BẰNG PAYPAL
                        }
                        <ItemPaymentOption title="Thanh toán khi nhận hàng" staticPath="/images/LogoCOD.png" codeDelivery={'COD'} selectedDeliveryOption={selectedDeliveryOption} setSelectedDeliveryOption={setSelectedDeliveryOption}/>
                        <ItemPaymentOption title="Thanh toán bằng PayPal" staticPath="/images/logoPayPal.png" codeDelivery={'PAYPAL'} selectedDeliveryOption={selectedDeliveryOption} setSelectedDeliveryOption={setSelectedDeliveryOption}/>

                        <div className="w-full">
                            <button onClick={handleSubmit} className="font-semibold rounded w-full bg-green-500 p-5 text-white my-5">Thanh toán</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

'use client';
import { useRouter } from 'next/navigation';
import './global.css';
import ItemInputText from './components/paymentPage/itemInputText.js';
import useDeliveryAddress from './hooks/paymentPage/useDeliveryAddress.js';
import ItemPaymentOption from './components/paymentPage/itemPaymentOption';
import ItemCart from './components/paymentPage/itemCart';
import { useUser, getCart } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import { getProduct } from '@/lib/firebase_server';
import { Spin } from 'antd';
import { setOrders } from '@/lib/firebase';
import Cart from './components/paymentPage/cart.js';
export default function PaymetPage() {
    const [typedAddress, setTypedAddress] = useState('');
    const [typedNote, setTypedNote] = useState('');
    //selectedDeliveryOption: have values base on codeDelivery in ItemPaymentOption
    // {COD: THANH TOÁN KHI NHẬN HÀNG, PAYPAL: THANH TOÁN BẰNG PAYPAL}
    const [selectedDeliveryOption, setSelectedDeliveryOption] = useState('COD');
    const [isHover, setIsHover] = useState(false);
    const user = useUser();
    const [total, setTotal] = useState(0);
    const router = useRouter();
    const redirectToHome = () => {
        router.push('/');
    };
    const convertPriceIntoDollar = (price) => {
        return '$' + new Intl.NumberFormat('en-US').format(price);
    }
    // Chuyển đổi hàm này thành async để có thể sử dụng await bên trong
    // const [cart, setCart] = useState([]);
    // const user = useUser();
    // const [loading, setLoading] = useState(true);
    // const getImgURLProduct = async (id, catalog) => {
    //     if (getCart(user).length !== 0) {
    //         const snapshot = await getProduct(id, catalog);
    //         return snapshot.images[0];
    //     }
    // }
    // const getNameProduct = async (id, catalog) => {
    //     if (getCart(user).length !== 0) {
    //         const snapshot = await getProduct(id, catalog);
    //         return snapshot.name;
    //     }
    // }
    // const getPriceProduct = async (id, catalog) => {
    //     if (getCart(user).length !== 0) {
    //         const snapshot = await getProduct(id, catalog);
    //         return snapshot.price;
    //     }
    // }
    // const convertPriceIntoDollar = (price) => {
    //     return '$' + new Intl.NumberFormat('en-US').format(price);
    // }

    // const styleItemCart = loading ?  "w-full sm:w-1/2 flex justify-center items-center" : "w-full sm:w-1/2 flex flex-col";
    // Sử dụng useEffect
    useEffect(() => {
        if (user === null) {
            redirectToHome();
        } else {
            // if (getCart(user).length !== 0) {
            //     let iTotal = 0;
            //     const updateCartWithImages = async () => {
            //         try {
            //             const arrCart = getCart(user);
            //             // Sử dụng vòng lặp for...of để xử lý bất đồng bộ
            //             for (const element of arrCart) {
            //                 const imgURL = await getImgURLProduct(element['id'], element['catalog']);
            //                 element.imgURL = imgURL;
            //                 const name = await getNameProduct(element['id'], element['catalog']);
            //                 element.title = name;
            //                 const price = await getPriceProduct(element['id'], element['catalog']);
            //                 element.price = price;
            //                 iTotal += price * element.amount;
            //             }
            //             console.log(arrCart);
            //             setTotal(iTotal);
            //             setCart(arrCart);
            //         }
            //         catch (error) {
            //             console.error(error);
            //         } finally {
            //             setLoading(false);
            //         }
            //     };

            //     updateCartWithImages();
            // }
        }
    }, [user]);
    const handleSubmit = (event) => {
        event.preventDefault();
        // console.log(typedAddress, typedNote, selectedDeliveryOption, transformIdToNameDistrict(selectedDistrictId), transformIdToNameProvince(selectedProvinceId), transformIdToNameWard(selectedWardId));
    };
    // const {
    //     provinces,
    //     districts,
    //     wards,
    //     selectedProvinceId,
    //     selectedDistrictId,
    //     selectedWardId,
    //     handleProvinceChange,
    //     handleDistrictChange,
    //     handleWardChange,
    //     transformIdToNameProvince,
    //     transformIdToNameDistrict,
    //     transformIdToNameWard,
    // } = useDeliveryAddress();

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
                {/* <div className={styleItemCart}>
                    {loading ?
                        (
                            <Spin size="large" />
                        )
                        : (
                            cart.map((item, index) => (
                                <ItemCart key={index} title={item.title} price={item.price} quantity={item.amount} imgURL={item.imgURL} size={item.variant} />
                            ))
                        )}
                </div> */}
                <Cart  setTotal={setTotal} user={user}/>
                <div className="w-full sm:w-1/2 sm:mx-5 mx-1">
                    <form className="flex flex-col w-full items-start  space-y-3   sm:w-5/6">
                        <h1 className="font-bold text-3xl mb-2">
                            Order details
                        </h1>
                        <div className="flex flex-row space-x-3 w-full">
                            <ItemInputText
                                forPropertyLabel="name"
                                labelValue="Full Name"
                                idInputValue="input-payment__name"
                                widthInputValue="w-full"
                                placeholderInputValue=""
                                readOnly={true}
                                inputValue={user ? user.info.name : ''}
                            />
                            <ItemInputText
                                forPropertyLabel="phone-number"
                                labelValue="Phone Number"
                                idInputValue="input-payment__phone-number"
                                widthInputValue="w-full"
                                placeholderInputValue=""
                                readOnly={true}
                                inputValue={user ? user.info.phone : ''}
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
                                labelValue="Address"
                                idInputValue="input-payment__address"
                                widthInputValue="w-full"
                                placeholderInputValue="Type your address"
                                onChange={handleTypedAddress}
                            />
                        </div>
                        {/* <div className="w-full flex sm:flex-row flex-col justify-center  items-center sm:space-x-5">
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
                        </div> */}
                        <div className="w-full">
                            <ItemInputText
                                forPropertyLabel="note"
                                labelValue="Note"
                                idInputValue="input-payment__note"
                                widthInputValue="w-full"
                                placeholderInputValue="Note for delivery (like 'Deliver in the morning')"
                                onChange={handleTypedNote}
                            />
                        </div>
                        <div className="w-full my-5">
                            <div className="border-t border-gray-300 w-full my-2"></div>
                        </div>

                        <h1 className="font-bold text-3xl mb-2">
                            Payment method
                        </h1>
                        {
                            //codeDelivery: dung de xac dinh phuong thuc thanh toan
                            //COD: THANH TOÁN KHI NHẬN HÀNG
                            //PAYPAL: THANH TOÁN BẰNG PAYPAL
                        }
                        <ItemPaymentOption title="Cash On Delivery" staticPath="/images/LogoCOD.png" codeDelivery={'COD'} selectedDeliveryOption={selectedDeliveryOption} setSelectedDeliveryOption={setSelectedDeliveryOption} />
                        <ItemPaymentOption title="PayPal" staticPath="/images/logoPayPal.png" codeDelivery={'PAYPAL'} selectedDeliveryOption={selectedDeliveryOption} setSelectedDeliveryOption={setSelectedDeliveryOption} />

                        <div className="w-full">
                            <button onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}
                                onClick={handleSubmit} className="font-semibold rounded w-full bg-green-500 hover:bg-green-400 p-5 text-white my-5">{isHover ? 'Order' : 'Total: ' + convertPriceIntoDollar(total)}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

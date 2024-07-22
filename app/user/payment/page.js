'use client';
import { useRouter } from 'next/navigation';
import './global.css';
import ItemInputText from './components/paymentPage/itemInputText.js';
import useDeliveryAddress from './hooks/paymentPage/useDeliveryAddress.js';
import ItemPaymentOption from './components/paymentPage/itemPaymentOption';
import ItemCart from './components/paymentPage/itemCart';
import { useUser, getPendingOrder, setOrder } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import { getProduct } from '@/lib/firebase_server';
import { Spin } from 'antd';
import { notification } from 'antd';
import PayPal from './components/paymentPage/paypal';
import {setPendingOrder} from '@/lib/firebase';
export default function PaymetPage() {
    const [api, contextHolder] = notification.useNotification();
    const openNotification = () => {
        api['success']({
            message: 'Thank you for your order!',
            description: 'You have successfully placed an order',
            duration: 2,
        });
    };
    const [typedAddress, setTypedAddress] = useState('');
    const [typedNote, setTypedNote] = useState('');
    //selectedDeliveryOption: have values base on codeDelivery in ItemPaymentOption
    // {COD: THANH TOÁN KHI NHẬN HÀNG, PAYPAL: THANH TOÁN BẰNG PAYPAL}
    const [selectedDeliveryOption, setSelectedDeliveryOption] = useState('COD');
    const [isHover, setIsHover] = useState(false);
    const [total, setTotal] = useState(0);
    const router = useRouter();
    const redirectToHome = () => {
        router.push('/');
    };
    // Chuyển đổi hàm này thành async để có thể sử dụng await bên trong
    const [cart, setCart] = useState([]);
    const user = useUser();
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const convertPriceIntoDollar = (price) => {
        return '$' + new Intl.NumberFormat('en-US').format(price);
    };
    const convertPriceIntoFormatPayPal = (price) => {
        return price + '.00';
    };
    useEffect(() => {
        console.log(convertPriceIntoFormatPayPal(total));
        setItems(
            cart.map((item) => {
                return {
                    name: item.title,
                    description: item.title,
                    unit_amount: {
                        currency_code: 'USD',
                        value: convertPriceIntoFormatPayPal(item.price),
                    },
                    quantity: item.amount.toString(),
                };
            }),
        );
    }, [total, cart]);
    const styleItemCart = loading
        ? 'w-full sm:w-1/2 flex justify-center items-center'
        : 'w-full sm:w-1/2 flex flex-col';
    // Sử dụng useEffect
    const getImgURLProduct = async (id, catalog) => {
        if (getPendingOrder(user).length !== 0) {
            const snapshot = await getProduct(id, catalog);
            return snapshot.images[0];
        }
    };
    const getNameProduct = async (id, catalog) => {
        if (getPendingOrder(user).length !== 0) {
            const snapshot = await getProduct(id, catalog);
            return snapshot.name;
        }
    };
    const getPriceProduct = async (id, catalog) => {
        if (getPendingOrder(user).length !== 0) {
            const snapshot = await getProduct(id, catalog);
            return snapshot.price;
        }
    };
    useEffect(() => {
        if (user === null) {
            redirectToHome();
        } else {
            if (getPendingOrder(user).length !== 0) {
                let iTotal = 0;
                const updateCartWithImages = async () => {
                    try {
                        const arrCart = getPendingOrder(user);
                        // Sử dụng vòng lặp for...of để xử lý bất đồng bộ
                        for (const element of arrCart) {
                            const imgURL = await getImgURLProduct(
                                element['id'],
                                element['catalog'],
                            );
                            element.imgURL = imgURL;
                            const name = await getNameProduct(
                                element['id'],
                                element['catalog'],
                            );
                            element.title = name;
                            const price = await getPriceProduct(
                                element['id'],
                                element['catalog'],
                            );
                            element.price = price;
                            iTotal += price * element.amount;
                        }
                        //console.log(arrCart);
                        setTotal(iTotal);
                        setCart(arrCart);
                    } catch (error) {
                        console.error(error);
                    } finally {
                        setLoading(false);
                    }
                };

                updateCartWithImages();
            }
        }
    }, [user]);
    const handleSubmit = async (event, isPaid = true) => {
        event.preventDefault();
        // console.log(typedAddress, typedNote, selectedDeliveryOption, transformIdToNameDistrict(selectedDistrictId), transformIdToNameProvince(selectedProvinceId), transformIdToNameWard(selectedWardId));
        console.log(
            cart,
            total,
            typedAddress,
            typedNote,
            selectedDeliveryOption,
        );
        if (typedAddress.trim() === '') {
            api['error']({
                message: 'Address is required',
                description: 'Please type your address',
                duration: 2,
            });
        } else {
            setOrder(user, {
                address: typedAddress,
                note: typedNote,
                products: cart,
                total: total,
                delivery_option: selectedDeliveryOption,
                status: isPaid,
            });
            openNotification();
            await setPendingOrder(user, null);
            redirectToHome();
        }
    };

    const styleSelect =
        'w-full bg-white border border-gray-300 text-sm rounded px-3 py-2 my-2';
    const handleTypedAddress = (e) => {
        setTypedAddress(e.target.value);
    };
    const handleTypedNote = (e) => {
        setTypedNote(e.target.value);
    };
    return (
        <div>
            <div className="flex flex-col w-full sm:flex-row space-y-5 sm:space-x-10 px-5">
                <div className={styleItemCart}>
                    {loading ? (
                        <Spin size="large" />
                    ) : (
                        <>
                            <h1 className="mt-[20px] font-bold text-3xl mb-2">
                                Cart
                            </h1>
                            {cart.map((item, index) => (
                                <ItemCart
                                    key={index}
                                    title={item.title}
                                    price={item.price}
                                    quantity={item.amount}
                                    imgURL={item.imgURL}
                                    size={item.variant}
                                />
                            ))}
                        </>
                    )}
                </div>

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
                                inputValue={user ? user.email : ''}
                                readOnly={true}
                            />
                        </div>
                        <div className="w-full ">
                            <ItemInputText
                                forPropertyLabel="address"
                                labelValue="Address "
                                idInputValue="input-payment__address"
                                widthInputValue="w-full"
                                placeholderInputValue="Type your address"
                                onChange={handleTypedAddress}
                                required={true}
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

                        <ItemPaymentOption
                            title="Cash On Delivery"
                            staticPath="/LogoCOD.png"
                            codeDelivery={'COD'}
                            selectedDeliveryOption={selectedDeliveryOption}
                            setSelectedDeliveryOption={
                                setSelectedDeliveryOption
                            }
                        />
                        {selectedDeliveryOption === 'COD' && (
                            <div className="w-full">
                                {contextHolder}
                                <button
                                    onMouseEnter={() => setIsHover(true)}
                                    onMouseLeave={() => setIsHover(false)}
                                    onClick={() => handleSubmit(event, false)}
                                    className="font-semibold rounded w-full bg-green-500 hover:bg-green-400 p-5 text-white "
                                >
                                    {isHover
                                        ? 'Order'
                                        : 'Total: ' +
                                          convertPriceIntoDollar(total)}
                                </button>
                            </div>
                        )}
                        <ItemPaymentOption
                            title="PayPal"
                            staticPath="/logoPayPal.png"
                            codeDelivery={'PAYPAL'}
                            selectedDeliveryOption={selectedDeliveryOption}
                            setSelectedDeliveryOption={
                                setSelectedDeliveryOption
                            }
                        />

                        {selectedDeliveryOption === 'PAYPAL' && (
                            <div className="w-full">
                                {contextHolder}
                                <PayPal
                                    total={convertPriceIntoFormatPayPal(total)}
                                    items={items}
                                    sendToDB={handleSubmit}
                                />
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

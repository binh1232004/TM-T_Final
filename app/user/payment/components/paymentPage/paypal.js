'use client';
import {
    PayPalScriptProvider,
    PayPalButtons,
} from '@paypal/react-paypal-js';
import React, { useRef, useEffect } from 'react';

const PayPal = ({ total, items, sendToDB, address }) => {
    //It will update not in the createOrder function
    // console.log(total, items);
    const totalRef = useRef(total);
    const itemsRef = useRef(items);
    const addressRef = useRef(address);

    useEffect(() => {
        totalRef.current = total;
        itemsRef.current = items;
        addressRef.current = address;
    }, [total, items]);

    return (
        <PayPalScriptProvider
            options={{
                'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                currency: 'USD',
                components: 'buttons',
            }}
        >
            <PayPalButtons
                className="w-full"
                style={{
                    layout: 'horizontal',
                    color: 'blue',
                    label: 'pay',
                }}
                createOrder={async () => {
                    //BUG: total and items are not updated, its always the initial value
                    // console.log(total, items);
                    const res = await fetch('/api/paypal', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ total: totalRef.current, items: itemsRef.current, address: addressRef.current }),
                    });
                    const order = await res.json();
                    console.log("Create order: ", order);
                    console.log("Create order: ", order.id);
                    return order.id;
                }}
                onApprove={async (data, actions) => {
                    console.log("Approve order: ", data);
                    const capture = await actions.order.capture();
                    console.log("Capture order: ", capture);    
                    // const transationID = capture.purchase_units[0].payments.captures[0].id;
                    // await sendToDB(event, true, data.);
                }}
                onCancel={() => console.log('Order Cancelled')}
                o
            />
        </PayPalScriptProvider>
    );
};

export default PayPal;

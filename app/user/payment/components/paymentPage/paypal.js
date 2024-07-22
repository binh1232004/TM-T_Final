'use client';
import {
    PayPalScriptProvider,
    PayPalButtons,
} from '@paypal/react-paypal-js';
import React, { useRef, useEffect } from 'react';

const PayPal = ({ total, items, sendToDB }) => {
    //It will update not in the createOrder function
    // console.log(total, items);
    const totalRef = useRef(total);
    const itemsRef = useRef(items);

    useEffect(() => {
        totalRef.current = total;
        itemsRef.current = items;
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
                    console.log(totalRef.current, itemsRef.current);
                    const res = await fetch('/api/paypal', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ total: totalRef.current, items: itemsRef.current }),
                    });
                    const order = await res.json();
                    console.log("Create order: ", order.id);
                    return order.id;
                }}
                onApprove={async (data, actions) => {
                    console.log("Approve order: ", data);
                    actions.order.capture();
                    sendToDB(event, true);
                }}
                onCancel={() => console.log('Order Cancelled')}
            />
        </PayPalScriptProvider>
    );
};

export default PayPal;

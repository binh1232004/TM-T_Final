"use client";
import { PayPalScriptProvider, PayPalButtons, PayPalMarks } from "@paypal/react-paypal-js";
const PayPal = () => {
    return (
        <PayPalScriptProvider
            options={{
                'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                currency: 'USD',
                intent: 'capture',
            }}
        >
            <PayPalButtons
                className="w-full"
                style={{
                    color: 'gold',
                    shape: 'rect',
                    label: 'pay',
                    height: 50
                }}
                // createOrder={async (data, actions) => {
                //     let order_id = await paypalCreateOrder()
                //     return order_id + ''
                // }}
                // onApprove={async (data, actions) => {
                //     let response = await paypalCaptureOrder(data.orderID)
                //     if (response) return true
                // }}
            />
        </PayPalScriptProvider>
    );
}
export default PayPal;
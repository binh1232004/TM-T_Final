import paypal from '@paypal/checkout-server-sdk';
import {NextResponse} from 'next/server'
const configureEnvironment = () => {
    const clientID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ;
    const clientSecret = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_SECRET;
    return new paypal.core.SandboxEnvironment(clientID, clientSecret);
}
const client = () => {
    return new paypal.core.PayPalHttpClient(configureEnvironment());
}
export default client;
export function POST(){
    return NextResponse.json({
        message: 'Processing POST request'
    })
}

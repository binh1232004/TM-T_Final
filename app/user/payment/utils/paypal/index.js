import checkoutNodeJssdk from '@paypal/checkout-server-sdk';
const configureEnvironment = () => {
    const clientID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ;
    const clientSecret = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_SECRET;
    return new checkoutNodeJssdk.core.SandboxEnvironment(clientID, clientSecret);
}
const client = () => {
    return new checkoutNodeJssdk.core.PayPalHttpClient(configureEnvironment());
}
export default client;
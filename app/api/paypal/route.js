import paypal from '@paypal/checkout-server-sdk';
import { NextResponse } from 'next/server';
const configureEnvironment = () => {
    const clientID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_SECRET;
    return new paypal.core.SandboxEnvironment(clientID, clientSecret);
};
const client = () => {
    return new paypal.core.PayPalHttpClient(configureEnvironment());
};

export async function POST(req, res) {
    const data = await req.json();
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
            {
                amount: {
                    currency_code: 'USD',
                    value: data.total,
                    breakdown: {
                        item_total: {
                            currency_code: 'USD',
                            value: data.total
                        },
                    }
                },
                items: data.items,
                shipping: {
                    address: {
                        address_line_1: '123 Đường Láng',
                        address_line_2: 'Phường Láng Thượng',
                        admin_area_2: 'Quận Đống Đa', 
                        admin_area_1: 'Hà Nội', 
                        postal_code: '100000',
                        country_code: 'VN',
                    }
                }
            },
        ],
    });
    const response = await client().execute(request);
    return NextResponse.json({
        id: response.result.id,
    });
}
//export  async function POST(req, res) {
//    if(req.method === 'POST') {
//        const {total, items} = req.body;
//        const request = new paypal.orders.OrdersCreateRequest();
//        request.requestBody({
//            intent: 'CAPTURE',
//            purchase_units: [
//                {
//                    amount: {
//                        currency_code: 'USD',
//                        value: total,
//                        breakdown: {
//                            item_total: {
//                                currency_code: 'USD',
//                                value: total,
//                            },
//                        }
//                    },
//                    items: items
//
//                },
//            ],
//        });
//        try{
//            const response = await client().execute(request);
//            res.status(200).json({
//                id: response.result.id,
//            });
//        }
//        catch(error){
//            res.status(500).json({
//                error: error.message,
//            });
//        }
//
//
//    }
//}


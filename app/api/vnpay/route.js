import { message } from "antd";
import { NEXT_BODY_SUFFIX } from "next/dist/lib/constants";
import { NextResponse } from "next/server";
import { setOrder } from "@/lib/firebase";
export async function POST(req, res) {
    try {
        const data = await req.json();
        const fitData = {
            amount: data.total
        }
        const requestToServerPHP = await fetch('http://localhost:8000/vnpay_php/vnpay_create_payment.php',
            {
                method: 'POST',
                body: new URLSearchParams(fitData).toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }
        )
        if (!requestToServerPHP.ok) {
            const errorData = await requestToServerPHP.json();
            return NextResponse.json({ error: 'Error in creating payment', details: errorData }, { status: 500 });
        }
        // return NextResponse.json({ message: 'Payment created successfully' });
        const responseText = await requestToServerPHP.text();
        // return NextResponse.json({message: new URL("", responseText)});
        return NextResponse.json({ message: 'URL redirection', redirectUrl: responseText });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
export async function GET(req, res) {
    return NextResponse.json({ message: 'Hello from GET' });
}
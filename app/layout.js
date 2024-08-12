import { Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./globals.css";
import MainLayout from "@/app/MainLayout";
// import { GoogleAnalytics, GoogleTagManager } from "./googleAnalytics";
import { GoogleAnalytics } from "@next/third-parties/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "K48 shop",
    description:
        "At K48 shop, we prioritize customer satisfaction with fast shipping, easy returns, and exceptional customer service. Join our community of fashion enthusiasts and discover why K48 shop is the preferred choice for stylish shoppers around the globe.",
    openGraph: {
        type: "website",
        title: "K48 shop",
        description:
            "Discover the latest trends and elevate your style with K48 shop. From chic clothing to must-have accessories, we offer a curated selection of products designed to keep you looking your best. Enjoy exclusive deals, new arrivals, and a seamless shopping experience with K48 shop - your trusted fashion partner.",
        images: [
            {
                url: "/logo.png",
                alt: "K48 shop - The ultimate fashion destination",
            },
        ],
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${inter.className}`}>
                <AntdRegistry>
                    <MainLayout>{children}</MainLayout>
                </AntdRegistry>
            </body>
            <GoogleAnalytics gaId="G-LJEPYD7XFF" />
        </html>
    );
}

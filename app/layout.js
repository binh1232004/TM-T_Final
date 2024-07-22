import { Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./globals.css";
import MainLayout from "@/app/MainLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "K48 shop",
    description: "K48 shop",
    openGraph: {
        type: "website",
        title: "K48 shop",
        description: "K48 shop",
        images: [
            {
                url: "/logo.png",
                width: 800,
                height: 600,
                alt: "K48 shop",
            },
        ],
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${inter.className}`}>
                <AntdRegistry>
                    <MainLayout>
                        {children}
                    </MainLayout>
                </AntdRegistry>
            </body>
        </html>
    );
}

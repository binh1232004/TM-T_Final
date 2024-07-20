"use client";

import { Layout, Image, Divider } from "antd";
import { useEffect } from "react";
import {
    FacebookOutlined,
    LinkedinOutlined,
    TwitterOutlined,
    YoutubeOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { default as NextImage } from "next/image";

const Footer = () => {
    useEffect(() => {
        var Tawk_API = Tawk_API || {},
            Tawk_LoadStart = new Date();
        (function () {
            var s1 = document.createElement("script"),
                s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = "https://embed.tawk.to/66948ffabecc2fed6924d7eb/1i2q54qko";
            s1.charset = "UTF-8";
            s1.setAttribute("crossorigin", "*");
            s0.parentNode.insertBefore(s1, s0);
        })();
    }, []);

    return (
        <div className="bg-[#001529] w-full h-fit">
            <div className="flex justify-between [&_*]:text-white/90">
                <div className="w-1/6 ml-20 opacity-90">
                    <Image src="/logo.png" preview={false} alt="logo" />
                </div>
                <div className="w-full flex gap-4 justify-evenly">
                    <div>
                        <div className="text-2xl font-extrabold capitalize my-5 h-fit w-fit border-b-2 border-white/90">
                            Contact
                        </div>
                        <div className="flex flex-col gap-2">
                            <p>
                                Address: 280 Đường An Dương vương, Phường 14, Quận 5, Hồ
                                Chí Minh
                            </p>
                            <p>Email: K48@Shop.hcmue.edu.vn</p>
                            <p>Phone: 0909 123 456</p>
                        </div>
                    </div>

                    <div>
                        <div className="text-2xl font-extrabold capitalize my-5 h-fit w-fit border-b-2 border-white/90">
                            Links
                        </div>
                        <div className="flex flex-col gap-2">
                            <Link href="/">Home</Link>
                            <Link href="/shirts">Shirts</Link>
                            <Link href="/pants">Pants</Link>
                            <Link href="/accessories">Accessories</Link>
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-extrabold capitalize my-5 h-fit w-fit border-b-2 border-white/90">
                            Social media
                        </div>
                        <div className="flex flex-col gap-4">
                            <Link href="#" className="flex gap-4">
                                <FacebookOutlined />
                                <span>Facebook</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-white/50 py-5 border-t-2 border-white/30 mx-20 flex justify-between">
                <div className="w-full m-auto">
                    © Copyright 2024. All rights reserved
                </div>
                <div className="h-full w-fit flex gap-4 justify-center items-center mr-10">
                    <div className="w-fit whitespace-nowrap">Made with:</div>
                    <div className="flex h-10 gap-4 items-center">
                        <Link href="https://nextjs.org/">
                            <Image
                                src="/nextjs_logo.svg"
                                preview={false}
                                alt="nextjs_logo"
                                height={50}
                            />
                        </Link>
                        <Link href="https://ant.design/">
                            <Image
                                src="/antd_logo.svg"
                                preview={false}
                                alt="antd_logo"
                                height={35}
                            />
                        </Link>
                        <Link
                            href="https://tailwindcss.com/"
                            className="h-full"
                        >
                            <Image
                                src="/tailwindcss_logo.svg"
                                preview={false}
                                alt="tailwindcss_logo"
                                height={35}
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;

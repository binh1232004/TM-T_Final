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
            <div className="flex justify-between">
                <div className="w-1/6 ml-20">
                    <Image src="/logo.png" preview={false} />
                </div>
                <div className="text-white w-full flex gap-4 justify-evenly">
                    <div>
                        <div className="text-2xl font-extrabold capitalize my-5 h-fit w-fit border-b-2 border-white">
                            Contact
                        </div>
                        <div className="flex flex-col gap-2">
                            <p>
                                280 Đường An Dương vương, Phường 14, Quận 5, Hồ
                                Chí Minh
                            </p>
                            <p className="border-b-2 border-white w-fit">
                                K48@Shop.hcmue.edu.vn
                            </p>
                            <p className="font-bold">099 123 456</p>
                        </div>
                    </div>

                    <div>
                        <div className="text-2xl font-extrabold capitalize my-5 h-fit w-fit border-b-2 border-white">
                            Links
                        </div>
                        <div className="flex flex-col gap-2">
                            <Link href="/" className="text-white">
                                Home
                            </Link>
                            <Link href="/shirts" className="text-white">
                                Shirts
                            </Link>
                            <Link href="/pants" className="text-white">
                                Pants
                            </Link>
                            <Link href="/accessories" className="text-white">
                                Accessories
                            </Link>
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-extrabold capitalize my-5 h-fit w-fit border-b-2 border-white">
                            Social media
                        </div>
                        <div className="flex flex-col gap-4">
                            <Link href="#" className="flex gap-4 text-white">
                                <FacebookOutlined />
                                <span>Facebook</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-white/50 py-5 border-t-2 border-white/30 mx-20">
                <div className="text-center w-full mx-auto">Copyright. All rights reserved</div>
            </div>
        </div>
    );
};

export default Footer;

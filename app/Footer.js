/**
 * pageID = 61562657587763;
 * appID = 406857895709258;
 */

"use client";

import { useEffect } from "react";
import { FacebookOutlined, MessageOutlined } from "@ant-design/icons";
import { Button, Image } from "antd";
import Link from "next/link";

const Footer = () => {
    useEffect(() => {
        // Tích hợp Tawk.to
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

        // Tích hợp Facebook Messenger Plugin
        window.fbAsyncInit = function() {
            FB.init({
                appId: '406857895709258', // App ID
                cookie: true,
                xfbml: true,
                version: 'v12.0'
            });
            FB.CustomerChat.showDialog();
        };
            // kết nối SDK
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            //js.src = "https://connect.facebook.net/en_US/sdk.js";
            js.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }, []);

    const openMessenger = () => {
        FB.CustomerChat.showDialog();
    };

    return (
        <div className="bg-[#001529] w-full h-fit relative">
            <div className="flex justify-between [&_*]:text-white">
                <div className="w-1/6 ml-20 opacity-90">
                    <Image src="/logo.png" preview={false} alt="logo" />
                </div>
                <div className="w-full flex gap-4 justify-evenly">
                    <div>
                        <div className="text-2xl font-extrabold capitalize my-5 h-fit w-fit border-b-2 border-white">
                            Contact
                        </div>
                        <div className="flex flex-col gap-2">
                            <p>
                                Address: 280 Đường An Dương Vương, Phường 14, Quận 5, Hồ Chí Minh
                            </p>
                            <p>Email: K48@Shop.hcmue.edu.vn</p>
                            <p>Phone: 0909 123 456</p>
                        </div>
                    </div>

                    <div>
                        <div className="text-2xl font-extrabold capitalize my-5 h-fit w-fit border-b-2 border-white">
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
                        <div className="text-2xl font-extrabold capitalize my-5 h-fit w-fit border-b-2 border-white">
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
            <Button
                type="primary"
                shape="circle"
                icon={<MessageOutlined />}
                size="large"
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 1000,
                }}
                onClick={openMessenger}
            />
            <div
                className="fb-customerchat"
                attribution="setup_tool"
                page_id="61562657587763" // my page ID
                theme_color="#0084ff"
                logged_in_greeting="Hi! How can we help you?"
                logged_out_greeting="Goodbye!"
            />
        </div>
    );
};

export default Footer;

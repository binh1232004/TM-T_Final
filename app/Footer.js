

"use client";

import { useEffect, useState } from "react";
import { FacebookOutlined, MessageOutlined } from "@ant-design/icons";
import { useUser } from "@/lib/firebase";
import { Button, Image, Tooltip, Popover } from "antd";
import Link from "next/link";
import styles from "../public/messBtn.module.css"

const Footer = () => {
    const user = useUser();
    const userEmail = user?.email || "";

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Tích hợp Tawk.to
        var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
        (function () {
            var s1 = document.createElement("script"),
                s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = "https://embed.tawk.to/669491d6becc2fed6924d845/1i2q5jc6b";
            s1.charset = "UTF-8";
            s1.setAttribute("crossorigin", "*");
            s0.parentNode.insertBefore(s1, s0);
        })();

        setVisible(true);
        const timer = setTimeout(() => setVisible(false), 6000);
        return () => clearTimeout(timer);
    }, []);
    
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
                        <div id="mc_embed_shell">
                            <link href="//cdn-images.mailchimp.com/embedcode/classic-061523.css"
                                          rel="stylesheet" type="text/css"/>
                                    <style type="text/css">
                                        {`
                                            #mc_embed_signup{clear:left; font:14px Helvetica,Arial,sans-serif; }
                                            /* Add your own Mailchimp form style overrides in your site stylesheet or in this style block.
                                               We recommend moving this block and the preceding CSS link to the HEAD of your HTML file. */
                                        `}
                                    </style>
                                    <div id="mc_embed_signup">
                                        <form
                                            action="https://zohomail.us17.list-manage.com/subscribe/post?u=16511ef613aa60fd4375c250b&amp;id=02fd0253cd&amp;f_id=0087c2e1f0"
                                            method="post" id="mc-embedded-subscribe-form"
                                            name="mc-embedded-subscribe-form" className="validate" target="_blank">
                                            <div id="mc_embed_signup_scroll">
                                            <div className="text-2xl font-extrabold capitalize my-5 h-fit w-fit border-b-2 border-white">
                                                Subcribe now !!!
                                            </div>
                                                <div className="mc-field-group">
                                                    <label htmlFor="mce-EMAIL">Your Email Address <span
                                                        className="asterisk">*</span></label>
                                                    <input type="email" name="EMAIL" className="required email bg-[#001529]"
                                                           id="mce-EMAIL" value={userEmail}></input>
                                                </div>
                                                
                                                
                                                <div className="clear ">
                                                    <input type="submit" value="Subscribe" name="subscribe"
                                                           id="mc-embedded-subscribe" className="button"/>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
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
            <Popover title="CHAT WITH OUR ^_^ " placement="left" visible={visible} trigger={"hover"}>
            <a className={styles.messBtn} target="_blank" href="https://m.me/385179104674572">
                <Image 
                preview={false}
                src="https://file.hstatic.net/1000288298/file/facebook_messenger_icon_d24cc42322fc4c2c8e15fcccac663e3a_large.png"/>
            </a>
            </Popover>
        </div>
    );
};

export default Footer;
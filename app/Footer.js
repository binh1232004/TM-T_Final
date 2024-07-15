"use client";

import { Layout } from "antd";
import { useEffect } from "react";

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
        <div className="bg-white outline outline-1 outline-red-500 w-full h-fit">
            K48 Shop
        </div>
    );
};

export default Footer;

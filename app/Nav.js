"use client";

import {
    HomeOutlined,
    ShoppingCartOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Button, Input } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { blue } from "@ant-design/colors";

const list = [
    {
        name: (
            <span>
                <HomeOutlined /> Trang chủ
            </span>
        ),
        path: "/",
    },
    {
        name: "Áo",
        path: "/shirt",
    },
    {
        name: "Quần",
        path: "/pants",
    },
];

const Nav = () => {
    const { Search } = Input;
    const pathName = usePathname();
    // const onSearch = (value, _e, info) => console.log(info?.source, value);
    return (
        <nav className="flex flex-row justify-between items-center h-14 bg-[#29292c]">
            <div className="mx-3 my-5">
                <Button
                    className="!border-none !text-white !bg-transparent hover:!text-blue-500"
                    icon={<UserOutlined style={{ fontSize: "20px" }} />}
                >
                    Tài khoản
                </Button>
            </div>
            <div className="h-full w-full flex gap-8 justify-center items-center">
                {list.map((item, index) => {
                    return (
                        <ul>
                            <li className="w-fit mx-10 text-white hover:text-blue-500 flex justify-center items-center">
                                <Link
                                    href={item.path}
                                    key={index}
                                    className={`${
                                        item.path === pathName &&
                                        "border-b-2 border-white hover:border-blue-500"
                                    } capitalize font-medium transition-all`}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        </ul>
                    );
                })}
            </div>
            <div className="flex justify-center items-center">
                <Button className="!border-none !text-white !bg-transparent hover:!text-blue-500">
                    Giỏ hàng
                    <ShoppingCartOutlined style={{ fontSize: "20px" }} />
                </Button>
            </div>
            <div className="mx-3 my-5 flex gap-8">
                <Search
                    placeholder="Tìm kiếm"
                    // onSearch={onSearch}
                    enterButton
                    className="!w-[200px]"
                />
            </div>
        </nav>
    );
};

export default Nav;

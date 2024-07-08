"use client";

import { Button, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";

const Nav = () => {
    const { Search } = Input;
    const onSearch = (value, _e, info) => console.log(info?.source, value);
    return (
        <div className="flex flex-row justify-between items-center bg-[#29292c] h-10">
            <div className="">
                <Button icon={<UserOutlined />} />
            </div>
            <div>
                <Search
                    placeholder="Tìm kiếm"
                    onSearch={onSearch}
                    enterButton
                    className="!w-[200px]"
                />
            </div>
        </div>
    );
};

export default Nav;

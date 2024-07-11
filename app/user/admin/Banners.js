"use client";

import { Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getBanners, updateBanners } from "@/lib/firebase";
import { useMessage } from "@/lib/utils";

export default function Banners() {
    const { success, error, loading, contextHolder } = useMessage();
    const [banners, setBanners] = useState([]);
    const [edited, setEdited] = useState(false);
    const [reload, setReload] = useState(false);

    const normFile = (e) => {
        setEdited(true);
        if (Array.isArray(e)) {
            return e;
        }
        setBanners(e?.fileList.map(banner => {
            return {
                ...banner,
                image: banner?.url || banner.originFileObj,
                link: "#",
                status: "done",
            };
        }));
        return e?.fileList;
    };

    const onSave = () => {
        const destroy = loading("Saving...");
        updateBanners(banners.map(banner => {
            return {
                image: banner.image,
                link: banner.link,
            };
        })).then((result) => {
            if (result.status === "success") {
                destroy();
                success("Banners updated successfully!");
                setEdited(false);
                setReload(!reload);
            } else {
                destroy();
                error("Failed to update banners!");
            }
        });
    };

    useEffect(() => {
        getBanners().then((data) => {
            if (data.status === "success") {
                setBanners(data.data.map(banner => {
                    return {
                        uid: banner.image,
                        name: banner.image,
                        status: "done",
                        url: banner.image,
                    };
                }));
            }
        });
    }, [reload]);

    useEffect(() => {
        console.log(banners);
    }, [banners]);

    return <div className="max-w-96">
        {contextHolder}
        <Upload fileList={banners} listType="picture" onChange={normFile} beforeUpload={file => {
            const validType = file.type === "image/jpeg" || file.type === "image/png";
            if (!validType) {
                error("You can only upload JPG/PNG file!");
            }
            return validType || Upload.LIST_IGNORE;
        }}>
            <Button icon={<UploadOutlined/>}>Upload</Button>
        </Upload>
        <Button disabled={!edited} className="!my-2 !ml-auto" type="primary" onClick={onSave}>Save</Button>
    </div>;
}
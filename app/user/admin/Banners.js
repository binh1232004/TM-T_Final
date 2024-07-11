"use client";

import { Button, Upload } from "antd";
import { DownOutlined, UploadOutlined, UpOutlined } from "@ant-design/icons";
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
                image: banner?.image || banner.url,
                link: banner.link || "#",
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

    return <div className="max-w-96">
        {contextHolder}
        <Upload
            fileList={banners}
            listType="picture"
            onChange={normFile}
            itemRender={(originNode, file) => {
                return <div className="flex flex-row w-full">
                    <div className="w-full">
                        {originNode}
                    </div>
                    <div className="flex flex-col justify-center">
                        <Button size="small" type="text" disabled={
                            banners.indexOf(file) === 0
                        } onClick={
                            () => {
                                const index = banners.indexOf(file);
                                const newBanners = [...banners];
                                [newBanners[index], newBanners[index - 1]] = [newBanners[index - 1], newBanners[index]];
                                setBanners(newBanners);
                                setEdited(true);
                            }
                        }><UpOutlined/></Button>
                        <Button size="small" type="text" disabled={
                            banners.indexOf(file) === banners.length - 1
                        } onClick={
                            () => {
                                const index = banners.indexOf(file);
                                const newBanners = [...banners];
                                [newBanners[index], newBanners[index + 1]] = [newBanners[index + 1], newBanners[index]];
                                setBanners(newBanners);
                                setEdited(true);
                            }
                        }><DownOutlined/></Button>
                    </div>
                </div>;
            }}
            beforeUpload={file => {
                const validType = file.type === "image/jpeg" || file.type === "image/png";
                if (!validType) {
                    error("You can only upload JPG/PNG file!");
                }
                return validType || Upload.LIST_IGNORE;
            }}
        >
            <Button icon={<UploadOutlined/>}>Upload</Button>
        </Upload>
        <Button disabled={!edited} className="!my-2 !ml-auto" type="primary" onClick={onSave}>Save</Button>
    </div>;
}
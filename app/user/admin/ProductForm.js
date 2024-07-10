import { Button, Form, Input, InputNumber, message, Modal, Select, Upload } from "antd";
import { useEffect, useState } from "react";
import { numberWithSeps, parseNumberWithSeps } from "@/lib/utils";
import { UploadOutlined } from "@ant-design/icons";
import { updateProduct } from "@/lib/firebase";
import { getCatalogs } from "@/lib/firebase_server";

export default function ProductForm({ product, open = false, onClose = null, onComplete = null }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [catalog, setCatalog] = useState();

    const closeModal = () => {
        setIsModalOpen(false);
        if (onClose) {
            onClose();
        }
    };

    const clearForm = () => {
        form.resetFields();
    };

    const normFile = (e) => {
        console.log("Upload event:", e);
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const onFinish = (values) => {
        const result = {
            id: product?.id,
            catalog: product?.catalog || values.catalog,
            name: values.name,
            price: values.price,
            description: values.description,
            variants: {
                s: values.s,
                m: values.m,
                l: values.l,
                xl: values.xl
            },
            images: values.images.map((image) => image?.url || image.originFileObj)
        };
        closeModal();

        const destroy = loading("Saving...");
        updateProduct(result.catalog, result, product?.id).then(() => {
            destroy();
            success("Product saved");
            if (onComplete) {
                onComplete(result);
            }
        }).catch((e) => {
            destroy();
            error("Save product failed " + e.message);
        });
    };

    const error = (message) => {
        messageApi.open({
            type: "error",
            content: message,
        }).then(() => {
        });
    };

    const success = (message) => {
        messageApi.open({
            type: "success",
            content: message,
        }).then(() => {
        });
    };

    const loading = (message) => {
        messageApi.open({
            type: "loading",
            content: message,
            duration: 0
        }).then(() => {
        });
        return messageApi.destroy;
    };

    useEffect(() => {
        setIsModalOpen(open);
    }, [open]);

    useEffect(() => {
        if (isModalOpen) {
            product?.name && form.setFieldValue("name", product.name);
            product?.price && form.setFieldValue("price", product.price);
            product?.description && form.setFieldValue("description", product.description);
            product?.variants && form.setFieldsValue({
                s: product.variants.s,
                m: product.variants.m,
                l: product.variants.l,
                xl: product.variants.xl
            });
            product?.images && form.setFieldValue("images", product.images.map((image, index) => {
                return {
                    uid: index,
                    name: image,
                    status: "done",
                    url: image
                };
            }));
            getCatalogs().then((data) => {
                setCatalog(Object.keys(data).map((key) => {
                    return <Select.Option key={key} value={key}>{data[key].name}</Select.Option>;
                }));
            });
        }
    }, [product, isModalOpen]);

    return (
        <Modal title={Object.keys(product).length ? "Edit" : "Add new product"} open={isModalOpen} onOk={closeModal}
               onCancel={closeModal} footer={null} destroyOnClose style={{ top: 20 }}
               forceRender afterClose={clearForm}>
            {contextHolder}
            <Form
                form={form}
                layout="horizontal"
                labelCol={{ span: 5 }}
                requiredMark={false}
                onFinish={onFinish}
                onFinishFailed={() => {
                }}
                autoComplete="off"
            >
                <Form.Item
                    name="name"
                    label="Product name"
                    rules={[
                        { required: true, message: "Please input product name!" },
                        { min: 6, message: "Product name must be at least 6 characters!" }
                    ]}
                >
                    <Input/>
                </Form.Item>
                {!Object.keys(product).length ?
                    <Form.Item
                        name="catalog"
                        label="Catalog"
                        rules={[{ required: true, message: "Please select catalog!" }]}
                    >
                        <Select placeholder="Select product catalog">
                            {catalog}
                        </Select>
                    </Form.Item> : null}
                <Form.Item
                    name="price"
                    label="Price"
                    rules={[
                        { required: true, message: "Please input price!" },
                        { type: "number", min: 0, message: "Price must be at least 0!" }
                    ]}
                >
                    <InputNumber min={0} addonAfter="$" formatter={(value) => numberWithSeps(value)}
                                 parser={(value) => parseNumberWithSeps(value)}/>
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ type: "string" }]}
                >
                    <Input.TextArea/>
                </Form.Item>
                <Form.Item
                    name="stock"
                    label="Stock"
                >
                    <div className="grid grid-cols-2 w-fit h-fit">
                        <Form.Item
                            name="s"
                            label=""
                            rules={[
                                { required: true, message: "Please input stock!" },
                                { type: "number", min: 0, message: "Stock must be at least 0!" }
                            ]}
                            style={{ display: "inline-block", width: "6.5rem", height: "fit-content", marginBottom: "0" }}
                        >
                            <InputNumber addonBefore="S" min={0} max={9999}/>
                        </Form.Item>
                        <Form.Item
                            name="m"
                            label=""
                            rules={[
                                { required: true, message: "Please input stock!" },
                                { type: "number", min: 0, message: "Stock must be at least 0!" }
                            ]}
                            style={{ display: "inline-block", width: "6.5rem", height: "fit-content", marginBottom: "0" }}
                        >
                            <InputNumber addonBefore="M" min={0} max={9999}/>
                        </Form.Item>
                        <Form.Item
                            name="l"
                            label=""
                            rules={[
                                { required: true, message: "Please input stock!" },
                                { type: "number", min: 0, message: "Stock must be at least 0!" }
                            ]}
                            style={{ display: "inline-block", width: "6.5rem", height: "fit-content", marginBottom: "0" }}
                        >
                            <InputNumber addonBefore="L" min={0} max={9999}/>
                        </Form.Item>
                        <Form.Item
                            name="xl"
                            label=""
                            rules={[
                                { required: true, message: "Please input stock!" },
                                { type: "number", min: 0, message: "Stock must be at least 0!" }
                            ]}
                            style={{ display: "inline-block", width: "6.5rem", height: "fit-content", marginBottom: "0" }}
                        >
                            <InputNumber addonBefore={"XL"} min={0} max={9999}/>
                        </Form.Item>
                    </div>
                </Form.Item>
                <Form.Item
                    name="images"
                    label="Images"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[{ required: true, message: "Please upload at least 1 image!" }]}
                >
                    <Upload listType="picture" beforeUpload={file => {
                        const validType = file.type === "image/jpeg" || file.type === "image/png";
                        if (!validType) {
                            error("You can only upload JPG/PNG file!");
                        }
                        return validType || Upload.LIST_IGNORE;
                    }}>
                        <Button icon={<UploadOutlined/>}>Upload</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <div className="flex flex-row gap-2">
                        <Button type="default" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
}
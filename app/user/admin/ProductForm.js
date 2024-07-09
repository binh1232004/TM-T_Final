import { Button, Form, Input, InputNumber, List, Modal, Upload } from "antd";
import { useEffect, useState } from "react";
import { numberWithSeps, parseNumberWithSeps } from "@/lib/utils";
import { UploadOutlined } from "@ant-design/icons";

export default function ProductForm({ product, open = false, onClose = null }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

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
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const onFinish = (values) => {
        const result = {
            name: values.name,
            price: values.price,
            description: values.description,
            variants: {
                s: values.s,
                m: values.m,
                l: values.l,
                xl: values.xl
            },
            images: values.images.map((image) => image?.url)
        };

        console.log(result);

        // TODO: save product
    };

    useEffect(() => {
        setIsModalOpen(open);
    }, [open]);

    useEffect(() => {
        product?.name && form.setFieldValue("name", product.name);
        product?.price && form.setFieldValue("price", product.price);
        product?.description && form.setFieldValue("description", product.description);
        product?.variants && form.setFieldsValue({ s: product.variants.s, m: product.variants.m, l: product.variants.l, xl: product.variants.xl });
        product?.images && form.setFieldValue("images", product.images.map((image, index) => {
            return {
                uid: index,
                name: image,
                status: "done",
                url: image
            };
        }));
    }, [product]);

    return (
        <Modal title={Object.keys(product).length ? "Edit" : "Add new product"} open={isModalOpen} onOk={closeModal}
               onCancel={closeModal} footer={null} destroyOnClose style={{ top: 20 }}
               forceRender afterClose={clearForm}>
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
                    <div className="grid grid-cols-2 w-fit">
                        <Form.Item
                            name="s"
                            label=""
                            rules={[
                                { required: true, message: "Please input stock!" },
                                { type: "number", min: 0, message: "Stock must be at least 0!" }
                            ]}
                            style={{ display: "inline-block", width: "6.5rem" }}
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
                            style={{ display: "inline-block", width: "6.5rem" }}
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
                            style={{ display: "inline-block", width: "6.5rem" }}
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
                            style={{ display: "inline-block", width: "6.5rem" }}
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
                            alert("You can only upload JPG/PNG file!");
                        }
                        return validType || Upload.LIST_IGNORE;
                    }}>
                        <Button icon={<UploadOutlined />}>Upload</Button>
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
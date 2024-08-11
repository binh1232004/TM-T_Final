import { useEffect, useState } from "react";
import { Modal } from "antd";
import Orders from "@/app/user/[userAction]/Orders";


export default function UserOrders({ user, open = false, onClose = null }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const closeModal = () => {
        setIsModalOpen(false);
        onClose?.();
    };

    useEffect(() => {
        setIsModalOpen(open);
    }, [open]);

    return <Modal title={`${user?.info?.name} orders`} open={isModalOpen} onOk={closeModal}
                  onCancel={closeModal} footer={null} destroyOnClose style={{ top: 20 }}
                  forceRender width={720}>
        <Orders uid={user?.uid}></Orders>
    </Modal>;
}
import { Modal } from "antd";
import React from "react";

interface ModalCustomProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: number | string;
  centered?: boolean;
  destroyOnClose?: boolean;
}

const ModalCustom: React.FC<ModalCustomProps> = ({
  open,
  onClose,
  children,
  width = 520,
  centered = true,
  destroyOnClose = true,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={null}
      closable={false}
      centered={centered}
      width={width}
      destroyOnClose={destroyOnClose}
      bodyStyle={{
        padding: 24,
      }}
      modalRender={(modal) => (
        <div
          style={{
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          {modal}
        </div>
      )}
    >
      {children}
    </Modal>
  );
};

export default ModalCustom;

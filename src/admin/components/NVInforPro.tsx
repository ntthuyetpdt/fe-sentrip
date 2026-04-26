import React, { useEffect } from "react";
import { Form, Row, Col, Tag } from "antd";
import ModalCustom from "../../components/custom/modal";
import CommonInput from "../../components/custom/input";
import ButtonCustom from "../../components/custom/button";
import {
  OrderInfor,
  STATUS_OPTIONS,
  STATUS_COLOR,
  PAYMENT_STATUS_OPTIONS,
  PAYMENT_STATUS_COLOR,
} from "../page/ManNV/InforPro";

interface NVInforProProps {
  open: boolean;
  data?: OrderInfor;
  onCancel: () => void;
}

const NVInforPro: React.FC<NVInforProProps> = ({ open, data, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
        totalAmount: data.totalAmount?.toLocaleString("vi-VN") + " đ",
        createdAt: new Date(data.createdAt).toLocaleString("vi-VN"),
      });
    }
  }, [data, form]);

  const renderOrderStatus = (status: string) => {
    const label = STATUS_OPTIONS.find((s) => s.value === status)?.label || status;
    const color = STATUS_COLOR[status] || "#8c8c8c";
    return (
      <Tag
        style={{
          color,
          borderColor: color,
          background: color + "1a",
          fontWeight: 600,
        }}
      >
        {label}
      </Tag>
    );
  };

  const renderPaymentStatus = (status: string | null) => {
    if (!status) {
      return (
        <Tag style={{ color: "#8c8c8c", borderColor: "#8c8c8c", background: "#8c8c8c1a", fontWeight: 600 }}>
          Chưa có
        </Tag>
      );
    }
    const label = PAYMENT_STATUS_OPTIONS.find((s) => s.value === status)?.label || status;
    const color = PAYMENT_STATUS_COLOR[status] || "#8c8c8c";
    return (
      <Tag
        style={{
          color,
          borderColor: color,
          background: color + "1a",
          fontWeight: 600,
        }}
      >
        {label}
      </Tag>
    );
  };

  return (
    <ModalCustom open={open} onClose={onCancel} width={650}>
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Mã đơn" name="orderCode">
              <CommonInput disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Tên khách hàng" name="fullNameCustomer">
              <CommonInput disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Loại dịch vụ" name="serviceType">
              <CommonInput disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Tổng tiền" name="totalAmount">
              <CommonInput disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Dịch vụ kèm theo" name="additionalService">
              <CommonInput disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Địa chỉ" name="address">
              <CommonInput disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Trạng thái đơn">
              {renderOrderStatus(data?.orderStatus || "")}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Thanh toán">
              {renderPaymentStatus(data?.paymentStatus || null)}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Ngày tạo" name="createdAt">
              <CommonInput disabled />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
        <ButtonCustom text="Đóng" onClick={onCancel} />
      </div>
    </ModalCustom>
  );
};

export default NVInforPro;
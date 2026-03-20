import React, { useEffect, useState } from "react";
import { Form, Row, Col, Popconfirm, message } from "antd";
import { SendOutlined } from "@ant-design/icons";
import ModalCustom from "../../components/custom/modal";
import CommonInput from "../../components/custom/input";
import ButtonCustom from "../../components/custom/button";
import { diDonProStatus } from "../../api/api";

export interface CustomerOrderDetail {
  orderCode: string;
  fullName: string;
  cccd: string;
  phone: string;
  address: string;
  gmail: string;

  createdAt: string;
  updatedAt: string;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;

  paymentCode: string | null;
  paymentAmount: number | null;
  paidAt: string | null;
  productName: string;
  quantity: number;
}

interface Props {
  open: boolean;
  data?: CustomerOrderDetail;
  onCancel: () => void;
  onPaymentSent?: (orderCode: string) => void;
}

const modalActionStyles = `
  .qlkh-send-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 36px;
    padding: 0 18px;
    border: 1.5px solid #1677ff;
    border-radius: 8px;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    background: #e6f4ff;
    color: #1677ff;
    transition: all 0.2s;
  }

  .qlkh-send-btn:hover {
    background: #1677ff;
    color: #fff;
    box-shadow: 0 2px 10px rgba(22, 119, 255, 0.25);
    transform: translateY(-1px);
  }

  .qlkh-send-btn:active {
    transform: translateY(0);
  }

  .qlkh-send-btn:disabled,
  .qlkh-send-btn[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const QuanLiKhachHangDaMuaModal: React.FC<Props> = ({
  open,
  data,
  onCancel,
  onPaymentSent,
}) => {
  const [form] = Form.useForm();
  const [dispatching, setDispatching] = useState(false);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
        totalAmount: data.totalAmount?.toLocaleString("vi-VN") + " đ",
      });
    } else {
      form.resetFields();
    }
  }, [data, form]);

  const canSendPayment =
    data?.paymentStatus?.toUpperCase() === "SUCCESS";

  const handleSendPayment = async () => {
    if (!data?.orderCode) return;
    try {
      setDispatching(true);
      await diDonProStatus(data.orderCode);
      message.success(`Đã gửi yêu cầu thanh toán cho đơn ${data.orderCode} thành công!`);
      onPaymentSent?.(data.orderCode);
    } catch (err) {
      console.log(err);
      message.error("Gửi yêu cầu thanh toán thất bại!");
    } finally {
      setDispatching(false);
    }
  };

  return (
    <ModalCustom open={open} onClose={onCancel} width={1200}>
      <style>{modalActionStyles}</style>

      <Form layout="vertical" form={form}>
        <Row gutter={20} align="stretch">

          {/* Thông tin khách hàng */}
          <Col span={11}>
            <div
              style={{
                border: "1px solid #eee",
                borderRadius: 10,
                padding: 16,
                height: "100%",
              }}
            >
              <h3 style={{ marginBottom: 16 }}>Thông tin khách hàng</h3>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Tên khách hàng" name="fullName">
                    <CommonInput disabled />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="CCCD" name="cccd">
                    <CommonInput disabled />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="SĐT" name="phone">
                    <CommonInput disabled />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Email" name="gmail">
                    <CommonInput disabled />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item label="Địa chỉ" name="address">
                    <CommonInput disabled />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Col>

          {/* Thông tin vé */}
          <Col span={13}>
            <div
              style={{
                border: "1px solid #eee",
                borderRadius: 10,
                padding: 16,
                height: "100%",
              }}
            >
              <h3 style={{ marginBottom: 16 }}>Thông tin vé</h3>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Mã đơn hàng" name="orderCode">
                    <CommonInput disabled />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Ngày tạo" name="createdAt">
                    <CommonInput disabled />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Dịch vụ" name="productName">
                    <CommonInput disabled />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Số lượng" name="quantity">
                    <CommonInput disabled />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Tổng tiền" name="totalAmount">
                    <CommonInput disabled />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Trạng thái đơn" name="orderStatus">
                    <CommonInput disabled />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Trạng thái thanh toán" name="paymentStatus">
                    <CommonInput disabled />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Mã thanh toán" name="paymentCode">
                    <CommonInput disabled />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Số tiền thanh toán" name="paymentAmount">
                    <CommonInput disabled />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Thời gian thanh toán" name="paidAt">
                    <CommonInput disabled />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Cập nhật lần cuối" name="updatedAt">
                    <CommonInput disabled />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Col>

        </Row>
      </Form>

      {/* Footer actions */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 24,
        }}
      >
        {/* Nút gửi yêu cầu thanh toán - chỉ hiện khi paymentStatus === SUCCESS */}
        <div>
          {canSendPayment && (
            <Popconfirm
              title="Xác nhận gửi yêu cầu thanh toán?"
              description={`Gửi yêu cầu thanh toán cho đơn ${data?.orderCode} đến kế toán.`}
              okText="Xác nhận"
              cancelText="Hủy"
              disabled={dispatching}
              onConfirm={handleSendPayment}
            >
              <button
                className="qlkh-send-btn"
                disabled={dispatching}
              >
                <SendOutlined />
                {dispatching ? "Đang gửi..." : "Gửi yêu cầu thanh toán cho kế toán"}
              </button>
            </Popconfirm>
          )}
        </div>

        <ButtonCustom text="Đóng" onClick={onCancel} />
      </div>

    </ModalCustom>
  );
};

export default QuanLiKhachHangDaMuaModal;
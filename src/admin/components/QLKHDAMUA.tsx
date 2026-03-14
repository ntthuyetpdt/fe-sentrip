import React, { useEffect } from "react";
import { Form, Row, Col } from "antd";
import ModalCustom from "../../components/custom/modal";
import CommonInput from "../../components/custom/input";
import ButtonCustom from "../../components/custom/button";

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
}

const QuanLiKhachHangDaMuaModal: React.FC<Props> = ({
  open,
  data,
  onCancel
}) => {

  const [form] = Form.useForm();

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
        totalAmount: data.totalAmount?.toLocaleString("vi-VN") + " đ"
      });
    } else {
      form.resetFields();
    }
  }, [data, form]);

  return (
    <ModalCustom open={open} onClose={onCancel} width={1200}>

      <Form layout="vertical" form={form}>
        <Row gutter={20} align="stretch">

          <Col span={11}>
            <div
              style={{
                border: "1px solid #eee",
                borderRadius: 10,
                padding: 16,
                height: "100%"
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

          <Col span={13}>
            <div
              style={{
                border: "1px solid #eee",
                borderRadius: 10,
                padding: 16,
                height: "100%"
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
                  <Form.Item label="Sản phẩm" name="productName">
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

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 24
        }}
      >
        <ButtonCustom text="Đóng" onClick={onCancel} />
      </div>

    </ModalCustom>
  );
};

export default QuanLiKhachHangDaMuaModal;
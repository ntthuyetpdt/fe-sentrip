import React, { useEffect } from "react";
import { Form, Row, Col, Tag } from "antd";

import ModalCustom from "../../components/custom/modal";
import CommonInput from "../../components/custom/input";
import ButtonCustom from "../../components/custom/button";

export interface Invoice {
  amount: number;
  fileName: string;
  fileUrl: string;
  generatedAt: string;
  invoiceCode: string;
  orderCode: string;
  status: string;
}

interface Props {
  open: boolean;
  data?: Invoice;
  onCancel: () => void;
}

const GetHoaDonModal: React.FC<Props> = ({
  open,
  data,
  onCancel
}) => {

  const [form] = Form.useForm();

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        invoiceCode: data.invoiceCode,
        orderCode: data.orderCode,
        amount: data.amount?.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND"
        }),
        generatedAt: new Date(data.generatedAt).toLocaleString("vi-VN"),
        fileName: data.fileName,
      });
    }
  }, [data]);

  return (
    <ModalCustom open={open} onClose={onCancel} width={600}>

      <Form layout="vertical" form={form}>
        <Row gutter={16}>

          <Col span={12}>
            <Form.Item label="Mã hóa đơn" name="invoiceCode">
              <CommonInput disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Mã đơn hàng" name="orderCode">
              <CommonInput disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Số tiền" name="amount">
              <CommonInput disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Ngày tạo" name="generatedAt">
              <CommonInput disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Trạng thái">
              <Tag color={data?.status === "PAID" ? "green" : "red"}>
                {data?.status === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
              </Tag>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Tên file" name="fileName">
              <CommonInput disabled />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="File hóa đơn">
              <a href={data?.fileUrl} target="_blank" rel="noopener noreferrer">
                {data?.fileUrl}
              </a>
            </Form.Item>
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

export default GetHoaDonModal;
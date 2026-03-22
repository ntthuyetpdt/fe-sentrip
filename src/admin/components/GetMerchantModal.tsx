import React, { useEffect } from "react";
import { Form, Row, Col, Avatar } from "antd";

import ModalCustom from "../../components/custom/modal";
import CommonInput from "../../components/custom/input";
import ButtonCustom from "../../components/custom/button";

export interface Merchant {
  id: number;
  merchantName: string;
  phone: string;
  address: string;
  bankAccount: string;
  bankName: string;
  businessLicense: string;
  cccd: string;
  img?: string | null;
}

interface Props {
  open: boolean;
  data?: Merchant;
  onCancel: () => void;
}

const GetMerchantModal: React.FC<Props> = ({
  open,
  data,
  onCancel
}) => {

  const [form] = Form.useForm();

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data]);

  return (
    <ModalCustom open={open} onClose={onCancel} width={700}>

      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <Avatar src={data?.img} size={80} />
      </div>

      <Form layout="vertical" form={form}>
        <Row gutter={16}>

          <Col span={12}>
            <Form.Item label="Tên Merchant" name="merchantName">
              <CommonInput disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="SĐT" name="phone">
              <CommonInput disabled />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Địa chỉ" name="address">
              <CommonInput disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Ngân hàng" name="bankName">
              <CommonInput disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Số tài khoản" name="bankAccount">
              <CommonInput disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="CCCD" name="cccd">
              <CommonInput disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Mã số doanh nghiệp" name="businessLicense">
              <CommonInput disabled />
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

export default GetMerchantModal;
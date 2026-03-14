import React, { useEffect } from "react";
import { Form, Row, Col, Avatar } from "antd";

import ModalCustom from "../../components/custom/modal";
import CommonInput from "../../components/custom/input";
import ButtonCustom from "../../components/custom/button";

export interface Customer {
  address: string;
  fullName: string;
  gmail: string;
  img: string;
  phone: string;
}

interface Props {
  open: boolean;
  data?: Customer;
  onCancel: () => void;
}

const GetKhachHangModal: React.FC<Props> = ({
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
    <ModalCustom open={open} onClose={onCancel} width={600}>

      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <Avatar src={data?.img} size={80} />
      </div>

      <Form layout="vertical" form={form}>
        <Row gutter={16}>

          <Col span={12}>
            <Form.Item label="Tên khách hàng" name="fullName">
              <CommonInput disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="SĐT" name="phone">
              <CommonInput disabled />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Gmail" name="gmail">
              <CommonInput disabled />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Địa chỉ" name="address">
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

export default GetKhachHangModal;
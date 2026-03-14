import React, { useEffect, useState } from "react";
import { Form, Row, Col, Divider } from "antd";

import ModalCustom from "../../components/custom/modal";
import CommonInput from "../../components/custom/input";
import ButtonCustom from "../../components/custom/button";

import { searchProductMer } from "../../api/api";

export interface ProductStatistics {
  productId: number;
  productName: string;
  additionalServices: string;
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
}

interface ProductDetail {
  id: number;
  productName: string;
  additionalService: string;
  price: number;
  img: string;
  merchantId: number;
  refundable: number;
  serviceType: string;
  status: number;
  type: string;
}

interface Props {
  open: boolean;
  data?: ProductStatistics;
  onCancel: () => void;
}

const GetDoanhThuProModal: React.FC<Props> = ({
  open,
  data,
  onCancel
}) => {

  const [form] = Form.useForm();
  const [detail, setDetail] = useState<ProductDetail | null>(null);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
        totalRevenue:
          Number(data.totalRevenue).toLocaleString("vi-VN") + " VNĐ"
      });
    }
  }, [data]);
  useEffect(() => {
    if (!open) {
      setDetail(null);
    }
  }, [open]);
  
  const handleViewDetail = async () => {
    try {

      const res = await searchProductMer(data?.productName);

      if (Array.isArray(res?.data) && res.data.length > 0) {
        setDetail(res.data[0]);
      }

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ModalCustom open={open} onClose={onCancel} width={700}>

      <Form layout="vertical" form={form}>
        <Row gutter={16}>

          <Col span={24}>
            <Form.Item label="Tên sản phẩm" name="productName">
              <CommonInput disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Số khách" name="totalCustomers">
              <CommonInput disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Số đơn" name="totalOrders">
              <CommonInput disabled />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Doanh thu" name="totalRevenue">
              <CommonInput disabled />
            </Form.Item>
          </Col>

        </Row>
      </Form>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 20
        }}
      >
        <ButtonCustom text="Xem chi tiết" onClick={handleViewDetail} />
        <ButtonCustom text="Đóng" onClick={onCancel} />
      </div>

      {detail && (
        <>
          <Divider>Thông tin sản phẩm</Divider>

          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Tên sản phẩm">
                  <CommonInput value={detail.productName} disabled />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Loại dịch vụ">
                  <CommonInput value={detail.serviceType} disabled />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Dịch vụ kèm theo">
                  <CommonInput value={detail.additionalService} disabled />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Giá">
                  <CommonInput
                    value={detail.price?.toLocaleString("vi-VN") + " VNĐ"}
                    disabled
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Mô tả">
                  <CommonInput value={detail.type} disabled />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Trạng thái">
                  <CommonInput
                    value={detail.status === 1 ? "Hoạt động" : "Ngừng"}
                    disabled
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Hoàn tiền">
                  <CommonInput
                    value={detail.refundable === 1 ? "Có" : "Không"}
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </>
      )}

    </ModalCustom>
  );
};

export default GetDoanhThuProModal;
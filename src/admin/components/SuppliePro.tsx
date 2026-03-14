import React, { useEffect, useState } from "react";
import { Form, Row, Col, Select, Upload, Image } from "antd";

import ModalCustom from "../../components/custom/modal";
import CommonInput from "../../components/custom/input";
import ButtonCustom from "../../components/custom/button";

export interface Product {
  id?: number;
  productName: string;
  type: string;
  additionalService: string;
  img: any;
  price: string;
  refundable: number;
  serviceType: string;
  status: number;
  address: string;
}

interface ProductModalProps {
  open: boolean;
  mode: "view" | "edit" | "create";
  data?: Product;
  onCancel: () => void;
  onSubmit?: (formData: FormData) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  open,
  mode,
  data,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [preview, setPreview] = useState<string | null>(null);

  const isView = mode === "view";

  useEffect(() => {
    if (mode === "create") {
      form.resetFields();
      setPreview(null);
      return;
    }

    if (data) {
      form.setFieldsValue({
        ...data,
        img: [],
      });
      setPreview(data.img);
    }
  }, [data, mode, form]);

  const handleSubmit = async () => {
    if (isView) {
      onCancel();
      return;
    }

    const values = await form.validateFields();

    const formData = new FormData();

    const { img, ...rest } = values;

    formData.append(
      "request",
      new Blob([JSON.stringify(rest)], { type: "application/json" })
    );

    const file = img?.[0]?.originFileObj;

    if (file) {
      formData.append("img", file);
    }

    onSubmit?.(formData);
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <ModalCustom open={open} onClose={onCancel} width={700}>
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Tên sản phẩm" name="productName">
              <CommonInput disabled={isView} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Giá" name="price">
              <CommonInput disabled={isView} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Loại dịch vụ" name="serviceType">
              <Select disabled={isView}>
                <Select.Option value="TICKET">TICKET</Select.Option>
                <Select.Option value="HOTEL">HOTEL</Select.Option>
                <Select.Option value="TOUR">TOUR</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Hoàn tiền" name="refundable">
              <Select disabled={isView}>
                <Select.Option value={1}>Có</Select.Option>
                <Select.Option value={0}>Không</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Địa chỉ" name="address">
              <CommonInput disabled={isView} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Mô tả" name="type">
              <CommonInput disabled={isView} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Dịch vụ kèm theo" name="additionalService">
              <CommonInput disabled={isView} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Ảnh sản phẩm"
              name="img"
              valuePropName="fileList"
              getValueFromEvent={(e) => e?.fileList}
            >
              {isView ? (
                preview && (
                  <Image
                    src={preview}
                    width={200}
                    style={{ borderRadius: 8 }}
                  />
                )
              ) : (
                <Upload
                  beforeUpload={() => false}
                  maxCount={1}
                  listType="picture"
                  onChange={({ fileList }) => {

                    if (fileList.length > 0) {
                      const file = fileList[0].originFileObj;
                      if (file) {
                        setPreview(URL.createObjectURL(file));
                      }
                    } else {
                      setPreview(null);
                    }

                  }}
                >
                  <ButtonCustom text="Chọn ảnh" />
                </Upload>
              )}
            </Form.Item>

            {preview && !isView && (
              <Image
                src={preview}
                width={200}
                style={{ marginTop: 10, borderRadius: 8 }}
              />
            )}
          </Col>

          <Col span={12}>
            <Form.Item label="Trạng thái" name="status">
              <Select disabled={isView}>
                <Select.Option value={1}>Hoạt động</Select.Option>
                <Select.Option value={0}>Ngừng</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 12,
          marginTop: 24,
        }}
      >
        {!isView && <ButtonCustom text="Huỷ" onClick={onCancel} />}

        <ButtonCustom text={isView ? "Đóng" : "Lưu"} onClick={handleSubmit} />
      </div>
    </ModalCustom>
  );
};

export default ProductModal;
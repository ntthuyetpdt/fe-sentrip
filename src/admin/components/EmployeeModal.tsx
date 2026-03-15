import React, { useEffect } from "react";
import { Form, DatePicker, Select, Row, Col } from "antd";
import dayjs from "dayjs";
import ModalCustom from "../../components/custom/modal";
import CommonInput from "../../components/custom/input";
import ButtonCustom from "../../components/custom/button";
import CommonSelect from "../../components/custom/select";

export interface Employee {
  JoinDate: string;
  Role: string;
  accountBank: string;
  address: string;
  bankName: string;
  cccd: string;
  fullName: string;
  gender: string;
  img: string | null;
  mnv: string;
  phone: string;
}

interface EmployeeModalProps {
  open: boolean;
  mode: "view" | "edit" | "create";
  data?: Employee;
  onCancel: () => void;
  onSubmit?: (values: Employee) => void;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
  open,
  mode,
  data,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const isView = mode === "view";

  useEffect(() => {
    if (mode === "create") {
      form.resetFields();
      return;
    }

    if (data) {
      form.setFieldsValue({
        ...data,
        JoinDate: data.JoinDate ? dayjs(data.JoinDate) : null,
      });
    }
  }, [data, mode, form]);

  const handleSubmit = async () => {
    if (isView) {
      onCancel();
      return;
    }

    try {
      const values = await form.validateFields();

      const formattedValues: Employee = {
        ...values,
        JoinDate: values.JoinDate
          ? values.JoinDate.format("YYYY-MM-DD")
          : "",
        img: data?.img || null,
      };

      onSubmit?.(formattedValues);
    } catch (error) {
      console.log("Validate lỗi:", error);
    }
  };

  return (
    <ModalCustom open={open} onClose={onCancel} width={700}>
      <h2>
        {mode === "view"
          ? "Xem nhân viên"
          : mode === "edit"
            ? "Chỉnh sửa nhân viên"
            : "Thêm nhân viên"}
      </h2>

      <Form layout="vertical" form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Mã NV"
              name="mnv"
              rules={[{ required: false, message: "Nhập mã nhân viên" }]}
            >
              <CommonInput disabled={isView} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Họ tên"
              name="fullName"
              rules={[{ required: false, message: "Nhập họ tên" }]}
            >
              <CommonInput disabled={isView} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Chức vụ"
              name="Role"
              rules={[{ required: false, message: "Nhập chức vụ" }]}
            >
              <CommonSelect
                disabled={isView}
                placeholder="Chọn chức vụ"
                options={[
                  { label: "ADMIN", value: "ADMIN" },
                  { label: "EMPLOYEE", value: "EMPLOYEE" },
                  { label: "ACCOUNTANT", value: "ACCOUNTANT" },
                  { label: "CUSTOMER", value: "CUSTOMER" },
                  { label: "MERCHANT", value: "MERCHANT" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Giới tính"
              name="gender"
              rules={[{ required: false, message: "Chọn giới tính" }]}
            >
              <Select disabled>
                <Select.Option value="Nam">Nam</Select.Option>
                <Select.Option value="Nữ">Nữ</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="SĐT"
              name="phone"
              rules={[
                { required: false, message: "Nhập số điện thoại" },
                {
                  pattern: /^(0|\+84)[0-9]{9}$/,
                  message: "SĐT không hợp lệ",
                },
              ]}
            >
              <CommonInput disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="CCCD"
              name="cccd"
              rules={[
                { required: false, message: "Nhập CCCD" },
                {
                  pattern: /^[0-9]{12}$/,
                  message: "CCCD phải gồm 12 số",
                },
              ]}
            >
              <CommonInput disabled />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: false, message: "Nhập địa chỉ" }]}
            >
              <CommonInput disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Ngân hàng"
              name="bankName"
              rules={[{ required: false, message: "Nhập tên ngân hàng" }]}
            >
              <CommonInput disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Số tài khoản"
              name="accountBank"
              rules={[
                { required: false, message: "Nhập số tài khoản" },
                {
                  pattern: /^[0-9]+$/,
                  message: "Chỉ được nhập số",
                },
              ]}
            >
              <CommonInput disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Ngày vào làm"
              name="JoinDate"
              rules={[{ required: false, message: "Chọn ngày vào làm" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                disabled
                format="DD/MM/YYYY"
              />
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
        {!isView && (
          <ButtonCustom text="Huỷ" onClick={onCancel} />
        )}

        <ButtonCustom
          text={isView ? "Đóng" : "Lưu"}
          onClick={handleSubmit}
        />
      </div>
    </ModalCustom>
  );
};

export default EmployeeModal;
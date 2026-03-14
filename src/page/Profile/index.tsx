import React, { useEffect, useState } from "react";
import {
  Card,
  Input,
  Row,
  Col,
  Avatar,
  Upload,
  message,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import BgWhiteBorder from "../../components/custom/bgWhiteBoder";
import ButtonCustom from "../../components/custom/button";
import CommonInput from "../../components/custom/input";

interface Customer {
  fullName: string;
  gmail: string;
  phone: string;
  cccd: string;
  address: string;
}

const CustomerProfile: React.FC = () => {
  const [editing, setEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [customer, setCustomer] = useState<Customer>({
    fullName: "",
    gmail: "",
    phone: "",
    cccd: "",
    address: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("user_profile");
    if (stored) {
      setCustomer(JSON.parse(stored));
    }
  }, []);

  const handleChange = (field: keyof Customer, value: string) => {
    setCustomer((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!customer.gmail) {
        message.error("Email không tồn tại!");
        return;
      }

      const token = localStorage.getItem("access_token");
      const formData = new FormData();

      const request = {
        fullName: customer.fullName,
        phone: customer.phone,
        address: customer.address,
        cccd: customer.cccd,
      };

      formData.append(
        "request",
        new Blob([JSON.stringify(request)], {
          type: "application/json",
        })
      );

      if (avatarFile) {
        formData.append("img", avatarFile);
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/customer/update/${(
          customer.gmail
        )}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Update failed");
      }

      await response.json();

      message.success("Cập nhật thành công!");
      setEditing(false);
    } catch (error) {
      console.error(error);
      message.error("Cập nhật thất bại!");
    }
  };

  return (
    <div>
      <div className="customer-profile">
        <BgWhiteBorder className="paddingProfile">
          <Row gutter={[24, 24]} className="profile-row">

            <Col xs={24} md={6} className="profile-left">
              <Avatar
                size={160}
                className="profile-avatar"
                src={avatarPreview || undefined}
                icon={<UserOutlined />}
              />

              {!editing ? (
                <div className="profile-action">
                  <ButtonCustom
                    text="Sửa"
                    onClick={() => setEditing(true)}
                  />
                </div>
              ) : (
                <Upload
                  showUploadList={false}
                  beforeUpload={(file) => {
                    const isLt2M = file.size / 1024 / 1024 < 2;
                    if (!isLt2M) {
                      message.error("Ảnh phải nhỏ hơn 2MB!");
                      return Upload.LIST_IGNORE;
                    }

                    setAvatarFile(file);
                    setAvatarPreview(URL.createObjectURL(file));
                    return false;
                  }}
                >
                  <div className="profile-action">
                    <ButtonCustom text="Đổi ảnh đại diện" />
                  </div>
                </Upload>
              )}
            </Col>

            <Col xs={24} md={18}>
              <Row gutter={[16, 16]}>

                <Col xs={24} sm={12}>
                  <Card className="info-card" >
                    <CommonInput
                      placeholder="Tên khách hàng"
                      value={customer.fullName}
                      disabled={!editing}
                      onChange={(e) =>
                        handleChange("fullName", e.target.value)
                      }
                    />
                  </Card>
                </Col>

                <Col xs={24} sm={12}>
                  <Card className="info-card">
                    <CommonInput value={customer.gmail} disabled />
                  </Card>
                </Col>

                <Col xs={24} sm={12}>
                  <Card className="info-card">
                    <CommonInput
                      placeholder="Số điện thoại"
                      value={customer.phone}
                      disabled={!editing}
                      onChange={(e) =>
                        handleChange("phone", e.target.value)
                      }
                    />
                  </Card>
                </Col>

                <Col xs={24} sm={12}>
                  <Card className="info-card">
                    <CommonInput
                      placeholder="CCCD"
                      value={customer.cccd}
                      disabled={!editing}
                      onChange={(e) =>
                        handleChange("cccd", e.target.value)
                      }
                    />
                  </Card>
                </Col>

                <Col xs={24}>
                  <Card className="info-card">
                    <CommonInput
                      placeholder="Địa chỉ"
                      value={customer.address}
                      disabled={!editing}
                      onChange={(e) =>
                        handleChange("address", e.target.value)
                      }
                    />
                  </Card>
                </Col>

              </Row>

              {editing && (
                <div className="profile-buttons">
                  <ButtonCustom
                    text="Huỷ"
                    onClick={() => setEditing(false)}
                  />
                  <ButtonCustom
                    text="Lưu"
                    onClick={handleSubmit}
                  />
                </div>
              )}
            </Col>

          </Row>
        </BgWhiteBorder>
      </div>
    </div>
  );
};

export default CustomerProfile;
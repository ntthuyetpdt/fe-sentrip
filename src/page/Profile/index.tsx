import React, { useEffect, useState } from "react";
import { Card, Row, Col, Avatar, Upload, message } from "antd";
import { ArrowLeftOutlined, UserOutlined } from "@ant-design/icons";
import BgWhiteBorder from "../../components/custom/bgWhiteBoder";
import ButtonCustom from "../../components/custom/button";
import CommonInput from "../../components/custom/input";
import axios from "axios";
import { getProfile } from "../../api/api";
import { useNavigate } from "react-router-dom";

interface Customer {
  mnv?: string;
  fullName: string;
  gmail: string;
  phone: string;
  gender?: string;
  dateTime?: string;
  address: string;
  joinDate?: string;
  cccd: string;
  bankName?: string;
  accountBank?: string;
}

const CustomerProfile: React.FC = () => {
  const [editing, setEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [role, setRole] = useState<string>("");
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer>({
    fullName: "",
    gmail: "",
    phone: "",
    cccd: "",
    address: "",
  });

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      const data = res.data;

      setRole(data?.role);

      setCustomer({
        mnv: data.mnv || "",
        fullName: data.name || "",
        gmail: data.gmail || "",
        phone: data.phone || "",
        gender: data.gender || "",
        dateTime: data.dateTime || "",
        address: data.address || "",
        joinDate: data.joinDate || "",
        cccd: data.cccd || "",
        bankName: data.bankName || "",
        accountBank: data.accountBank || "",
      });

      if (data.img) {
        setAvatarPreview(data.img);
      }
    } catch (error) {
      console.error(error);
      message.error("Không lấy được thông tin người dùng");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (field: keyof Customer, value: string) => {
    setCustomer((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const form = new FormData();

      if (avatarFile) {
        form.append("img", avatarFile);
      }

      const requestData =
        role === "CUSTOME"
          ? {
            fullName: customer.fullName,
            phone: customer.phone,
            address: customer.address,
            cccd: customer.cccd,
          }
          : {
            mnv: customer.mnv,
            fullName: customer.fullName,
            phone: customer.phone,
            gender: customer.gender,
            address: customer.address,
            cccd: customer.cccd,
            bankName: customer.bankName,
            accountBank: customer.accountBank,
          };

      form.append(
        "request",
        new Blob([JSON.stringify(requestData)], {
          type: "application/json",
        })
      );

      const api =
        role === "CUSTOME"
          ? "/customer/update/profile"
          : "/employee/update/profile";

      await axios.post(`${process.env.REACT_APP_API_URL}${api}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      message.success("Cập nhật thành công!");
      setEditing(false);
      fetchProfile();
    } catch (error) {
      console.error(error);
      message.error("Cập nhật thất bại!");
    }
  };

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 16,
          fontWeight: 500,
          padding: '10px',
          color: '#4C1D95'
        }}
        onClick={() => navigate(-1)}
      >
        <ArrowLeftOutlined />
        <span style={{marginTop:"-2px"}}>Quay lại</span>
      </div>
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
                  <ButtonCustom text="Sửa" onClick={() => setEditing(true)} />
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
                {role !== "CUSTOME" && (
                  <Col xs={24} sm={12}>
                    <Card className="info-card">
                      <CommonInput
                        placeholder="Mã nhân viên"
                        value={customer.mnv}
                        disabled
                      />
                    </Card>
                  </Col>
                )}

                <Col xs={24} sm={12}>
                  <Card className="info-card">
                    <CommonInput
                      placeholder="Tên"
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

                {role !== "CUSTOME" && (
                  <>
                    <Col xs={24} sm={12}>
                      <Card className="info-card">
                        <CommonInput
                          placeholder="Giới tính"
                          value={customer.gender}
                          disabled={!editing}
                          onChange={(e) =>
                            handleChange("gender", e.target.value)
                          }
                        />
                      </Card>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Card className="info-card">
                        <CommonInput
                          placeholder="Ngân hàng"
                          value={customer.bankName}
                          disabled={!editing}
                          onChange={(e) =>
                            handleChange("bankName", e.target.value)
                          }
                        />
                      </Card>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Card className="info-card">
                        <CommonInput
                          placeholder="Số tài khoản"
                          value={customer.accountBank}
                          disabled={!editing}
                          onChange={(e) =>
                            handleChange("accountBank", e.target.value)
                          }
                        />
                      </Card>
                    </Col>
                  </>
                )}
              </Row>

              {editing && (
                <div className="profile-buttons">
                  <ButtonCustom text="Huỷ" onClick={() => setEditing(false)} />
                  <ButtonCustom text="Lưu" onClick={handleSubmit} />
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
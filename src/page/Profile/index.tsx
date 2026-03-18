import React, { useEffect, useState } from "react";
import { Card, Row, Col, Avatar, Upload, message, Modal } from "antd";
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

const NUMBER_ONLY_FIELDS: (keyof Customer)[] = ["phone", "cccd", "accountBank"];

const CustomerProfile: React.FC = () => {
  const [editing, setEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [role, setRole] = useState<string>("");
  const [errors, setErrors] = useState<Partial<Record<keyof Customer, string>>>({});
  const navigate = useNavigate();

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

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
      if (data.img) setAvatarPreview(data.img);
    } catch (error) {
      console.error(error);
      message.error("Không lấy được thông tin khách hàng");
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleChange = (field: keyof Customer, value: string) => {
    if (NUMBER_ONLY_FIELDS.includes(field)) {
      if (value !== "" && !/^\d+$/.test(value)) {
        setErrors((prev) => ({ ...prev, [field]: "Chỉ được nhập số" }));
        return;
      }
      // Xoá lỗi khi nhập đúng
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    setCustomer((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (customer.phone && customer.phone.length !== 10) {
      message.warning("Số điện thoại phải đúng 10 số");
      return;
    }
    if (customer.cccd && customer.cccd.length !== 12) {
      message.warning("CCCD phải đúng 12 số");
      return;
    }

    try {
      const form = new FormData();
      if (avatarFile) form.append("img", avatarFile);

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
        new Blob([JSON.stringify(requestData)], { type: "application/json" })
      );

      const api =
        role === "CUSTOME"
          ? "/customer/update/profile"
          : "/employee/update/profile";

      await axios.post(`${process.env.REACT_APP_API_URL}${api}`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });

      message.success("Cập nhật thành công!");
      setEditing(false);
      setErrors({});
      fetchProfile();
    } catch (error) {
      console.error(error);
      message.error("Cập nhật thất bại!");
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      message.warning("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (newPassword !== confirmPassword) {
      message.warning("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setPasswordLoading(true);
      const form = new FormData();
      form.append(
        "request",
        new Blob([JSON.stringify({ password: newPassword })], { type: "application/json" })
      );

      const api =
        role === "CUSTOME"
          ? "/customer/update/profile"
          : "/employee/update/profile";

      await axios.post(`${process.env.REACT_APP_API_URL}${api}`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });

      message.success("Đổi mật khẩu thành công!");
      setPasswordModalOpen(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      message.error("Đổi mật khẩu thất bại!");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleClosePasswordModal = () => {
    setPasswordModalOpen(false);
    setNewPassword("");
    setConfirmPassword("");
  };

  // Helper render lỗi
  const renderError = (field: keyof Customer) =>
    errors[field] ? (
      <div style={{ color: "#ff4d4f", fontSize: 12, marginTop: 4, paddingLeft: 4 }}>
        {errors[field]}
      </div>
    ) : null;

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
          padding: "10px",
          color: "#4C1D95",
        }}
        onClick={() => navigate(-1)}
      >
        <ArrowLeftOutlined />
        <span style={{ marginTop: "-2px" }}>Quay lại</span>
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
                <div className="profile-action" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <ButtonCustom text="Sửa" onClick={() => setEditing(true)} />
                  <ButtonCustom text="Đổi mật khẩu" onClick={() => setPasswordModalOpen(true)} />
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
                      <CommonInput placeholder="Mã nhân viên" value={customer.mnv} disabled />
                    </Card>
                  </Col>
                )}

                <Col xs={24} sm={12}>
                  <Card className="info-card">
                    <CommonInput
                      placeholder="Tên"
                      value={customer.fullName}
                      disabled={!editing}
                      onChange={(e) => handleChange("fullName", e.target.value)}
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
              
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />
                    {renderError("phone")}
                  </Card>
                </Col>

                <Col xs={24} sm={12}>
                  <Card className="info-card">
                    <CommonInput
                      placeholder="Số tài khoản"
                      value={customer.accountBank}
                      disabled={!editing}
          
                      onChange={(e) => handleChange("accountBank", e.target.value)}
                    />
                    {renderError("accountBank")}
                  </Card>
                </Col>

                <Col xs={24} sm={12}>
                  <Card className="info-card">
                    <CommonInput
                      placeholder="CCCD"
                      value={customer.cccd}
                      disabled={!editing}
            
                      onChange={(e) => handleChange("cccd", e.target.value)}
                    />
                    {renderError("cccd")}
                  </Card>
                </Col>

                <Col xs={24}>
                  <Card className="info-card">
                    <CommonInput
                      placeholder="Địa chỉ"
                      value={customer.address}
                      disabled={!editing}
                      onChange={(e) => handleChange("address", e.target.value)}
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
                          onChange={(e) => handleChange("gender", e.target.value)}
                        />
                      </Card>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Card className="info-card">
                        <CommonInput
                          placeholder="Ngân hàng"
                          value={customer.bankName}
                          disabled={!editing}
                          onChange={(e) => handleChange("bankName", e.target.value)}
                        />
                      </Card>
                    </Col>
                  </>
                )}
              </Row>

              {editing && (
                <div className="profile-buttons">
                  <ButtonCustom text="Huỷ" onClick={() => { setEditing(false); setErrors({}); }} />
                  <ButtonCustom text="Lưu" onClick={handleSubmit} />
                </div>
              )}
            </Col>
          </Row>
        </BgWhiteBorder>
      </div>

      <Modal
        title="Đổi mật khẩu"
        open={passwordModalOpen}
        onCancel={handleClosePasswordModal}
        footer={null}
        centered
        destroyOnClose
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "8px 0" }}>
          <div>
            <div style={{ marginBottom: 6, fontSize: 13, color: "#555" }}>Mật khẩu mới</div>
            <CommonInput
              placeholder="Nhập mật khẩu mới"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div>
            <div style={{ marginBottom: 6, fontSize: 13, color: "#555" }}>Xác nhận mật khẩu</div>
            <CommonInput
              placeholder="Nhập lại mật khẩu mới"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }}>
            <ButtonCustom text="Huỷ" onClick={handleClosePasswordModal} />
            <ButtonCustom
              text={passwordLoading ? "Đang lưu..." : "Xác nhận"}
              onClick={handleChangePassword}
              disabled={passwordLoading}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CustomerProfile;
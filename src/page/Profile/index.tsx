import React, { useEffect, useState } from "react";
import { Card, Row, Col, Avatar, Upload, message, Modal, Select, DatePicker } from "antd";
import { ArrowLeftOutlined, UserOutlined } from "@ant-design/icons";
import BgWhiteBorder from "../../components/custom/bgWhiteBoder";
import ButtonCustom from "../../components/custom/button";
import CommonInput from "../../components/custom/input";
import axios from "axios";
import { getProfile } from "../../api/api";
import { useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";

// ── Interfaces ────────────────────────────────────────────────────────────────

interface UserProfile {
  fullName: string;
  phone: string;
  address: string;
  cccd: string;
}

interface MerchantProfile {
  merchantName: string;
  phone: string;
  cccd: string;
  bankName: string;
  bankAccount: string;
  address: string;
  img: string;
  businessLicense: string;
}

interface EmployeeProfile {
  mnv: string;
  fullName: string;
  phone: string;
  gender: string;
  dateTime: Dayjs | null;
  address: string;
  joinDate: string;
  cccd: string;
  bankName: string;
  accountBank: string;
}

type Role = "CUSTOME" | "MERCHANT" | "EMPLOYEE" | "";

// ── Helper ────────────────────────────────────────────────────────────────────

const getUpdateApi = (role: Role) => {
  if (role === "CUSTOME") return "/customer/update/profile";
  if (role === "MERCHANT") return "/merchant/update/profile";
  return "/employee/update/profile";
};

// ── Component ─────────────────────────────────────────────────────────────────

const CustomerProfile: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("");
  const [editing, setEditing] = useState(false);

  // Avatar
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Profile states
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: "", phone: "", address: "", cccd: "",
  });

  const [merchantProfile, setMerchantProfile] = useState<MerchantProfile>({
    merchantName: "", phone: "", cccd: "", bankName: "",
    bankAccount: "", address: "", img: "", businessLicense: "",
  });

  const [employeeProfile, setEmployeeProfile] = useState<EmployeeProfile>({
    mnv: "", fullName: "", phone: "", gender: "",
    dateTime: null, address: "", joinDate: "",
    cccd: "", bankName: "", accountBank: "",
  });

  // Password modal
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      const data = res.data;
      const r: Role = data?.role ?? "";
      setRole(r);
      if (data.img) setAvatarPreview(data.img);

      if (r === "CUSTOME") {
        setUserProfile({
          fullName: data.fullName || "",
          phone: data.phone || "",
          address: data.address || "",
          cccd: data.cccd || "",
        });
      } else if (r === "MERCHANT") {
        setMerchantProfile({
          merchantName: data.merchantName || "",
          phone: data.phone || "",
          cccd: data.cccd || "",
          bankName: data.bankName || "",
          bankAccount: data.bankAccount || "",
          address: data.address || "",
          img: data.img || "",
          businessLicense: data.businessLicense || "",
        });
      } else {
        setEmployeeProfile({
          mnv: data.mnv || "",
          fullName: data.fullName || "",
          phone: data.phone || "",
          gender: data.gender || "",
          dateTime: data.dateTime ? dayjs(data.dateTime) : null,
          address: data.address || "",
          joinDate: data.joinDate || "",
          cccd: data.cccd || "",
          bankName: data.bankName || "",
          accountBank: data.accountBank || "",
        });
      }
    } catch (err) {
      console.error(err);
      message.error("Không lấy được thông tin hồ sơ");
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const validateCommon = (phone: string, cccd: string) => {
    if (phone && phone.length !== 10) {
      message.warning("Số điện thoại phải đúng 10 số"); return false;
    }
    if (cccd && cccd.length !== 12) {
      message.warning("CCCD phải đúng 12 số"); return false;
    }
    return true;
  };

  const buildForm = (payload: object, imgFile?: File | null) => {
    const form = new FormData();
    if (imgFile) form.append("img", imgFile);
    form.append("request", new Blob([JSON.stringify(payload)], { type: "application/json" }));
    return form;
  };

  const postForm = async (api: string, form: FormData) => {
    await axios.post(`${process.env.REACT_APP_API_URL}${api}`, form, {
      headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
    });
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    try {
      let form: FormData;

      if (role === "CUSTOME") {
        if (!validateCommon(userProfile.phone, userProfile.cccd)) return;
        form = buildForm(
          {
            fullName: userProfile.fullName,
            phone: userProfile.phone,
            address: userProfile.address,
            cccd: userProfile.cccd,
          },
          avatarFile
        );
      } else if (role === "MERCHANT") {
        if (!validateCommon(merchantProfile.phone, merchantProfile.cccd)) return;
        form = buildForm(
          {
            merchantName: merchantProfile.merchantName,
            phone: merchantProfile.phone,
            cccd: merchantProfile.cccd,
            bankName: merchantProfile.bankName,
            bankAccount: merchantProfile.bankAccount,
            address: merchantProfile.address,
            businessLicense: merchantProfile.businessLicense,
          },
          avatarFile
        );
      } else {
        if (!validateCommon(employeeProfile.phone, employeeProfile.cccd)) return;
        form = buildForm(
          {
            fullName: employeeProfile.fullName,
            phone: employeeProfile.phone,
            gender: employeeProfile.gender,
            dateTime: employeeProfile.dateTime?.toISOString() ?? null,
            address: employeeProfile.address,
            cccd: employeeProfile.cccd,
            bankName: employeeProfile.bankName,
            accountBank: employeeProfile.accountBank,
          },
          avatarFile
        );
      }

      await postForm(getUpdateApi(role), form);
      message.success("Cập nhật thành công!");
      setEditing(false);
      fetchProfile();
    } catch (err) {
      console.error(err);
      message.error("Cập nhật thất bại!");
    }
  };

  // ── Password ───────────────────────────────────────────────────────────────

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      message.warning("Vui lòng nhập đầy đủ thông tin"); return;
    }
    if (newPassword !== confirmPassword) {
      message.warning("Mật khẩu xác nhận không khớp"); return;
    }
    try {
      setPasswordLoading(true);
      const form = buildForm({ password: newPassword });
      await postForm(getUpdateApi(role), form);
      message.success("Đổi mật khẩu thành công!");
      setPasswordModalOpen(false);
      setNewPassword(""); setConfirmPassword("");
    } catch (err) {
      console.error(err);
      message.error("Đổi mật khẩu thất bại!");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleClosePasswordModal = () => {
    setPasswordModalOpen(false);
    setNewPassword(""); setConfirmPassword("");
  };

  // ── Avatar upload ──────────────────────────────────────────────────────────

  const beforeUploadAvatar = (file: File) => {
    if (file.size / 1024 / 1024 >= 2) {
      message.error("Ảnh phải nhỏ hơn 2MB!"); return Upload.LIST_IGNORE;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    return false;
  };

  // ── Numeric input helper ───────────────────────────────────────────────────

  const numericInput = (
    value: string,
    onChange: (v: string) => void,
    placeholder: string,
    maxLen?: number
  ) => (
    <CommonInput
      placeholder={placeholder}
      value={value}
      disabled={!editing}
      onChange={(e) => {
        const v = e.target.value;
        if (v !== "" && !/^\d+$/.test(v)) return;
        if (maxLen && v.length > maxLen) return;
        onChange(v);
      }}
    />
  );

  // ── Render: CUSTOME ────────────────────────────────────────────────────────

  const renderUserFields = () => (
    <>
      <Col xs={24} sm={12}>
        <Card className="info-card">
          <CommonInput
            placeholder="Họ và tên"
            value={userProfile.fullName}
            disabled={!editing}
            onChange={(e) => setUserProfile((p) => ({ ...p, fullName: e.target.value }))}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12}>
        <Card className="info-card">
          {numericInput(
            userProfile.phone,
            (v) => setUserProfile((p) => ({ ...p, phone: v })),
            "Số điện thoại", 10
          )}
        </Card>
      </Col>

      <Col xs={24} sm={12}>
        <Card className="info-card">
          {numericInput(
            userProfile.cccd,
            (v) => setUserProfile((p) => ({ ...p, cccd: v })),
            "CCCD", 12
          )}
        </Card>
      </Col>

      <Col xs={24}>
        <Card className="info-card">
          <CommonInput
            placeholder="Địa chỉ"
            value={userProfile.address}
            disabled={!editing}
            onChange={(e) => setUserProfile((p) => ({ ...p, address: e.target.value }))}
          />
        </Card>
      </Col>
    </>
  );

  // ── Render: MERCHANT ───────────────────────────────────────────────────────

  const renderMerchantFields = () => (
    <>
      <Col xs={24} sm={12}>
        <Card className="info-card">
          <CommonInput
            placeholder="Tên nhà cung cấp"
            value={merchantProfile.merchantName}
            disabled={!editing}
            onChange={(e) => setMerchantProfile((p) => ({ ...p, merchantName: e.target.value }))}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12}>
        <Card className="info-card">
          {numericInput(
            merchantProfile.phone,
            (v) => setMerchantProfile((p) => ({ ...p, phone: v })),
            "Số điện thoại", 10
          )}
        </Card>
      </Col>

      <Col xs={24} sm={12}>
        <Card className="info-card">
          {numericInput(
            merchantProfile.cccd,
            (v) => setMerchantProfile((p) => ({ ...p, cccd: v })),
            "CCCD", 12
          )}
        </Card>
      </Col>

      <Col xs={24} sm={12}>
        <Card className="info-card">
          <CommonInput
            placeholder="Tên ngân hàng"
            value={merchantProfile.bankName}
            disabled={!editing}
            onChange={(e) => setMerchantProfile((p) => ({ ...p, bankName: e.target.value }))}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12}>
        <Card className="info-card">
          {numericInput(
            merchantProfile.bankAccount,
            (v) => setMerchantProfile((p) => ({ ...p, bankAccount: v })),
            "Số tài khoản ngân hàng"
          )}
        </Card>
      </Col>

      <Col xs={24} sm={12}>
        <Card className="info-card">
          <CommonInput
            placeholder="Mã số doanh nghiệp"
            value={merchantProfile.businessLicense}
            disabled={!editing}
            onChange={(e) => setMerchantProfile((p) => ({ ...p, businessLicense: e.target.value }))}
          />
        </Card>
      </Col>

      <Col xs={24}>
        <Card className="info-card">
          <CommonInput
            placeholder="Địa chỉ"
            value={merchantProfile.address}
            disabled={!editing}
            onChange={(e) => setMerchantProfile((p) => ({ ...p, address: e.target.value }))}
          />
        </Card>
      </Col>
    </>
  );

  // ── Render: EMPLOYEE ───────────────────────────────────────────────────────

  const renderEmployeeFields = () => (
    <>
      <Col xs={24} sm={12}>
        <Card className="info-card">
          <CommonInput placeholder="Mã nhân viên" value={employeeProfile.mnv} disabled />
        </Card>
      </Col>

      <Col xs={24} sm={12}>
        <Card className="info-card">
          <CommonInput
            placeholder="Họ và tên"
            value={employeeProfile.fullName}
            disabled={!editing}
            onChange={(e) => setEmployeeProfile((p) => ({ ...p, fullName: e.target.value }))}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12}>
        <Card className="info-card">
          {numericInput(
            employeeProfile.phone,
            (v) => setEmployeeProfile((p) => ({ ...p, phone: v })),
            "Số điện thoại", 10
          )}
        </Card>
      </Col>

      <Col xs={24} sm={12}>
        <Card className="info-card">
          <Select
            placeholder="Giới tính"
            value={employeeProfile.gender || undefined}
            disabled={!editing}
            onChange={(v) => setEmployeeProfile((p) => ({ ...p, gender: v }))}
            style={{ width: "100%" }}
            options={[
              { label: "Nam", value: "Nam" },
              { label: "Nữ", value: "Nữ" },
            ]}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12}>
        <Card className="info-card">
          <DatePicker
            placeholder="Ngày sinh"
            value={employeeProfile.dateTime}
            disabled={!editing}
            onChange={(date) => setEmployeeProfile((p) => ({ ...p, dateTime: date }))}
            className="custom-datepicker"
            format="DD/MM/YYYY"
          />
        </Card>
      </Col>

      <Col xs={24} sm={12}>
        <Card className="info-card">
          <CommonInput
            placeholder="Ngày tham gia"
            value={
              employeeProfile.joinDate
                ? dayjs(employeeProfile.joinDate).format("DD/MM/YYYY")
                : ""
            }
            disabled
          />
        </Card>
      </Col>

      <Col xs={24} sm={12}>
        <Card className="info-card">
          {numericInput(
            employeeProfile.cccd,
            (v) => setEmployeeProfile((p) => ({ ...p, cccd: v })),
            "CCCD", 12
          )}
        </Card>
      </Col>

      <Col xs={24} sm={12}>
        <Card className="info-card">
          <CommonInput
            placeholder="Tên ngân hàng"
            value={employeeProfile.bankName}
            disabled={!editing}
            onChange={(e) => setEmployeeProfile((p) => ({ ...p, bankName: e.target.value }))}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12}>
        <Card className="info-card">
          {numericInput(
            employeeProfile.accountBank,
            (v) => setEmployeeProfile((p) => ({ ...p, accountBank: v })),
            "Số tài khoản ngân hàng"
          )}
        </Card>
      </Col>

      <Col xs={24}>
        <Card className="info-card">
          <CommonInput
            placeholder="Địa chỉ"
            value={employeeProfile.address}
            disabled={!editing}
            onChange={(e) => setEmployeeProfile((p) => ({ ...p, address: e.target.value }))}
          />
        </Card>
      </Col>
    </>
  );

  // ── JSX ────────────────────────────────────────────────────────────────────

  return (
    <div>
      <div
        style={{
          marginBottom: 16, cursor: "pointer", display: "flex",
          alignItems: "center", gap: 8, fontSize: 16, fontWeight: 500,
          padding: "10px", color: "#4C1D95",
        }}
        onClick={() => navigate(-1)}
      >
        <ArrowLeftOutlined />
        <span style={{ marginTop: "-2px" }}>Quay lại</span>
      </div>

      <div className="customer-profile">
        <BgWhiteBorder className="paddingProfile">
          <Row gutter={[24, 24]} className="profile-row">

            {/* ── LEFT: Avatar ── */}
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
                <Upload showUploadList={false} beforeUpload={beforeUploadAvatar}>
                  <div className="profile-action">
                    <ButtonCustom text="Đổi ảnh đại diện" />
                  </div>
                </Upload>
              )}
            </Col>

            {/* ── RIGHT: Fields ── */}
            <Col xs={24} md={18}>
              <Row gutter={[16, 16]}>
                {role === "CUSTOME" && renderUserFields()}
                {role === "MERCHANT" && renderMerchantFields()}
                {role === "EMPLOYEE" && renderEmployeeFields()}
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

      {/* ── Password Modal ── */}
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
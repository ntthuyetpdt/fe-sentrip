import React, { useState } from "react";
import ButtonCustom from "../../components/custom/button";
import { useTranslation } from "react-i18next";
import { authRegister } from "../../api/auth";
import { message } from "antd";

interface RegisterProps {
  onRegisterSuccess: () => void;
  onBackToLogin?: () => void;
}

type RegisterMode = "user" | "provider";

const ROLE_USER = "4";
const ROLE_PROVIDER = "5";

const Register: React.FC<RegisterProps> = ({
  onRegisterSuccess,
  onBackToLogin,
}) => {
  const [mode, setMode] = useState<RegisterMode>("user");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [businessLicense, setBusinessCode] = useState("");
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  const isUser = mode === "user";

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      message.warning("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (password !== confirmPassword) {
      message.warning("Mật khẩu không khớp");
      return;
    }
    if (!isUser && !businessLicense.trim()) {
      message.warning("Vui lòng nhập mã số doanh nghiệp");
      return;
    }

    try {
      setLoading(true);
      await authRegister({
        gmail: email,
        password: password,
        Role: isUser ? ROLE_USER : ROLE_PROVIDER,
        ...(!isUser && { businessLicense: businessLicense.trim() }),
      });
      message.success(
        isUser ? "Đăng kí thành công" : "Đăng kí nhà cung cấp thành công"
      );
      onRegisterSuccess();
    } catch (error: any) {
      message.warning(error?.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchMode = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setBusinessCode("");
    setMode(isUser ? "provider" : "user");
  };

  return (
    <div className="auth auth--register">
      <h2 className="auth__title">
        {isUser ? "Đăng kí" : "Đăng kí làm nhà cung cấp"}
      </h2>

      <div className="auth__field">
        <input
          type="email"
          placeholder={t("Email") as string}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="auth__field">
        <input
          type="password"
          placeholder={t("PassWord") as string}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="auth__field">
        <input
          type="password"
          placeholder={t("Confirm password") as string}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {/* Chỉ hiện khi là nhà cung cấp */}
      {!isUser && (
        <div className="auth__field">
          <input
            type="text"
            placeholder="Mã số doanh nghiệp"
            value={businessLicense}
            onChange={(e) => setBusinessCode(e.target.value)}
          />
        </div>
      )}

      <ButtonCustom
        text={loading ? "Loading..." : (t("Register") as string)}
        onClick={handleRegister}
        disabled={loading}
        className="auth__btn"
      />

      <div className="auth__footer">
        <span>{t("Already have an account?")}</span>
        <span className="auth__link" onClick={onBackToLogin}>
          {t("Login")}
        </span>
      </div>

      <div className="auth__footer">
        <span>{isUser ? "Bạn có muốn đăng kí làm nhà cung cấp?" : "Bạn là người dùng?"}</span>
        <span className="auth__link" onClick={handleSwitchMode}>
          {isUser ? "Đăng kí nhà cung cấp" : "Đăng kí người dùng"}
        </span>
      </div>
    </div>
  );
};

export default Register;
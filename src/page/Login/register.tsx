import React, { useState } from "react";
import ButtonCustom from "../../components/custom/button";
import { useTranslation } from "react-i18next";
import { authRegister } from "../../api/auth";
import { message } from "antd";
import CommonSelect from "../../components/custom/select";

interface RegisterProps {
  onRegisterSuccess: () => void;
  onBackToLogin?: () => void;
}

const Register: React.FC<RegisterProps> = ({
  onRegisterSuccess,
  onBackToLogin,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  const handleRegister = async () => {
    if (!username || !password || !confirmPassword) {
      message.warning("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (password !== confirmPassword) {
      message.warning("Mật khẩu không khớp");
      return;
    }

    try {
      setLoading(true);

      const body = {
        gmail: username,
        password: password,
        Role: role
      };

      const res = await authRegister(body);

      message.success("Đăng kí thành công")

      onRegisterSuccess();
    } catch (error: any) {
      message.warning(error?.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth auth--register">
      <h2 className="auth__title">{t("Register")}</h2>

      <div className="auth__field">
        <input
          type="email"
          placeholder={t("Email") as string}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
      <CommonSelect
        placeholder="Chọn chức vụ"
        options={[
          { label: "Người dùng", value: "4" },
          { label: "Nhà phân phối", value: "5" },
        ]}
        onChange={(value: string) => setRole(value)}
      />
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
    </div>
  );
};

export default Register;
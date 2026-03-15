import React, { useState } from "react";
import ButtonCustom from "../../components/custom/button";
import { useTranslation } from "react-i18next";
import { message } from "antd";
import { authLogin } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../api/api";
import { stringify } from "querystring";

interface LoginProps {
  onClose?: () => void;
  onRegister?: () => void;
  router?: string;
}

const Login: React.FC<LoginProps> = ({ onRegister, router }) => {
  const [gmail, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const allowRoles = ["ADMIN", "EMPLOYEE", "MERCHANT", "ACCOUNTANT"];
  
  const handleLogin = async () => {
    if (!gmail || !password) {
      message.warning("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      const loginRes = await authLogin({
        gmail,
        password,
      });

      if (loginRes.status !== "ok") {
        message.error(loginRes.message || "Login failed");
        return;
      }

      const token = loginRes.data.token;
      localStorage.setItem("access_token", token);

      const profileRes = await getProfile();

      if (profileRes.code === 200) {
        localStorage.setItem(
          "user_profile",
          JSON.stringify(profileRes.data)
        );
      }
      message.success("Login success");

      const user_profile = JSON.parse(localStorage.getItem("user_profile") || "{}");
      const role = user_profile.role;

      if (allowRoles.includes(role)) {
        navigate(`/admin`);
      } else {
        console.log(role);
        if (role == "CUSTOME")
          navigate(`/`);
      }


    } catch (error: any) {
      message.error(
        error?.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth auth--login">
      <h2 className="auth__title">{t("Login")}</h2>

      <div className="auth__field">
        <input
          type="email"
          placeholder={t("Email") as string}
          value={gmail}
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

      <ButtonCustom
        text={t("Login")}
        onClick={handleLogin}
        disabled={loading}
        className="auth__btn"
      />

      <div className="auth__footer">
        <span>{t("Don’t have an account?")}</span>
        <span className="auth__link" onClick={onRegister}>
          {t("Register")}
        </span>
      </div>
    </div>
  );
};

export default Login;
import React, { useState } from "react";
import ButtonCustom from "../../components/custom/button";
import { useTranslation } from "react-i18next"
interface LoginProps {
  onClose: () => void;
  onRegister?: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose, onRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const handleLogin = () => {
    if (!username || !password) return;

    setLoading(true);
    localStorage.setItem("token", "abc");

    setTimeout(() => {
      console.log("Login:", { username, password });
      setLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="auth auth--login">
      <h2 className="auth__title">{t("Login")}</h2>

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

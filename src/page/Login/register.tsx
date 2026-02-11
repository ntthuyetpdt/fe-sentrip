import React, { useState } from "react";
import ButtonCustom from "../../components/custom/button";
import { useTranslation } from "react-i18next"
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
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();
    const handleRegister = () => {
        if (!username || !password || !confirmPassword) return;
        if (password !== confirmPassword) return;

        setLoading(true);

        setTimeout(() => {
            console.log("Register:", { username, password });

            setLoading(false);
            onRegisterSuccess();
        }, 1000);
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

            <ButtonCustom
                text= {t("Register")}
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

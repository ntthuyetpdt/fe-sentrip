import { useState, useEffect, useRef } from "react";
import Logo from "../../../assets/logo.png";
import { useTranslation } from "react-i18next";
import {
  BellOutlined,
  DownOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import TagGold from "../../custom/tagGold";
import ButtonCustom from "../../custom/button";
import ModalCustom from "../../custom/modal";
import Login from "../../../page/Login/login";
import Register from "../../../page/Login/register";
import UserSidebar from "../../custom/menu_user";
import { useNavigate } from "react-router-dom";

const DEFAULT_AVATAR =
  "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";

const HeaderCustom = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const [profile, setProfile] = useState<any>(null);
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);

  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const [isOpenRegister, setIsOpenRegister] = useState(false);
  const [isOpenUserDropdown, setIsOpenUserDropdown] = useState(false);

  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedProfile = localStorage.getItem("user_profile");

    if (storedProfile) {
      try {
        const parsed = JSON.parse(storedProfile);
        setProfile(parsed);

        if (parsed.avatar && parsed.avatar !== "null") {
          setAvatar(parsed.avatar);
        } else {
          setAvatar(DEFAULT_AVATAR);
        }
      } catch (error) {
      }
    }
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userRef.current &&
        !userRef.current.contains(e.target as Node)
      ) {
        setIsOpenUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="header">
        <div className="header-left" onClick={() => navigate('/')}>
          <img src={Logo} alt="logo" className="logo" />
        </div>

        <div className="header-right">
          <span className="help">{t("Help")}</span>

          <div className="icon boder-chung" onClick={() => navigate('/my-cart')}>
            <ShoppingCartOutlined />
          </div>

          <div className="icon boder-chung">
            <BellOutlined />
          </div>

          <div className="user" ref={userRef}>
            {token ? (
              <>
                <div
                  className="user-trigger"
                  onClick={() =>
                    setIsOpenUserDropdown((prev) => !prev)
                  }
                >
                  <img
                    src={avatar}
                    alt="avatar"
                    onError={(e: any) => {
                      e.target.src = DEFAULT_AVATAR;
                    }}
                  />

                  <div>
                    <p>
                      {t("Hi")},{" "}
                      <strong>
                        {profile?.name || "Chưa có tên"}
                      </strong>{" "}
                      <DownOutlined
                        style={{
                          fontSize: "13px",
                          color: "#999",
                        }}
                      />
                    </p>

                    <TagGold
                      hideIcon
                      style={{
                        padding: "0px",
                        border: "none",
                      }}
                    />
                  </div>
                </div>

                {isOpenUserDropdown && (
                  <div className="user-dropdown">
                    <UserSidebar />
                  </div>
                )}
              </>
            ) : (
              <div style={{ display: "flex", gap: "10px" }}>
                <ButtonCustom
                  text={t("Login")}
                  onClick={() => setIsOpenLogin(true)}
                />
                <ButtonCustom
                  className="registerBtn"
                  text={t("Register")}
                  onClick={() => setIsOpenRegister(true)}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      <ModalCustom
        open={isOpenLogin}
        onClose={() => setIsOpenLogin(false)}
        width={500}
      >
        <Login
          onClose={() => setIsOpenLogin(false)}
          onRegister={() => {
            setIsOpenLogin(false);
            setIsOpenRegister(true);
          }}
        />
      </ModalCustom>

      <ModalCustom
        open={isOpenRegister}
        onClose={() => setIsOpenRegister(false)}
        width={500}
      >
        <Register
          onRegisterSuccess={() => {
            setIsOpenRegister(false);
          }}
          onBackToLogin={() => {
            setIsOpenRegister(false);
            setIsOpenLogin(true);
          }}
        />
      </ModalCustom>
    </>
  );
};

export default HeaderCustom;
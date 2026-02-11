import { useState, useEffect, useRef } from "react";
import Logo from "../../../assets/logo.png";
import Sun from "../../../assets/sun.png";
import VietNam from "../../../assets/vietnam.png";
import Eng from '../../../assets/eng.png';
import { getHanoiTemperature } from "../../../api/api";
import { useTranslation } from "react-i18next";
import { BellOutlined, DownOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Select } from "antd";
import TagGold from "../../custom/tagGold";
import ButtonCustom from "../../custom/button";
import ModalCustom from "../../custom/modal";
import Login from "../../../page/Login/login";
import Register from "../../../page/Login/register";
import UserSidebar from "../../custom/menu_user";
const { Option } = Select;
const HeaderCustom = () => {
    const [temp, setTemp] = useState<number | null>(null);
    const { t, i18n } = useTranslation();
    const [avatar, setAvatar] = useState("https://kenh14cdn.com/2017/3235-1500365611879.jpg");
    const token = localStorage.getItem("token");
    const [isOpenLogin, setIsOpenLogin] = useState(false);
    const [isOpenRegister, setIsOpenRegister] = useState(false);
    const [isOpenUserDropdown, setIsOpenUserDropdown] = useState(false);
    const userRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        getHanoiTemperature()
            .then(setTemp)
            .catch();
    }, []);
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
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    return (
        <>
            <header className="header">
                <div className="header-left">
                    <img src={Logo} alt="sentrip" className="logo" />

                    <div className="weather boder-chung">
                        <img src={Sun} alt="sun" />
                        <span>{temp !== null ? `${temp}°C` : "--°C"}</span>
                    </div>
                </div>
                <div className="header-right">
                    <span className="help">{t("Help")}</span>

                    <div className="icon boder-chung"><ShoppingCartOutlined /></div>
                    <div className="icon boder-chung"><BellOutlined /></div>



                    <div className="lang boder-chung">
                        <Select
                            value={i18n.language}
                            onChange={(value) => i18n.changeLanguage(value)}
                            className="lang border-chung"
                            dropdownMatchSelectWidth={true}
                            bordered={false}
                        >
                            <Option value="vi">
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <img src={VietNam} alt="vi" width={20} />
                                    <span>Vi</span>
                                </div>
                            </Option>

                            <Option value="en">
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <img src={Eng} alt="en" width={20} />
                                    <span>En</span>
                                </div>
                            </Option>
                        </Select>
                    </div>


                    <div className="user" ref={userRef}>
                        {token ? (
                            <>
                                <div
                                    className="user-trigger"
                                    onClick={() => setIsOpenUserDropdown(prev => !prev)}
                                >
                                    <img src={avatar} />
                                    <div>
                                        <p>{t("Hi")}, SenTrip <DownOutlined style={{fontSize:'13px', color:"#999"}}/></p>
                                        <TagGold hideIcon style={{ padding: "0px", border: "none" }} />
                                    </div>
                                </div>

                                {isOpenUserDropdown && (
                                    <div className="user-dropdown">
                                        <UserSidebar />
                                    </div>
                                )}
                            </>
                        ) : (
                            <div style={{display:'flex', gap:'10px'}}>
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
            <div>
                <ModalCustom
                    open={isOpenLogin}
                    onClose={() => setIsOpenLogin(false)}
                    width={500}
                >
                    <Login
                        onClose={() => {
                            setIsOpenLogin(false);
                        }}
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


            </div>
        </>
    );
};

export default HeaderCustom;

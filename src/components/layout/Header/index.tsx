import { useState, useEffect } from "react";
import Logo from "../../../assets/logo.png";
import Sun from "../../../assets/sun.png";
import VietNam from "../../../assets/vietnam.png";
import Eng from '../../../assets/eng.png';
import { getHanoiTemperature } from "../../../api/api";
import { useTranslation } from "react-i18next";
import { BellOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Select } from "antd";
import TagGold from "../../custom/tagGold";
const { Option } = Select;
const HeaderCustom = () => {
    const [temp, setTemp] = useState<number | null>(null);
    const { t, i18n } = useTranslation();
    const [avatar, setAvatar] = useState("https://kenh14cdn.com/2017/3235-1500365611879.jpg");
    useEffect(() => {
        getHanoiTemperature()
            .then(setTemp)
            .catch(console.error);
    }, []);

    return (
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


                <div className="user">
                    <img src={avatar} />
                    <div>
                        <p>{t("Hi")}, SenTrip</p>
                        <TagGold/>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default HeaderCustom;

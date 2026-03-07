import { Select, Card, message } from "antd";
import { useState } from "react";
import { AddAccount } from "../../api/api";
import ButtonCustom from "../../components/custom/button";
import CommonInput from "../../components/custom/input";
import CommonSelect from "../../components/custom/select";

const { Option } = Select;

const AddAcc = () => {
    const [gmail, setGmail] = useState("");
    const [role, setRole] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!gmail) {
            message.error("Vui lòng nhập email");
            return;
        }

        if (!role) {
            message.error("Vui lòng chọn role");
            return;
        }

        try {
            setLoading(true);

            const body = {
                gmail,
                Role: role,
            };

            await AddAccount(body);

            message.success("Tạo tài khoản thành công!");

            setGmail("");
            setRole(undefined);
        } catch (error) {
            message.error("Tạo tài khoản thất bại!");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-acc">
            <Card style={{ maxWidth: 500, border: 'none'}}>

                <div className="field">
                    <label>Email</label>
                    <CommonInput
                        value={gmail}
                        onChange={(e) => setGmail(e.target.value)}
                        placeholder="Nhập email..."
                        variant="purple"
                    />
                </div>  

                <div className="field">
                    <label>Chức vụ</label>
                    <CommonSelect
                        value={role}
                        onChange={(value) => setRole(value)}
                        placeholder="Chọn role"
                        variant="purple"
                        options={[
                            { label: "ADMIN", value: "1" },
                            { label: "EMPLOYEE", value: "2" },
                            { label: "ACCOUNTANT", value: "3" }
                        ]}
                    />
                </div>

                <ButtonCustom
                    text={loading ? "Đang tạo..." : "Tạo tài khoản"}
                    onClick={handleSubmit}
                    disabled={loading}
                    className="add-acc__btn"
                />
            </Card>
        </div>
    );
};

export default AddAcc;
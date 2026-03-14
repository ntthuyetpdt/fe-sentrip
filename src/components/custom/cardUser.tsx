import { Avatar } from "antd";
import { RightOutlined } from "@ant-design/icons";
import TagGold from "./tagGold";
import { useNavigate } from "react-router-dom";

const CardUser = () => {
  const navigate = useNavigate();
  const userProfile = JSON.parse(localStorage.getItem("user_profile") || "null");
  const role = userProfile?.role || null;
  return (
    <div className="cardUser">
      <Avatar />
      <div className="user-name">SenTrip</div>

      <div className="hangvang">
        <TagGold />
      </div>

      <div
        className="update-info"
        onClick={() => navigate("/profile")}
      >
        Cập nhật thông tin cá nhân <RightOutlined style={{ marginTop: "3px" }} />
      </div>

      {role !== "CUSTOME" && (
        <div
          className="update-info"
          onClick={() => navigate("/admin")}
        >
          Truy cập trang admin <RightOutlined style={{ marginTop: "3px" }} />
        </div>
      )}
    </div>
  );
};

export default CardUser;
import { Avatar } from "antd";
import { RightOutlined } from "@ant-design/icons";
import TagGold from "./tagGold";
import { useNavigate } from "react-router-dom";

const CardUser = () => {
  const navigate = useNavigate();
  return (
    <div className="cardUser">
      <Avatar />
      <div className="user-name">SenTrip</div>

      <div className="hangvang">
        <TagGold />
      </div>

      <div className="update-info" onClick={()=> navigate("/profile")}>
        Cập nhật thông tin cá nhân <RightOutlined style={{marginTop:'3px'}}/>
      </div>
    </div>
  );
};

export default CardUser;

import { Avatar } from "antd";
import { RightOutlined } from "@ant-design/icons";
import TagGold from "./tagGold";

const CardUser = () => {
  return (
    <div className="cardUser">
      <Avatar />
      <div className="user-name">SenTrip</div>

      <div className="hangvang">
        <TagGold />
      </div>

      <div className="update-info">
        Cập nhật thông tin cá nhân <RightOutlined style={{marginTop:'3px'}}/>
      </div>
    </div>
  );
};

export default CardUser;

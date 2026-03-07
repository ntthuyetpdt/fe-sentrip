import { Link, useLocation } from "react-router-dom";
import routes from "../../router/router";
import { LogoutOutlined } from "@ant-design/icons";

const MenuCustom = () => {
  const location = useLocation();
  const removeUserProfile = () => {
    localStorage.removeItem("user_profile");
    localStorage.removeItem("access_token")
    window.location.href = '/'
  };
  return (
    <nav className="custom-menu">
      <ul className="custom-menu__list desktopMenu">
        {routes
          .filter((r) => r.showInMenu)
          .map((item) => (
            <li
              key={item.path}
              className={location.pathname === item.path ? "active" : ""}
            >
              <Link to={item.path}>
                {item.icon}
                {item.name}
              </Link>
            </li>
          ))}
        <li
          className="logout"
           onClick={removeUserProfile}
        >
          <LogoutOutlined /> Đăng xuất
        </li>
      </ul>
    </nav>
  );
};

export default MenuCustom;

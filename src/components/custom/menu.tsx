import { Link, useLocation } from "react-router-dom";
import routes from "../../router/router";

const MenuCustom = () => {
  const location = useLocation();

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
      </ul>
    </nav>
  );
};

export default MenuCustom;

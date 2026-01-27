import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Drawer, Button } from "antd";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import type { AppRoute } from "../../router/router";

interface Props {
  menu: AppRoute[];
}

const MenuCustom: React.FC<Props> = ({ menu }) => {
  const location = useLocation();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const toggleDrawer = () => setDrawerVisible(!drawerVisible);

  return (
    <nav className="custom-menu">
      <ul className="custom-menu__list desktopMenu">
        {menu.map((item) => (
          <li
            key={item.path}
            className={location.pathname === item.path ? "active" : ""}
          >
            <Link to={item.path}>{item.name}</Link>
          </li>
        ))}
      </ul>

      <Button
        className="custom-menu__hamburger"
        type="text"
        icon={<MenuOutlined style={{ color: 'white' }} />}
        onClick={toggleDrawer}
      />

      <Drawer
        closable={false}
        title={null}
        headerStyle={{ display: "none" }}
        placement="right"
        onClose={toggleDrawer}
        open={drawerVisible}
        closeIcon={<CloseOutlined />}
        width="70vw"
      >
        <ul className="custom-menu__list">
          {menu.map((item) => (
            <li
              key={item.path}
              className={location.pathname === item.path ? "active" : ""}
              onClick={toggleDrawer}
            >
              <Link to={item.path}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </Drawer>
    </nav>
  );
};

export default MenuCustom;

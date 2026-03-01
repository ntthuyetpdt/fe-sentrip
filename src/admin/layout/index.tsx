import React, { useState, useEffect } from "react";
import {
  HomeOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../assets/logo.png";

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

interface AdminLayoutProps {
  children: React.ReactNode;
  breadcrumb?: { title: string }[];
}

const AdminLayout = ({
  children,
  breadcrumb = [],
}: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);

  const [siderWidth, setSiderWidth] = useState<number>(() => {
    const saved = localStorage.getItem("admin_sider_width");
    return saved ? Number(saved) : 240;
  });

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    localStorage.setItem("admin_sider_width", String(siderWidth));
  }, [siderWidth]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();

    const startX = e.clientX;
    const startWidth = siderWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);

      if (newWidth >= 180 && newWidth <= 420) {
        setSiderWidth(newWidth);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const menuMap: Record<string, string> = {
    admin: "/admin",
    account: "/admin/tai-khoan-va-phan-quyen",
    addAccount: "/admin/them-tai-khoan",
  };

  const menuItems: MenuItem[] = [
    { key: "admin", icon: <HomeOutlined />, label: "Trang chủ" },
    {
      key: "account",
      icon: < UserOutlined />,
      label: "Tài khoản và phân quyền",
    },
    {
      key: "addAccount",
      icon: < UserAddOutlined />,
      label: "Thêm tài khoản",
    },
  ];

  const selectedKey =
    Object.entries(menuMap)
      .sort((a, b) => b[1].length - a[1].length)
      .find(([_, path]) => location.pathname.startsWith(path))
    ?.[0] || "admin";

  return (
    <Layout className="admin-layout">
      <Sider
        width={collapsed ? 80 : siderWidth}
        collapsedWidth={80}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className="admin-sider"
      >
        <div className="admin-logo">
          <img src={Logo} alt="logo" />
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(menuMap[key as string])}
        />

        {!collapsed && (
          <div
            className="resize-handle"
            onMouseDown={handleMouseDown}
          />
        )}
      </Sider>

      <Layout>
        <Header
          className="admin-header"
          style={{
            background: colorBgContainer,
            fontWeight: 600,
          }}
        >
          Admin Panel
        </Header>

        <Content className="admin-content-wrapper">
          {breadcrumb.length > 0 && (
            <Breadcrumb
              style={{ margin: "16px 0" }}
              items={breadcrumb}
            />
          )}

          <div
            className="admin-content-box"
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;

import React, { useState, useEffect } from "react";
import {
  HomeOutlined,
  ShopOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  BarChartOutlined,
  
  StarOutlined,
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
    // dashboard: "/admin/tong-quan",
    // merchant: "/admin/merchant",
    // service: "/admin/dich-vu",
    // serviceOpen: "/admin/dich-vu-mo-ban",
    // orderList: "/admin/don-hang/danh-sach",
    // sellerPayment: "/admin/don-hang/thanh-toan-nha-ban",
    // customerPayment: "/admin/don-hang/thanh-toan-khach-hang",
    // invoice: "/admin/hoa-don",
    // report: "/admin/bao-cao",
    account: "/admin/tai-khoan-va-phan-quyen",
    // review: "/admin/danh-gia",
  };

  const menuItems: MenuItem[] = [
    // { key: "dashboard", icon: <HomeOutlined />, label: "Tổng quan" },
    // { key: "merchant", icon: <ShopOutlined />, label: "Quản lý merchant" },
    // { key: "service", icon: <AppstoreOutlined />, label: "Quản lý dịch vụ" },
    // {
    //   key: "serviceOpen",
    //   icon: <AppstoreOutlined />,
    //   label: "Quản lý dịch vụ mở bán",
    // },
    // {
    //   key: "order",
    //   icon: <ShoppingCartOutlined />,
    //   label: "Quản lý đơn hàng",
    //   children: [
    //     { key: "orderList", label: "Danh sách đơn hàng" },
    //     { key: "sellerPayment", label: "Thanh toán nhà bán" },
    //     { key: "customerPayment", label: "Thanh toán khách hàng" },
    //   ],
    // },
    // { key: "invoice", icon: <FileTextOutlined />, label: "Quản lý hóa đơn" },
    // { key: "report", icon: <BarChartOutlined />, label: "Báo cáo & đối soát" },
    {
      key: "account",
      icon: < UserOutlined/>,
      label: "Tài khoản và phân quyền",
    },
    // { key: "review", icon: <StarOutlined />, label: "Quản lý đánh giá" },
  ];

  const selectedKey =
    Object.keys(menuMap).find((key) =>
      location.pathname.startsWith(menuMap[key])
    ) || "dashboard";

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

        {/* 👉 Thanh resize */}
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

import React, { useState } from "react";
import {
  HomeOutlined,
  ShopOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  BarChartOutlined,
  SettingOutlined,
  StarOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from '../../assets/logo.png';
const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

interface AdminLayoutProps {
  children: React.ReactNode;
  breadcrumb?: { title: string }[];
}

const AdminLayout = ({
  children,
  breadcrumb = [],
}: AdminLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuMap: Record<string, string> = {
    dashboard: "/admin/tong-quan",
    merchant: "/admin/merchant",
    service: "/admin/dich-vu",
    serviceOpen: "/admin/dich-vu-mo-ban",

    orderList: "/admin/don-hang/danh-sach",
    sellerPayment: "/admin/don-hang/thanh-toan-nha-ban",
    customerPayment: "/admin/don-hang/thanh-toan-khach-hang",

    invoice: "/admin/hoa-don",
    report: "/admin/bao-cao",
    account: "/admin/tai-khoan",
    review: "/admin/danh-gia",
  };


  const menuItems: MenuItem[] = [
    { key: "dashboard", icon: <HomeOutlined />, label: "Tổng quan" },
    { key: "merchant", icon: <ShopOutlined />, label: "Quản lý merchant" },
    { key: "service", icon: <AppstoreOutlined />, label: "Quản lý dịch vụ" },
    {
      key: "serviceOpen",
      icon: <AppstoreOutlined />,
      label: "Quản lý dịch vụ mở bán",
    },
    {
      key: "order",
      icon: <ShoppingCartOutlined />,
      label: "Quản lý đơn hàng",
      children: [
        {
          key: "orderList",
          label: "Danh sách đơn hàng",
        },
        {
          key: "sellerPayment",
          label: "Thanh toán nhà bán",
        },
        {
          key: "customerPayment",
          label: "Thanh toán khách hàng",
        },
      ],
    },
    {
      key: "invoice",
      icon: <FileTextOutlined />,
      label: "Quản lý hóa đơn",
    },
    {
      key: "report",
      icon: <BarChartOutlined />,
      label: "Báo cáo & đối soát",
    },
    {
      key: "account",
      icon: <SettingOutlined />,
      label: "Tài khoản và phân quyền",
    },
    {
      key: "review",
      icon: <StarOutlined />,
      label: "Quản lý đánh giá",
    },
  ];


  const selectedKey =
    Object.keys(menuMap).find((key) =>
      location.pathname.startsWith(menuMap[key])
    ) || "dashboard";

    
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
      >
        <div style={{display:'flex', justifyContent:'center'}}>
          <img src={Logo} style={{height:'50px'}}/>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(menuMap[key as string])}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 16px",
            background: colorBgContainer,
            fontWeight: 600,
          }}
        >
          Admin Panel
        </Header>

        <Content style={{ margin: "16px 16px" }}>
          {breadcrumb.length > 0 && (
            <Breadcrumb
              style={{ margin: "16px 0" }}
              items={breadcrumb}
            />
          )}

          <div
            style={{
              padding: 24,
              minHeight: 360,
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

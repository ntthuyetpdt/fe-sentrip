import React, { useState, useEffect } from "react";
import {
  HomeOutlined,
  UserAddOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  DollarCircleOutlined,
  IdcardOutlined,
  LineChartOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme, Avatar, Dropdown, Space } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../assets/logo.png";

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

interface AdminLayoutProps {
  children: React.ReactNode;
  breadcrumb?: { title: string }[];
}

const AdminLayout = ({ children, breadcrumb = [] }: AdminLayoutProps) => {
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

  const userProfile = JSON.parse(localStorage.getItem("user_profile") || "{}");
  const role = userProfile?.role;

  /* ================= USER MENU ================= */

  const userMenu: MenuProps["items"] = [
    {
      key: "profile",
      label: "Trang cá nhân",
    },
    {
      key: "logout",
      label: "Đăng xuất",
    },
  ];

  const handleUserMenu: MenuProps["onClick"] = ({ key }) => {
    if (key === "profile") {
      navigate("/profile");
    }

    if (key === "logout") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_profile");
      navigate("/login");
    }
  };

  /* ================= MENU ROLE ================= */

  const adminMenu: MenuItem[] = [
    { key: "admin", icon: <HomeOutlined />, label: "Trang ADMIN" },
    {
      key: "addAccount",
      icon: <UserAddOutlined />,
      label: "Thêm tài khoản",
    },
    {
      key: "account",
      icon: <UserOutlined />,
      label: "Tài khoản nhân viên",
    },
    {
      key: "accountCutomer",
      icon: <UserOutlined />,
      label: "Tài khoản khách hàng",
    },
    {
      key: "accountMerchant",
      icon: <UserOutlined />,
      label: "Tài khoản nhà phân phối",
    },
    {
      key: "adminDoanhThu",
      icon: <LineChartOutlined />,
      label: "Thông số doanh thu",
    },
    {
      key: "nv_ql_infor_pro",
      icon: <IdcardOutlined />,
      label: "Danh sách đơn hàng",
    },
  ];

  const employeeMenu: MenuItem[] = [
    { key: "admin", icon: <HomeOutlined />, label: "Trang nhân viên" },
    {
      key: "nv_ql_infor_pro",
      icon: <IdcardOutlined />,
      label: "Danh sách đơn hàng",
    },
    {
      key: "NV_TrangThaiTien",
      icon: <ExportOutlined />,
      label: "Báo cáo và đối soát",
    },
  ];

  const supplierMenu: MenuItem[] = [
    { key: "admin", icon: <HomeOutlined />, label: "Trang nhà cung cấp" },
    {
      key: "merchant",
      icon: <UserOutlined />,
      label: "Thông tin người đặt",
    },
    {
      key: "merchant_product",
      icon: <ShoppingCartOutlined />,
      label: "Quản lí dịch vụ",
    },
    {
      key: "merchant_total",
      icon: <LineChartOutlined />,
      label: "Quản lí doanh thu",
    },
    {
      key: "merchant_total_pro",
      icon: <DollarCircleOutlined />,
      label: "Quản lí doanh thu sản phẩm",
    },
    {
      key: "merchant_TrangThaiTien",
      icon: <ExportOutlined />,
      label: "Báo cáo và đối soát",
    },
  ];

  const accountantMenu: MenuItem[] = [
    { key: "admin", icon: <HomeOutlined />, label: "Trang kế toán" },
    {
      key: "payments",
      icon: <ShoppingCartOutlined />,
      label: "Quản lý thanh toán",
    },
    {
      key: "pay",
      icon: <ExportOutlined />,
      label: "Đi đơn cho NPP",
    },
  ];

  const menuMap: Record<string, string> = {
    admin: "/admin",
    account: "/admin/tai-khoan-va-phan-quyen",
    addAccount: "/admin/them-tai-khoan",
    accountCutomer: "/admin/tai-khoan-khach-hang",
    accountMerchant: "/admin/tai-khoan-nha-phan-phoi",
    adminDoanhThu: "/admin/doanh-thu",

    merchant: "/merchant/quan-li-infor",
    merchant_product: "/merchant/quan-li-san-pham",
    merchant_total: "/merchant/quan-li-doanh-thu",
    merchant_total_pro: "/merchant/quan-li-doanh-thu-san-pham",
    merchant_TrangThaiTien: "/merchant/bao-cao",

    customer: "/admin/khach-hang",
    orders: "/admin/don-hang",

    nv_ql_infor_pro: "/employee/ql-infor-pro",
    NV_TrangThaiTien: "/employee/bao-cao",

    payments: "/ke-toan/thanh-toan",
    pay: "/ke-toan/di-don",
  };

  const menuByRole: Record<string, MenuItem[]> = {
    ADMIN: adminMenu,
    EMPLOYEE: employeeMenu,
    MERCHANT: supplierMenu,
    ACCOUNTANT: accountantMenu,
  };

  const menuItems = menuByRole[role] || [];

  const selectedKey =
    Object.entries(menuMap)
      .sort((a, b) => b[1].length - a[1].length)
      .find(([_, path]) => location.pathname.startsWith(path))
      ?.[0] || "admin";

  const headerTitleMap: Record<string, string> = {
    ADMIN: "Admin",
    EMPLOYEE: "Nhân viên",
    MERCHANT: "Nhà cung cấp",
    ACCOUNTANT: "Kế toán",
  };

  const headerTitle = headerTitleMap[role] || "Dashboard";

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
        <div className="admin-logo" onClick={() => navigate("/admin")}>
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
          <div className="resize-handle" onMouseDown={handleMouseDown} />
        )}
      </Sider>

      <Layout>
        <Header
          className="admin-header"
          style={{
            background: colorBgContainer,
            fontWeight: 600,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>{headerTitle}</div>

          <Dropdown
            menu={{ items: userMenu, onClick: handleUserMenu }}
            trigger={["hover"]}
          >
            <Space style={{ cursor: "pointer" }}>
              <Avatar icon={<UserOutlined />} />
            </Space>
          </Dropdown>
        </Header>

        <Content className="admin-content-wrapper">
          {breadcrumb.length > 0 && (
            <Breadcrumb style={{ margin: "16px 0" }} items={breadcrumb} />
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
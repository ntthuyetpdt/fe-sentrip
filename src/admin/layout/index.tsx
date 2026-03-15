import React, { useState, useEffect } from "react";
import {
  HomeOutlined,
  UserAddOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  DollarCircleOutlined,
  IdcardOutlined,
  LineChartOutlined,
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

  // menu admin
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
  ];

  //menu nhan vien
  const employeeMenu: MenuItem[] = [
    { key: "admin", icon: <HomeOutlined />, label: "Trang nhân viên" },
    // {
    //   key: "customer",
    //   icon: <UserOutlined />,
    //   label: "Danh sách khách hàng",
    // },
    {
      key: "nv_ql_infor_pro",
      icon: <IdcardOutlined />,
      label: "Danh sách đơn hàng",
    },
  ];

  //menu nha phan phoi
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
      icon: <DollarCircleOutlined />,
      label: "Quản lí doanh thu",
    },
    {
      key: "merchant_total_pro",
      icon: <DollarCircleOutlined />,
      label: "Quản lí doanh thu sản phẩm",
    },
  ];

  //menu ke toan
  const accountantMenu: MenuItem[] = [
    { key: "admin", icon: <HomeOutlined />, label: "Trang kế toán" },
    {
      key: "payments",
      icon: <ShoppingCartOutlined />,
      label: "Quản lý thanh toán",
    },
  ];


  const menuMap: Record<string, string> = {
    //admin router
    admin: "/admin",
    account: "/admin/tai-khoan-va-phan-quyen",
    addAccount: "/admin/them-tai-khoan",
    accountCutomer: "/admin/tai-khoan-khach-hang",
    accountMerchant: "/admin/tai-khoan-nha-phan-phoi",
    adminDoanhThu: "/admin/doanh-thu",
    //nha phan phoi router
    merchant: "/merchant/quan-li-infor",
    merchant_product: "/merchant/quan-li-san-pham",
    merchant_total: "/merchant/quan-li-doanh-thu",
    merchant_total_pro: "/merchant/quan-li-doanh-thu-san-pham",
    //customer router
    customer: "/admin/khach-hang",
    orders: "/admin/don-hang",
    payments: "/admin/thanh-toan",

    // nhan vien router
    nv_ql_infor_pro: "/employee/ql-infor-pro"


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
    SUPPLIER: "Nhà cung cấp",
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
        <div className="admin-logo" onClick={() => navigate('/')}>
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
          }}
        >
          {headerTitle}
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
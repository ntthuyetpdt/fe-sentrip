import { lazy } from "react";
import {
  HomeOutlined,
  FileTextOutlined,
  HeartOutlined,
  SettingOutlined,
  StarOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import BaseUrl from "./path";
import MainLayout from "../components/layout/mainLayout";
import MainLayoutAdmin from "../admin/layout";

const Home = lazy(() => import("../page/QuanLiDonHang/index"));
const DetailsVe = lazy(() => import("../page/DetailsVe/index"));
const QuanLiNhanVien = lazy(() => import("../admin/page/quanLiNhanVien"));
export interface AppRoute {
  name: string;
  path: string;
  component: React.ComponentType<any>;
  layout?: React.ComponentType<any>;
  showInMenu?: boolean;
  private: boolean;
  icon?: React.ReactNode;
}
const routes = [
  {
    name: "Ưu đãi của tôi",
    path: BaseUrl.Home,
    component: Home,
    layout: MainLayout,
    showInMenu: true,
    private: false,
    icon: <HomeOutlined />,
  },
  {
    name: "Đơn hàng của tôi",
    path: "/orders",
    component: Home,
    layout: MainLayout,
    showInMenu: true,
    private: false,
    icon: <FileTextOutlined />,
  },
  {
    name: "Danh sách yêu thích",
    path: "/favorite",
    component: Home,
    layout: MainLayout,
    showInMenu: true,
    private: false,
    icon: <HeartOutlined />,
  },
  {
    name: "Cài đặt",
    path: "/setting",
    component: Home,
    layout: MainLayout,
    showInMenu: true,
    private: false,
    icon: <SettingOutlined />,
  },
  {
    name: "Đánh giá dịch vụ",
    path: "/rating",
    component: Home,
    layout: MainLayout,
    showInMenu: true,
    private: false,
    icon: <StarOutlined />,
  },
  {
    name: "Khoảnh khắc du lịch",
    path: "/moment",
    component: Home,
    layout: MainLayout,
    showInMenu: true,
    private: false,
    icon: <CameraOutlined />,
  },
  {
    name: "Chi tiết vé",
    path: "/details",
    component: DetailsVe,
    layout: MainLayout,
    showInMenu: false,
    private: false,
    icon: null,
  },
  {
    name: "Chi tiết vé",
    path: BaseUrl.QuanLiNhanVien,
    component: QuanLiNhanVien,
    layout: MainLayoutAdmin,
    showInMenu: false,
    private: false,
    icon: null,
  },
];

export default routes;

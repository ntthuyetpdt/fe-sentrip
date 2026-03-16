import { lazy } from "react";
import {
  HomeOutlined,
  FileTextOutlined,
  IdcardOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import BaseUrl from "./path";
import MainLayout from "../components/layout/mainLayout";
import MainLayoutAdmin from "../admin/layout";

const Login = lazy(() => import("../page/Login/index"));
const Home = lazy(() => import("../page/AllTicket/index"));
const DetailsVe = lazy(() => import("../page/DetailsVe/index"));
const HomeAdmin = lazy(() => import("../admin/page/ManADMIN/home"));
const QuanLiNhanVien = lazy(() => import("../admin/page/ManADMIN/taiKhoanVaPhanQuyen"));
const AddAccount = lazy(() => import("../admin/page/ManADMIN/addAcc"));
const Profile = lazy(() => import("../page/Profile/index"));
const QuanLiDonHang = lazy(() => import("../page/QuanLiDonHang/index"));
const MyTicket = lazy(() => import("../page/MyTicket/index"));
const MyCart = lazy(() => import("../page/Cart/index"));
const NhaPhanPhoi = lazy(() => import("../admin/page/ManPhanPhoi/qlInfor"));
const NhaPhanPhoiPro = lazy(() => import("../admin/page/ManPhanPhoi/qlPro"));
const NhaPhanPhoiDoanhThu = lazy(() => import("../admin/page/ManPhanPhoi/doanhThu"));
const NhaPhanPhoiDoanhThuSP = lazy(() => import("../admin/page/ManPhanPhoi/dtProduct"));
const NhaPhanPhoiBaoCao = lazy(() => import("../admin/page/ManPhanPhoi/trangThaiTien"));
const NVQLPRO = lazy(() => import("../admin/page/ManNV/InforPro"));
const AccountCutomer = lazy(() => import("../admin/page/ManADMIN/GetKhachHang"));
const AccountMerchant = lazy(() => import("../admin/page/ManADMIN/GetMerchant"));
const AdminDT = lazy(() => import("../admin/page/ManADMIN/doanhThuAdmin"));
const KeToanQLThanhToan = lazy(() => import("../admin/page/ManKeToan/quanLiThanhToan"));
const NVBAOCAO = lazy(() => import("../admin/page/ManNV/baoCao"));
const KETOANDIDON = lazy(() => import("../admin/page/ManKeToan/quanLiDiDon"));
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
    name: "Trang chủ",
    path: BaseUrl.Home,
    component: Home,
    layout: MainLayout,
    showInMenu: true,
    private: true,
    icon: <HomeOutlined />,
  },
  {
    name: "Đơn hàng của tôi",
    path: BaseUrl.Oder,
    component: QuanLiDonHang,
    layout: MainLayout,
    showInMenu: true,
    private: false,
    icon: <FileTextOutlined />,
  },
  {
    name: "Giỏ hàng của tôi",
    path: BaseUrl.MyCart,
    component: MyCart,
    layout: MainLayout,
    showInMenu: true,
    private: false,
    icon: <ShoppingCartOutlined />,
  },
  {
    name: "Vé của tôi",
    path: BaseUrl.MyTicket,
    component: MyTicket,
    layout: MainLayout,
    showInMenu: true,
    private: true,
    icon: <IdcardOutlined />,
  },
  // {
  //   name: "Danh sách yêu thích",
  //   path: "/favorite",
  //   component: Home,
  //   layout: MainLayout,
  //   showInMenu: true,
  //   private: false,
  //   icon: <HeartOutlined />,
  // },
  // {
  //   name: "Cài đặt",
  //   path: "/setting",
  //   component: Home,
  //   layout: MainLayout,
  //   showInMenu: true,
  //   private: false,
  //   icon: <SettingOutlined />,
  // },
  // {
  //   name: "Đánh giá dịch vụ",
  //   path: "/rating",
  //   component: Home,
  //   layout: MainLayout,
  //   showInMenu: true,
  //   private: false,
  //   icon: <StarOutlined />,
  // },
  // {
  //   name: "Khoảnh khắc du lịch",
  //   path: "/moment",
  //   component: Home,
  //   layout: MainLayout,
  //   showInMenu: true,
  //   private: false,
  //   icon: <CameraOutlined />,
  // },
  {
    name: "Chi tiết vé",
    path: BaseUrl.DetailVe,
    component: DetailsVe,
    layout: MainLayout,
    showInMenu: false,
    private: false,
    icon: null,
  },
  {
    name: null,
    path: BaseUrl.Profile,
    component: Profile,
    layout: null,
    showInMenu: false,
    private: false,
    icon: null,
  },
  {
    name: null,
    path: BaseUrl.Login,
    component: Login,
    layout: null,
    showInMenu: false,
    private: false,
    icon: null,
  },
  {
    name: null,
    path: BaseUrl.QuanLiNhanVien,
    component: QuanLiNhanVien,
    layout: MainLayoutAdmin,
    showInMenu: false,
    private: true,
    icon: null,
  },
  {
    name: null,
    path: BaseUrl.HomeAdmin,
    component: HomeAdmin,
    layout: MainLayoutAdmin,
    showInMenu: false,
    private: true,
    icon: null,
  },
  {
    name: null,
    path: BaseUrl.AddAccount,
    component: AddAccount,
    layout: MainLayoutAdmin,
    showInMenu: false,
    private: true,
    icon: null,
  },
  {
    name: null,
    path: BaseUrl.AccountCutomer,
    component: AccountCutomer,
    layout: MainLayoutAdmin,
    showInMenu: false,
    private: true,
    icon: null,
  },
  {
    name: null,
    path: BaseUrl.AccountMerchant,
    component: AccountMerchant,
    layout: MainLayoutAdmin,
    showInMenu: false,
    private: true,
    icon: null,
  },
  {
    name: null,
    path: BaseUrl.AdminDT,
    component: AdminDT,
    layout: MainLayoutAdmin,
    showInMenu: false,
    private: true,
    icon: null,
  },
  // nha phan phoi
  {
    name: null,
    path: BaseUrl.NhaPhanPhoi,
    component: NhaPhanPhoi,
    layout: MainLayoutAdmin,
    showInMenu: false,
    private: true,
    icon: null,
  },
  {
    name: null,
    path: BaseUrl.NhaPhanPhoiPro,
    component: NhaPhanPhoiPro,
    layout: MainLayoutAdmin,
    showInMenu: false,
    private: true,
    icon: null,
  },
  {
    name: null,
    path: BaseUrl.NhaPhanPhoiDoanhThu,
    component: NhaPhanPhoiDoanhThu,
    layout: MainLayoutAdmin,
    showInMenu: false,
    private: true,
    icon: null,
  },
  {
    name: null,
    path: BaseUrl.NhaPhanPhoiDoanhThuSP,
    component: NhaPhanPhoiDoanhThuSP,
    layout: MainLayoutAdmin,
    showInMenu: false,
    private: true,
    icon: null,
  },
  {
    name: null,
    path: BaseUrl.NhaPhanPhoiBaoCao,
    component: NhaPhanPhoiBaoCao,
    layout: MainLayoutAdmin,
    showInMenu: false,
    private: true,
    icon: null,
  },
  // NHAN VIEN 
  {
    name: null,
    path: BaseUrl.NVQLPRO,
    component: NVQLPRO,
    layout: MainLayoutAdmin,
    showInMenu: false,
    private: true,
    icon: null,
  },
  {
    name: null,
    path: BaseUrl.NVBAOCAO,
    component: NVBAOCAO,
    layout: MainLayoutAdmin,
    showInMenu: false,
    private: true,
    icon: null,
  },
  // kees toan
  {
    name: null,
    path: BaseUrl.KeToanQLThanhToan,
    component: KeToanQLThanhToan,
    layout: MainLayoutAdmin,
    showInMenu: false,
    private: true,
    icon: null,
  },
    {
    name: null,
    path: BaseUrl.KETOANDIDON,
    component: KETOANDIDON,
    layout: MainLayoutAdmin,
    showInMenu: false,
    private: true,
    icon: null,
  },
];

export default routes;

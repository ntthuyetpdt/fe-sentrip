import { lazy } from "react";
import BaseUrl from "./path";
import MainLayout from "../components/layout/mainLayout";

const Home = lazy(() => import("../page/Home/index"));
// const ImgPrompt = lazy(() => import("../page/img-prompt"));
// const TrendingPrompt = lazy(() => import("../page/trending/index"));
// const DongGop = lazy(() => import("../page/dongGop"));
// const Login = lazy(() => import("../components/Login/Login/login"));
// const Admin = lazy(() => import("../Admin/admin"));
export interface AppRoute {
  name: string;
  path: string;
  component: React.ComponentType<any>;
  layout?: React.ComponentType<any>;
  showInMenu?: boolean;
  private: boolean
}

const routes: AppRoute[] = [
  {
    name: "Trang chủ",
    path: BaseUrl.Home,
    component: Home,
    layout: MainLayout,
    showInMenu: true,
    private: false,
  },
  // {
  //   name: "Trending",
  //   path: BaseUrl.TrendingPrompt,
  //   component: TrendingPrompt,
  //   layout: MainLayout,
  //   showInMenu: true,
  //   private: false,
  // },
  // {
  //   name: "Tạo ảnh",
  //   path: BaseUrl.ImgPrompt,
  //   component: ImgPrompt,
  //   layout: MainLayout,
  //   showInMenu: true,
  //   private: false,
  // },
  // {
  //   name: "Đóng góp",
  //   path: BaseUrl.DongGop,
  //   component: DongGop,
  //   layout: MainLayout,
  //   showInMenu: true,
  //   private: false,
  // },
  // {
  //   name: "Login",
  //   path: BaseUrl.Login,
  //   component: Login,
  //   layout: Login,
  //   showInMenu: false,
  //   private: false,
  // },
  // {
  //   name: "Admin",
  //   path: BaseUrl.Admin,
  //   component: MainLayout,
  //   layout: Admin,
  //   showInMenu: false,
  //   private: false,
  // }

];

export default routes;

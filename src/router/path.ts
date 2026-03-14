const BaseUrl = {
  //user
  Home: `/`,
  DetailVe: `details/:id`,
  Profile: `profile`,
  Login: `/login`,
  Oder: `/orders`,
  MyTicket:`/myticket`,
  MyCart: `/my-cart`,
  //admin
  HomeAdmin: `/admin`,
  QuanLiNhanVien: `/admin/tai-khoan-va-phan-quyen`,
  AddAccount: `/admin/them-tai-khoan`,
  AccountCutomer: "/admin/tai-khoan-khach-hang",
  AccountMerchant: "/admin/tai-khoan-nha-phan-phoi",
  AdminDT:"/admin/doanh-thu",
  // nha phan phoi
  NhaPhanPhoi: '/merchant/quan-li-infor',
  NhaPhanPhoiPro: "/merchant/quan-li-san-pham",
  NhaPhanPhoiDoanhThu: "/merchant/quan-li-doanh-thu",
  NhaPhanPhoiDoanhThuSP:'/merchant/quan-li-doanh-thu-san-pham',
  // nhan vien
  NVQLPRO: "/employee/ql-infor-pro"
};
export default BaseUrl;

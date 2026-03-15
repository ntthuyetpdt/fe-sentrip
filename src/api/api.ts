import axiosInstance from "./axios";

export async function getHanoiTemperature(): Promise<number> {
  const res = await fetch("https://wttr.in/Hanoi?format=j1");
  if (!res.ok) {
    throw new Error("Không lấy được dữ liệu thời tiết");
  }
  const data = await res.json();
  const tempC = Number(data.current_condition[0].temp_C);
  return tempC;
}

export const getProfile = async () => {
  const res = await axiosInstance.get("/user/profile");
  return res.data;
};

export const viewProduct = async () => {
  const res = await axiosInstance.get("/product");
  return res.data;
};

export const orderTicket = async (body: any) => {
  const res = await axiosInstance.post("/order/create", body);
  return res.data;
};

export const oderUser = async () => {
  const res = await axiosInstance.get("/order/my");
  return res.data;
};


export const AddAccount = async (body: any) => {
  const res = await axiosInstance.post(`/user`, body);
  return res.data;
};


export const getDetails = async (oderCode: any) => {
  const res = await axiosInstance.get(`/order/detail/${oderCode}`);
  return res.data;
};


export const getQr = async (body: any) => {
  const res = await axiosInstance.post(`/payments`, body);
  return res.data;
};


export const searchProduct = async (productName?: string, address?: string, price?: string) => {
  let query = "";

  if (productName) {
    query += `productName=${encodeURIComponent(productName)}`;
  }

  if (address) {
    query += `${query ? "&" : ""}address=${encodeURIComponent(address)}`;
  }

  if (price) {
    query += `${query ? "&" : ""}price=${encodeURIComponent(price)}`;
  }

  const url = query ? `/product/search?${query}` : `/product/search`;

  const res = await axiosInstance.get(url);
  return res.data;
};


export const addCart = async (body: any) => {
  const res = await axiosInstance.post(`/cart/oder`, body);
  return res.data;
};

export const viewCard = async () => {
  const res = await axiosInstance.get(`/cart/my`);
  return res.data;
};

export const deleteCart = async (cartItemId: any) => {
  const res = await axiosInstance.post(`/cart/delete/${cartItemId}`);
  return res.data;
};

export const confirmPay = async (id: any) => {
  const res = await axiosInstance.post(`/payments/confirmation?url=${id}`);
  return res.data;
};

export const myTicket = async () => {
  const res = await axiosInstance.get("/customer/ticketsMy");
  return res.data;
};


//admin
export const getEmployee = async () => {
  const res = await axiosInstance.get("/employee/getall");
  return res.data;
};

export const createEmployee = async (body: any) => {
  return axiosInstance.post(`/employee/create`, body);
};

export const searchEmployee = async (params: any) => {
  const res = await axiosInstance.get("/employee/search", {
    params,
  });
  return res.data;
};

export const editEmployee = async (id: number, body: any) => {
  return axiosInstance.post(`/employee/update/${id}`, body);
};

export const deleteEmployee = async (id: number) => {
  const res = await axiosInstance.post(
    `/employee/delete/${id}`
  );
  return res.data;
};


export const getCustomer = async () => {
  const res = await axiosInstance.get("/customer/getall");
  return res.data;
};

export const searchCustomer = async (params: any) => {
  const res = await axiosInstance.get("/customer/search", {
    params,
  });
  return res.data;
};

export const getMechant = async () => {
  const res = await axiosInstance.get("/merchant");
  return res.data;
};

export const deleteMechant = async (id: any) => {
  const res = await axiosInstance.post(`/merchant/delete/${id}`);
  return res.data;
};

export const searchMechant = async (params: any) => {
  const res = await axiosInstance.get("/merchant/search", {
    params,
  });
  return res.data;
};

export const dashboardAdmin = async (body: any) => {
  const res = await axiosInstance.post("/dashboard/summary", body);
  return res.data;
};

export const dashboardAdminBD = async (body: any) => {
  const res = await axiosInstance.post("/dashboard/monthly-revenue", body);
  return res.data;
};


// đi đơn export
export const exportExcel = async () => {
  const res = await axiosInstance.get("/export/excel", {
    responseType: "arraybuffer",
  });
  return res.data;
};

export const exportPDF = async (orderCode: any) => {
  const res = await axiosInstance.get(`/export/bill/${orderCode}`);
  return res.data;
};
// nhà phân phối


export const viewProductSupplier = async () => {
  const res = await axiosInstance.get("/merchant/products");
  return res.data;
};

export const createProduct = async (body: any) => {
  const res = await axiosInstance.post("/product/create", body);
  return res.data;
};

export const updateProduct = async (id: any, body: any) => {
  const res = await axiosInstance.post(`/product/update/${id}`, body);
  return res.data;
};

export const deleteProduct = async (id: any) => {
  const res = await axiosInstance.post(`/product/delete/${id}`);
  return res.data;
};

export const searchProductMer = async (productName?: string, address?: string, price?: string) => {
  let query = "";

  if (productName) {
    query += `productName=${encodeURIComponent(productName)}`;
  }

  if (address) {
    query += `${query ? "&" : ""}address=${encodeURIComponent(address)}`;
  }

  if (price) {
    query += `${query ? "&" : ""}price=${encodeURIComponent(price)}`;
  }

  const url = query ? `/product/search?${query}` : `/product/search`;

  const res = await axiosInstance.get(url);
  return res.data;
};


export const viewCutomerOrdered = async () => {
  const res = await axiosInstance.get("/merchant/orders");
  return res.data;
};

export const viewMerchanTotal = async (body: any) => {
  const res = await axiosInstance.post("/merchant/dashboard", body);
  return res.data;
};

export const viewMerchanKHDetails = async (id: any) => {
  const res = await axiosInstance.get(`/merchant/detail/${id}`);
  return res.data;
};

export const viewMerProInfor = async () => {
  const res = await axiosInstance.get(`merchant/statistics`);
  return res.data;
};


// màn nhân viên 

export const viewInforPro = async () => {
  const res = await axiosInstance.get("/order/getall");
  return res.data;
};


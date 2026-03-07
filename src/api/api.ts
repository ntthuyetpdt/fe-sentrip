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
  const res = await axiosInstance.get("/product/viewproduct");
  return res.data;
};

export const orderTicket = async (body: any) => {
  const res = await axiosInstance.post("/order/create", body);
  return res.data;
};

export const oderUser = async () => {
  const res = await axiosInstance.get("/order/getuser");
  return res.data;
};


export const AddAccount = async (body: any) => {
  const res = await axiosInstance.post(`/user/create`, body);
  return res.data;
};


export const getDetails = async (oderCode: any) => {
  const res = await axiosInstance.get(`/order/detail/${oderCode}`);
  return res.data;
};


export const getQr = async (body: any) => {
  const res = await axiosInstance.post(`/payments/pay`, body);
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
  const res = await axiosInstance.post(`/cart/add`, body);
  return res.data;
};

export const viewCard = async () => {
  const res = await axiosInstance.get(`/cart/my-cart`);
  return res.data;
};

export const deleteCart = async (cartItemId: any) => {
  const res = await axiosInstance.delete(`/cart/delete/${cartItemId}`);
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


export const getEmployee = async () => {
  const res = await axiosInstance.get("/employee/getAll");
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

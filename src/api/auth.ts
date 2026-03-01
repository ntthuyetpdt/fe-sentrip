import axiosInstance from "./axios";

export const authLogin = async (body: any) => {
  const res = await axiosInstance.post(`/auth/login`, body);
  return res.data;
};

export const authRegister = async (body: any) => {
  const res = await axiosInstance.post(`/auth/register`, body);
  return res.data;
};


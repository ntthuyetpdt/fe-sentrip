// src/api/axiosInstance.ts
import { message } from "antd";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } 

    else if (config.data && typeof config.data === "object") {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    switch (status) {
      case 400:
        message.error("Lỗi hệ thống");
        break;

      case 401:
        // localStorage.clear();
        // message.error("Phiên đăng nhập hết hạn");
        // window.location.href = "/";
        break;

      case 404:
        message.error("Resource not found.");
        break;

      case 422:
        message.error(data?.message);
        break;

      case 500:
        message.error("Server error. Please try again later.");
        break;

      default:
        message.error("Có lỗi xảy ra.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
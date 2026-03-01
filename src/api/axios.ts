import { message, notification } from "antd";
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
        notification.error({
          message: data?.error || "Có lỗi xảy ra vui lòng thử lại sau",
        });
        break;

      case 401:
        localStorage.clear();
        break;

      case 403:
        message.error("You don't have permission to access this resource.");
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
        message.error("An error occurred. Please try again.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
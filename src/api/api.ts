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

export const AddAccount = async (body: any) => {
  const res = await axiosInstance.post(`/user/create`, body);
  return res.data;
};




export const getEmployee = async () => {
  const res = await axiosInstance.get("/employee/getAll");
  return res.data;
};

export const createEmployee = async ( body: any) => {
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
  const res = await axiosInstance.delete(
    `/employee/delete/${id}`
  );
  return res.data;
};

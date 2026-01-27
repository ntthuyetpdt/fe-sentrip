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



// export const dataTrending = async (body: any) => {
//   const res = await axiosInstance.post(`/api/search/post`, body);
//   return res.data;
// };


// export const getTopic = async () => {
//   const res = await axiosInstance.get("/api/posts/options");
//   return res.data;
// };


// export const creatPost = async (
//   body: Record<string, any>,
//   accessToken: string
// ) => {
//   const formData = new FormData();

//   Object.keys(body).forEach((key) => {
//     if (body[key] !== undefined && body[key] !== null) {
//       formData.append(key, body[key]);
//     }
//   });

//   const res = await axiosInstance.post(
//     "/api/create/post",
//     formData,
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "multipart/form-data",
//       },
//     }
//   );

//   return res.data;
// };

// export const deletePost = async (id: string, token: string) => {
//   const res = await axiosInstance.post(
//     `/api/delete/post/${id}`,
//     {},
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );
//   return res.data;
// };


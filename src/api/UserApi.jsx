import axiosInstance from "../axios";

export const getlistUser = async () => {
  try {
    const response = await axiosInstance.get("/api/user/allUser");
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/user/user/${id}`);
    console.log("response", response);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateUser = async (data) => {
  try {
    const response = await axiosInstance.put(`/api/user/userUpdate/`, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Trường hợp lỗi từ phía server (ví dụ: mã lỗi 4xx, 5xx)
      console.error("API error:", error.response.data);
      console.error("API status:", error.response.status);
      return { error: error.response.data, status: error.response.status };
    } else if (error.request) {
      // Trường hợp không nhận được phản hồi từ server
      console.error("No response received:", error.request);
      return { error: "No response from server" };
    } else {
      // Trường hợp lỗi khác (ví dụ: lỗi cấu hình)
      console.error("Error setting up request:", error.message);
      return { error: error.message };
    }
  }
};

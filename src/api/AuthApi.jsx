import axiosInstance from "../axios";

export const user_login = async (data) => {
  try {
    const response = await axiosInstance.post("/api/auth/login", data);
    return response;
  } catch (error) {
    return error.response.data;
  }
};

export const user_register = async (data) => {
  try {
    const response = await axiosInstance.post("api/auth/register", data);
    return response;
  } catch (error) {
    return error;
  }
};

export const user_logout = async () => {
  try {
    const response = await axiosInstance.post("api/auth/logout");
    return response;
  } catch (error) {
    return error;
  }
};

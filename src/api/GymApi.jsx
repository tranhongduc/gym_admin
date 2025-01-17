import axiosInstance from "../axios";

export const getlistGym = async () => {
  try {
    const response = await axiosInstance.get("/api/gym/gym");
    return response.data;
  } catch (error) {
    return error;
  }
};

export const addGym = async (data) => {
  try {
    const response = await axiosInstance.post("/api/gym/gym", data);
    return response.data;
  } catch (error) {
    return error;
  }
};

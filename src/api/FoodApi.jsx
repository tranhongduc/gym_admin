import axiosInstance from "../axios";

export const getlistFood = async () => {
  try {
    const response = await axiosInstance.get("/api/foods/foods");
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getFood = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/foods/food1/${id}`);
    return response.data.food;
  } catch (error) {
    return error;
  }
};

export const updateFood = async (id) => {
  try {
    const response = await axiosInstance.put(`/api/foods/food1/${id}`);
    return response.data.food;
  } catch (error) {
    return error;
  }
};

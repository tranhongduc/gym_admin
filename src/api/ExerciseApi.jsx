import axiosInstance from "../axios";

export const getlistExercise = async () => {
  try {
    const response = await axiosInstance.get("/api/exercises/exercisestoUser/");
    return response.data.data;
  } catch (error) {
    return error;
  }
};

export const getlistExercise1 = async (type) => {
  try {
    const response = await axiosInstance.get(
      `/api/exercises/exercises1/type/${type}`
    );
    return response.data.exercises;
  } catch (error) {
    return error;
  }
};

export const getExercise = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/exercises/exercises1/${id}`);
    return response.data.exercise;
  } catch (error) {
    return error;
  }
};

export const getSmallExercise1 = async (id) => {
  try {
    const response = await axiosInstance.get(
      `/API/small-exercises/small-exercises/${id}`
    );
    console.log("response", response.data);

    return response.data;
  } catch (error) {
    return error;
  }
};

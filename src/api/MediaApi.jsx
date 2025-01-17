import axiosInstance from "../axios";

export const UploadUser = async (data) => {
  try {
    const response = await axiosInstance.post("/api/media/uploadUser", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    return error;
  }
};

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// const endpointURL = 'http://13.208.42.6/';
const endpointURL = 'http://172.16.3.8:3000';



// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: endpointURL,
  timeout: 10 * 60 * 1000,
  headers: {
    "Content-Type": "application/json",
  },

});

AsyncStorage.getItem("accessToken").then((accessToken) => {
  if (!accessToken) {
      AsyncStorage.removeItem("accessToken");
  } else {
      axiosInstance.defaults.headers.common[
          "Authorization"
      ] = `Bearer ${accessToken}`;
  }
});

// axiosInstance.interceptors.request.use(
//   (config) => {
//     // const token = localStorage("accessToken");
//     // if (token) {
//     //   config.headers.Authorization = `Bearer ${token}`;
//     // }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

async function refreshAccessToken() {
  try {
      console.log("refreshing token");
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      const accessToken = await AsyncStorage.getItem("accessToken");
      const res = await axios.post(
          `${endpointURL}/api/auth/refresh`,
          {
              refreshToken: refreshToken,
          },
          {
              headers: {
                  Authorization: `Bearer ${accessToken}`,
              },
          }
      );

      if (res?.status === 200) {
          AsyncStorage.setItem("accessToken", res.data.accessToken);
          axiosInstance.defaults.headers.common[
              "Authorization"
          ] = `Bearer ${res.data.accessToken}`;
          return res.data.accessToken;
      }
  } catch (error) {
      console.log("error in here", error.message);
      if (error.response?.status === 400 || error.response?.status === 401) {
          console.log("failed here");
          return null;
      }
      throw error;
  }
}

axiosInstance.interceptors.response.use(
  (response) => {
      return response;
  },
  async (error) => {
      const originalRequest = error.config;
      if (
          error.response?.status === 401 &&
          error.response?.data?.message === "Unauthorized" &&
          !originalRequest._retry
      ) {
          console.log(originalRequest._retry);
          originalRequest._retry = true; // Prevent infinite retry loop

          console.log(
              "originalRequest after setting _retry:",
              originalRequest._retry
          );
          try {
              const newAccessToken = await refreshAccessToken();
              if (newAccessToken) {
                  originalRequest.headers[
                      "Authorization"
                  ] = `Bearer ${newAccessToken}`;
                  return axiosInstance(originalRequest);
              }
          } catch (error) {
              console.log("Failed to refresh token:", error);
              return Promise.reject(error); // Or throw a custom error
          }
      }
      else {
          return Promise.reject(error);
      }
  }
);

export default axiosInstance;

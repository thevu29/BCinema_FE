import axios from "axios";
import { refreshTokenService } from "../services/authService";
import { getAccessToken, saveToken, removeToken } from "../utils/tokenUtil";

const instance = axios.create({
  // baseURL: "http://localhost:8080/api",
  baseURL: "https://localhost:7263/api",
  withCredentials: true,
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    return response && response.data ? response.data : response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const resp = await refreshTokenService();

        saveToken(resp.data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${resp.data.accessToken}`;

        return instance(originalRequest);
      } catch (refreshError) {
        removeToken();
        return Promise.reject(refreshError);
      }
    }

    return error.response && error.response.data
      ? error.response.data
      : Promise.reject(error);
  }
);

export default instance;

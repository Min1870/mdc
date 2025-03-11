import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "@/config";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedRequestsQueue: Array<{
  resolve: () => void;
  reject: (error: unknown) => void;
}> = [];

apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            resolve: () => resolve(apiClient(originalRequest)),
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        const randToken = await SecureStore.getItemAsync("randToken");

        const { data } = await axios.post(
          `${API_URL}refresh-token`,
          {
            refreshToken,
            randToken,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer 123abc",
            },
          },
        );

        await SecureStore.setItemAsync("token", data.token);
        await SecureStore.setItemAsync("refreshToken", data.refreshToken);
        await SecureStore.setItemAsync("randToken", data.randToken);

        apiClient.defaults.headers.common.Authorization = `Bearer ${data.token}`;

        failedRequestsQueue.forEach(({ resolve }) => resolve());
        failedRequestsQueue = [];

        return apiClient(originalRequest);
      } catch (refreshError) {
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("refreshToken");
        await SecureStore.deleteItemAsync("randToken");
        await SecureStore.deleteItemAsync("session");
        failedRequestsQueue.forEach(({ reject }) => reject(refreshError));
        failedRequestsQueue = [];
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;

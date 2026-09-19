import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

// 1. Attach the access token to every outgoing request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 2. Automatically intercept 401 (Unauthorized) errors and refresh the token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Call the refresh endpoint dynamically (works locally and in production)
        const res = await axios.get(`${baseURL}/auth/refresh`, {
          withCredentials: true,
        });

        // Save the new access token
        localStorage.setItem("accessToken", res.data.accessToken);

        // Update the header and retry the original failed request
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If the refresh token is expired/invalid, force logout
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;

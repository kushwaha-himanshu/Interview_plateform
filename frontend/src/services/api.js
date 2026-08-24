import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const path = window.location.pathname;
      if (path !== "/" && path !== "/login" && path !== "/signup") {
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        window.dispatchEvent(new Event("mindflare-profile-change"));
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
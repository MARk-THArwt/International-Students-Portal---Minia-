import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://internationalstudentsportal-production.up.railway.app/api",
});

axiosInstance.interceptors.request.use((config) => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YzFjZGViMGVjZDMzYjQ2OGE4Nzg0OCIsImlhdCI6MTc3NTUwMTIyNCwiZXhwIjoxNzc2MTA2MDI0fQ.rsrONv6-YEma1FsAXeeqqYymh7FVdNWem1SsGrgLf1g";
  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default axiosInstance;
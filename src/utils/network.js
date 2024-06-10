import axios from "axios";

export const WEB_BASE_URL =
  process.env.REACT_APP_WEB_BASE_URL ?? "http://localhost:3000/";
export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ?? "http://localhost:8080/";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

export const shortenUrl = (longUrl) => {
  return axiosInstance.post(
    "/shorten",
    {
      url: longUrl,
    },
    {
      headers: { "Content-Type": "application/json" },
    },
  );
};

export const restoreUrl = (shortUrl) => {
  return axiosInstance.get("/restore", {
    params: {
      url: shortUrl,
    },
  });
};

export default axiosInstance;

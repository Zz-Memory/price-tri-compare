import axios from "axios";

// 环境探测
const isBrowser = typeof window !== "undefined";
const hostname = isBrowser ? window.location.hostname : "";
const port = isBrowser ? window.location.port : "";
const isVercelByHost = isBrowser ? hostname.includes("vercel.app") : false;
const isVercelByEnv = typeof process !== "undefined" && (process.env.VERCEL === "1" || !!process.env.VERCEL_URL);
export const isVercel = isVercelByHost || isVercelByEnv;

// baseURL 规则：Vercel 用相对 /api，本地/其他环境用 http://host:port/api
const devBase = isBrowser ? `http://${hostname}${port ? `:${port}` : ""}/api` : "/api";
axios.defaults.baseURL = isVercel ? "/api" : devBase;

// 拦截器
axios.interceptors.request.use((config) => {
  const token = (isBrowser && localStorage.getItem("token")) || "";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use((res) => res);

export default axios;

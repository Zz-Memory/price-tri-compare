import axios from 'axios';

// 优先使用 Vite 环境变量 VITE_API_BASE，默认回退到 '/api'
const baseURL =
  (typeof import.meta !== 'undefined' &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE) ||
  '/api';

const instance = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

function getToken() {
  try {
    return localStorage.getItem('token') || '';
  } catch {
    return '';
  }
}

// 请求拦截：自动附带 Authorization
instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 响应拦截：按常见结构 { code, data, message/msg } 统一处理，但保持 AxiosResponse 形状
instance.interceptors.response.use(
  (response) => {
    const payload = response?.data;
    if (
      payload &&
      typeof payload === 'object' &&
      ('code' in payload || 'msg' in payload || 'message' in payload)
    ) {
      const code = payload.code ?? 0;
      if (code === 0 || code === 200) {
        // 返回原始 AxiosResponse，兼容现有 const { data } = await axios.get(...)
        return response;
      }
      const msg = payload.message || payload.msg || '请求失败';
      return Promise.reject(new Error(msg));
    }
    return response;
  },
  (error) => {
    let message = '网络错误';
    if (error.code === 'ECONNABORTED') {
      message = '请求超时';
    } else if (error.response) {
      const status = error.response.status;
      const map = {
        400: '请求错误',
        401: '未授权，请登录',
        403: '拒绝访问',
        404: '资源未找到',
        500: '服务器错误',
        502: '网关错误',
        503: '服务不可用',
        504: '网关超时',
      };
      message = map[status] || `HTTP 错误：${status}`;
    } else if (error.message) {
      message = error.message;
    }
    error.message = message;
    return Promise.reject(error);
  },
);

export default instance;

// 可选的便捷方法
export const get = (url, config) => instance.get(url, config);
export const post = (url, data, config) => instance.post(url, data, config);
export const put = (url, data, config) => instance.put(url, data, config);
export const del = (url, config) => instance.delete(url, config);
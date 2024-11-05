import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',  // SpringBoot 
  timeout: 5000
});

// 请求拦截器：添加 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：处理 401 错误
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');

      // 调试输出
      const isModalOpen = localStorage.getItem('isModalOpen');
      console.log("401 Unauthorized detected, isModalOpen:", isModalOpen);
      
      // 仅在模态框未打开时才进行重定向
      if (isModalOpen !== 'true') {
        window.location.href = '/login';
      } else {
        // 在模态框打开时返回一个 rejected Promise，以保持页面状态
        console.log("Modal is open, preventing redirect on 401");
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

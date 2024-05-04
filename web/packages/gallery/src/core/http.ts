import axios, { AxiosRequestHeaders } from "axios";

export const http = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("token");
    if (!!token) {
      config.headers!['Access-Token'] = `${token}`;
    }
    config.headers!['Scheme'] = 'gallery';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    const res = response.data;
    // if (403 == res.status || 401 == res.status) {
      
    // }
    return Promise.resolve(res);
  },
  (error) => {
    return Promise.reject(error);
  }
);
import axios from "axios";

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
    switch(res.code) {
      case 3073:
        localStorage.clear();
        break;
    }
    return Promise.resolve(res);
  },
  (error) => {
    return Promise.reject(error);
  }
);
import axios from "axios";

export const http = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

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
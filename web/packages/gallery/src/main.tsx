import ReactDOM from 'react-dom/client';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

import routes from './router';
import '@/style/index.less';
import { UserProvider } from './context/UserContext';
import { http } from 'core';

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

const App = () => useRoutes(routes);

const rootDom = document.getElementById('root') as HTMLElement;
ReactDOM.createRoot(rootDom).render(
  <BrowserRouter>
    <UserProvider>
      <App />
    </UserProvider>
  </BrowserRouter>
);

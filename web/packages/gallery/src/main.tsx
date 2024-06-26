import ReactDOM from 'react-dom/client';
import { BrowserRouter, useRoutes } from 'react-router-dom';

import routes from './router';
import '@/style/index.less';
import { UserProvider } from './context/UserContext';
import { http } from 'core';
import { TaskProvider } from './context';

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
      <TaskProvider>
      <App />
      </TaskProvider>
    </UserProvider>
  </BrowserRouter>
);

import ReactDOM from 'react-dom/client';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

import routes from './router';
import '@/style/index.less';
import { UserProvider } from './context/UserContext';

// let theme = {
//   token: {
//     colorPrimary: "#4bfef1"
//   }
// };

const App = () => useRoutes(routes);

const rootDom = document.getElementById('root') as HTMLElement;
ReactDOM.createRoot(rootDom).render(
  <BrowserRouter>
    {/* <ConfigProvider locale={zhCN} theme={theme}> */}
      <UserProvider>
      <App />
      </UserProvider>
    {/* </ConfigProvider> */}
  </BrowserRouter>
);

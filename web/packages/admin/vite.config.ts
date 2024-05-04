import path from 'path';
import { ConfigEnv, UserConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

import postCssPxToRem from "postcss-pxtorem";

export default ((env: ConfigEnv): UserConfig => {
  process.env = { ...process.env, ...loadEnv(env.mode, process.cwd()) };

  return {
    plugins: [
      react()
    ],
    base: 'serve' == env.command ? './' : '/',
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './'),
        '@': path.resolve(__dirname, 'src'),
      },
    },
    css: {
      modules: { // css模块化 文件以.module.[css|less|scss]结尾
        hashPrefix: 'prefix',
      },
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          // additionalData: '@import "./src/style/index.less";'
        },
        postcss: {
          plugins: [
            postCssPxToRem({
              rootValue: 16, // 1rem的大小
              propList: ['*'], // 需要转换的属性，这里选择全部都进行转换
            }),
          ],
        }
      }
    },
    server: {
      host: '0.0.0.0',
      port: Number(process.env.VITE_PORT),
      https: false,
      proxy: {
        '/api': {
          target: 'http://localhost:8090',
          changeOrigin: true,
          ws: true
        }
      },
      hmr: {
        overlay: true,
      }
    }
  }
});
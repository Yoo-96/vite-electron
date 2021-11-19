import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve, join } from 'path';

// 指定项目根目录
const root = join(__dirname, 'src');

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  root,
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, '/renderer'),
    },
  },
  // 增加打包配置
  build: {
    emptyOutDir: true,
    minify: false,
    outDir: join(__dirname, '/dist_renderer'),
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import "${resolve(root, '/renderer/assets/css/custom.less')}";`,
      },
    },
  },
});

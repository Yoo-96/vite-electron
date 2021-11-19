[toc]

# vite-electron

基于 `vite` + `electron` 开发的 `vue3.x` 的桌面应用
## 初始化vue项目

基于 [vue3-base-project](https://github.com/Yoo-96/vue3-base-project) 初始化

```bash
git clone git@github.com:Yoo-96/vue3-base-project.git vite-electron
```

### 目录调整

```bash
mkdir /renderer
mkdir /main

mv /src/* /renderer
mv /main /src
mv /renderer /src

├── src
│   ├── main
│   │   └── ...
│   └── renderer
│				└── ...
```

### 修改 `vite.config.ts` 配置

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve, join } from 'path';

// 指定项目根目录
const root = join(__dirname, 'src');

// https://vitejs.dev/config/
export default defineConfig({
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
    outDir: join(__dirname, '/dist/renderer'),
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import "${resolve(root, '/renderer/assets/css/custom.less')}";`,
      },
    },
  },
});
```

### 修改 `tsconfig.json`  中 `compilerOptions.paths `配置

```js
{
  "compilerOptions": {
    // ...
    "paths": {
      "@/*": [ "./src/renderer/*" ] // 修改路径
    }
  }
}

```

### 安装插件

```bash
yarn add electron -D
```



## 动态模块热重载

### 安装插件

```bash
yarn add concurrently wait-on -D
```

### 配置脚本

```js
"scripts": {
    // ...
    "electron": "wait-on tcp:3000 && electron .",
    "electron:dev": "concurrently -k \"npm run dev\" \"npm run electron\""
},
```



## 打包

### 生成图标

#### 安装插件

```bash
yarn add electron-icon-builder -D
```

#### 配置脚本

```js
"scripts": {
    // ...
  	"build-icon": "electron-icon-builder --input=./public/logo.png --output=build --flatten"
},
```

### 修改 `vite.config.ts` 打包配置

```js
export default defineConfig({
  base: './',
  // ...
  // 增加打包配置
  build: {
    emptyOutDir: true,
    minify: false,
    outDir: join(__dirname, '/dist_renderer'),
  },
  // ...
});
```

### 配置环境变量

#### 安装插件

```bash
yarn add cross-env electron-builder -D
```

#### 配置脚本

```js
"scripts": {
    // ...
  	"electron": "wait-on tcp:3000 && cross-env NODE_ENV=development electron .", // 注入环境变量
    "electron:dev": "concurrently -k \"npm run dev\" \"npm run electron\""，
    "electron:build": "vite build && electron-builder"
},
```

#### 设置 `package.json` 中  `build` 属性

```js
"build": {
  "appId": "vite-electron@0.0.1",
  "productName": "vite-electron",
  "copyright": "Copyright © 2021 yoo",
  "directories": {
    "buildResources": "build",
    "output": "dist"
  },
  "mac": {
    "icon": "build/icons/icon.icns",
    "type": "distribution",
    "target": [ "dmg" ]
  }
},
```

### 根据环境配置 主程序 加载窗口 逻辑

```js
const root = path.join(__dirname, '../../');

if (NODE_ENV === 'development') {
  mainWindow.loadURL('http://localhost:3000');
} else {
  mainWindow.loadFile(path.join(root, '/dist_renderer/index.html'));
}
```

### 测试打包

```bash
# 执行打包命令
npm run electron:build

# 此时根目录下会出现 dist 和 dist_renderer 两个文件夹
├── dist
│   ├── builder-debug.yml
│   ├── builder-effective-config.yaml
│   ├── mac
│   │   └── vite-electron.app
│   ├── vite-electron-0.0.1.dmg
│   └── vite-electron-0.0.1.dmg.blockmap
├── dist_renderer
│   ├── assets
│   │   ├── index.3619fc62.js
│   │   ├── index.5b9964eb.css
│   │   ├── index.bd108777.js
│   │   ├── index.cf729e00.css
│   │   ├── index.f414b339.js
│   │   └── vendor.42e46c5e.js
│   └── index.html
```

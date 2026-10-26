# <img src="public/icons/icon.png" alt="icon" width="30" height="30"/> [Debug Tools Extension](https://debug-tools-extension.vercel.app/)

## 概述
`Debug Tools Extension` 是一个面向前端开发者的本地调试工具集合，可作为网页或 Chrome 扩展运行。目前支持 JSON 处理、颜色转换、URL 编解码、时间戳转换、二维码生成、文本对比、正则测试和 Lottie 预览。所有数据均在浏览器本地处理，不会上传到服务器。

在线体验：[debug-tools-extension.vercel.app](https://debug-tools-extension.vercel.app/)

## 功能

- **JSON Formatter**
  - 格式化、压缩、转义和反转义 JSON
  - 树形结构查看
  - 解析失败时定位错误行、列和具体字符
- **Color Transformer**
  - RGBA 与 HEX 双向转换
  - 实时颜色预览
- **URL Encode**
  - URL 编码与解码
  - 一键复制结果
- **Timestamp Converter**
  - Unix 秒/毫秒时间戳自动识别
  - 时间戳与本地日期双向转换
  - 同时展示本地时间和 UTC / ISO 8601 时间
- **QR Code Generator**
  - 根据文本或 URL 实时生成二维码
  - 支持尺寸与容错级别选择
  - 下载 PNG 图片
- **Text Diff**
  - 行级和词级差异高亮
  - 支持左右对照与行内模式
  - 可忽略空白和大小写
- **Regex Tester**
  - JavaScript 正则表达式实时测试
  - 匹配高亮、捕获组和位置详情
  - Replace 结果预览
- **Lottie Preview**
  - 粘贴或上传本地 Lottie JSON
  - SVG 动画预览及播放控制
  - 支持循环、倍速和背景切换

## 项目结构
```plaintext
debug-tools-extension/
├── public/
│   ├── background.js
│   ├── manifest.json
│   └── icons/
├── src/
│   ├── components/
│   │   ├── json_formatter/
│   │   ├── color_transformer/
│   │   ├── url_encode/
│   │   ├── timestamp_converter/
│   │   ├── qr_generator/
│   │   ├── text_diff/
│   │   ├── regex_tester/
│   │   └── lottie_preview/
│   ├── App.jsx
│   └── index.js
├── package.json
└── README.md
```

## 本地开发

```bash
npm install
npm start
```

启动后访问 [http://localhost:3000](http://localhost:3000)。

## 生产构建

```bash
npm run build
```

构建结果位于 `build/` 目录，可直接部署为静态网站。

## 安装为 Chrome 扩展

1. 执行 `npm run build`
2. 打开 Chrome 的 `chrome://extensions`
3. 开启右上角“开发者模式”
4. 点击“加载已解压的扩展程序”
5. 选择项目中的 `build/` 目录

如需生成 ZIP 包：

```bash
cd build
zip -r ../debug-tools-extension-chrome.zip .
```

## 技术栈

- React 19
- Create React App
- Sass
- Chrome Extension Manifest V3
- `qrcode`
- `diff`
- `lottie-web`

## 贡献

欢迎为该项目贡献代码。如果你有任何改进建议或发现了 Bug，请提交 Issue 或 Pull Request。

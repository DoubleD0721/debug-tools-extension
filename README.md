# <img src="public/icons/icon.png" alt="icon" width="30" height="30"/> Debug Tools Extension

## 概述
`Debug Tools Extension` 是一个简单的 Chrome 扩展程序，主要用于 JSON 格式化、颜色转换和 URL 编码/解码，方便开发者在开发过程中进行数据处理和调试。该项目由 [Create React App](https://github.com/facebook/create-react-app) 初始化搭建。

## 项目结构
```plaintext
debug-tools-extension/
├── public/
│   └── 公共资源目录，存放 HTML 模板、静态资源等
├── src/
│   ├── components/
│   │   ├── json_formatter/
│   │   │   └── JSON 格式化组件相关代码
│   │   ├── color_transformer/
│   │   │   └── 颜色转换组件相关代码
│   │   └── url_encode/
│   │       └── URL 编码/解码组件相关代码
│   ├── App.jsx
│   │   └── 主应用组件，负责整合各个子组件
│   └── index.js
│       └── 项目入口文件，启动应用
├── package.json
│   └── 项目依赖和脚本配置文件
└── README.md
    └── 项目说明文档
```
## 安装与运行

### 安装依赖
在项目根目录下，使用以下命令安装所需依赖：
```bash
npm install
```
### 开发模式
运行以下命令启动开发服务器：
```bash
npm start
```
### 生产环境构建
运行以下命令为生产环境构建应用：
```bash
npm run build
```
构建后的文件会被放置在 build 目录下，这些文件已经过优化和压缩，文件名包含哈希值，应用即可部署。详细部署信息可参考 [Create React App 部署文档](https://create-react-app.dev/docs/deployment/)。

# 功能模块
## JSON 格式化器 (Json Formatter)
JSON 格式化器支持对 JSON 数据进行格式化、压缩、转义、反转义操作，还能以树形结构查看 JSON 数据。
- Format JSON：将输入的 JSON 数据格式化，使其具有良好的缩进和可读性。
- Minify JSON：将格式化后的 JSON 数据压缩，去除多余的空格和换行符。
- Escape JSON：对 JSON 数据进行转义处理。
- Unescape JSON：对转义后的 JSON 数据进行反转义处理。
- View JSON：以树形结构展示解析后的 JSON 数据。
## 颜色转换器 (Color Transformer)
颜色转换器可实现 RGBA 颜色值和十六进制颜色值之间的相互转换，并提供颜色预览功能。
- RGBA to Hex：将 RGBA 颜色值转换为十六进制颜色值。
- Hex to RGBA：将十六进制颜色值转换为 RGBA 颜色值。
## URL 编码/解码器 (Url Encode)
URL 编码/解码器支持对 URL 进行编码和解码操作，还能将处理后的 URL 复制到剪贴板。
- Encode：对输入的 URL 进行编码处理。
- Decode：对编码后的 URL 进行解码处理。
- Copy to Clipboard：将处理后的 URL 复制到剪贴板。
# 贡献
欢迎为该项目贡献代码。如果你有任何改进建议或发现了 Bug，请提交 Issue 或 Pull Request。

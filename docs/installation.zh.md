# 安装指南

本指南将引导您完成 gcType-MCP 服务器的安装和配置。

## 前置条件

- **Node.js** >= 18.0.0 — [下载](https://nodejs.org/)
- **npm** >= 9.0.0（随 Node.js 一起安装）
- 支持 MCP 的 **AI 客户端**，例如：
  - [Claude Desktop](https://claude.ai/)
  - [Cursor](https://cursor.com/)
  - [VS Code MCP 扩展](https://code.visualstudio.com/)
  - 任何支持模型上下文协议的客户端

## 步骤 1：克隆仓库

```bash
git clone https://github.com/ZengZichao/gcType-MCP.git
cd gcType-MCP
```

## 步骤 2：安装依赖

```bash
npm install
```

这将安装所有必需的包：
- `@modelcontextprotocol/sdk` — MCP 协议 SDK
- `axios` — HTTP 客户端
- `zod` — Schema 验证
- `typescript-eslint` — TypeScript 代码检查（开发依赖）

## 步骤 3：构建服务器

```bash
npm run build
```

将 `src/` 中的 TypeScript 源码编译为 `dist/` 中的 JavaScript。

构建成功后，您应该看到：

```
dist/
├── index.js         # 主入口文件
├── index.js.map
├── index.d.ts
├── config.js        # 配置
├── api.js           # API 客户端
├── tools.js         # 工具定义
├── types.js         # 类型定义
└── ...（各模块的 .d.ts、.d.ts.map、.js.map 文件）
```

## 步骤 4：配置 MCP 客户端

### Claude Desktop

1. 找到您的 Claude Desktop 配置文件：
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. 添加 gcType-MCP 服务器：

```json
{
  "mcpServers": {
    "gctype": {
      "command": "node",
      "args": ["/absolute/path/to/gcType-MCP/dist/index.js"]
    }
  }
}
```

> **重要**：请使用 `dist/index.js` 的**绝对路径**。

3. 重启 Claude Desktop。

### Cursor

1. 打开 Cursor Settings → MCP Servers
2. 添加新服务器：

```json
{
  "name": "gctype",
  "command": "node",
  "args": ["/absolute/path/to/gcType-MCP/dist/index.js"]
}
```

### VS Code

1. 打开 Settings → MCP
2. 添加服务器配置：

```json
{
  "mcpServers": {
    "gctype": {
      "command": "node",
      "args": ["/absolute/path/to/gcType-MCP/dist/index.js"]
    }
  }
}
```

## 步骤 5：验证安装

1. 启动您的 AI 客户端
2. 提出一个需要 gcType 数据的问题，例如：
   > "在 gcType 数据库中搜索 Streptomyces rubiginosus"

3. AI 应该使用 `search_type_strains` 工具并返回结果。

## 故障排除

### 服务器无法启动

- 检查 Node.js 是否已安装：`node --version`
- 检查构建是否成功：`ls dist/index.js`
- 检查配置中的绝对路径是否正确

### 连接错误

- 验证 gcType 网站是否可访问：`https://gctype.wdcm.org/`
- 检查网络连接
- 查看服务器日志（stderr 输出）

### 工具未找到

- 确保配置更改后已重启 AI 客户端
- 验证服务器是否正在运行：检查 AI 客户端的 MCP 服务器状态

### 构建错误

- 确保 TypeScript 已安装：`npm install`
- 检查 Node.js 版本：`node --version`（必须 >= 18）
- 尝试清理并重新构建：
  ```bash
  rm -rf dist node_modules
  npm install
  npm run build
  ```

## 开发模式

使用热重载进行开发：

```bash
npm run dev
```

使用 `tsx` 直接运行 TypeScript 源码，无需构建。

## 后续步骤

- 阅读[工具参考](./tools.zh.md)了解所有可用工具
- 阅读[架构文档](./architecture.zh.md)了解服务器设计

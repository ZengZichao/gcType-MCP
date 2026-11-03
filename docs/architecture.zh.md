# 架构

本文档描述 gcType-MCP 服务器的架构和设计。

## 概述

gcType-MCP 服务器基于**模型上下文协议（MCP）**规范构建，采用模块化、分层架构。服务器作为 AI 助手与 gcType 模式菌株基因组数据库网站之间的桥梁。

```
┌─────────────────┐     MCP 协议       ┌─────────────────┐     HTTP      ┌─────────────────┐
│   AI 助手         │ ◄──────────────────► │  gcType-MCP     │ ◄──────────► │  gcType 网站     │
│  (Claude 等)     │     (stdio)           │  服务器          │   (HTTPS)     │  gctype.wdcm.org│
└─────────────────┘                        └─────────────────┘               └─────────────────┘
                                                    │
                                                    │
                                           ┌────────┴────────┐
                                           │  工具处理器       │
                                           │  (13 个工具)     │
                                           └────────┬────────┘
                                                    │
                                           ┌────────┴────────┐
                                           │  API 客户端      │
                                           │  (Axios)        │
                                           └────────┬────────┘
                                                    │
                                           ┌────────┴────────┐
                                           │  配置和类型      │
                                           └─────────────────┘
```

## 组件

### 1. 入口文件（`src/index.ts`）

主入口文件负责：

- 创建使用 stdio 传输的 MCP `Server` 实例
- 注册 `ListTools` 和 `CallTool` 操作的请求处理器
- 将工具调用路由到相应的 API 客户端方法
- 处理错误并返回结构化响应
- 管理优雅关闭（SIGINT、SIGTERM）

**关键职责：**
- MCP 协议通信
- 工具分发和错误处理
- 进程生命周期管理

### 2. 配置（`src/config.ts`）

集中配置，包含：

- **常量**：服务器名称、版本、基础 URL、超时时间、页面大小
- **URL 映射**：`DATA_URLS` 对象，将类别名称映射到 gcType 网站路径
- **辅助函数**：`buildUrl()` 用于构建完整 URL
- **标签**：`CATEGORY_LABELS` 用于双语类别显示

### 3. 类型定义（`src/types.ts`）

TypeScript 接口和类型联合，定义：

- 搜索类型（`SearchType`）
- 数据类别（`DataCategory`）
- 功能类别（`FunctionCategory`）
- 结果类型（`TypeStrainResult`、`GenomeResult`、`RdnaResult`、`FunctionResult`、`StatisticsResult`）
- 响应类型（`SearchResponse<T>`）
- 工具定义接口（`ToolDefinition`）
- 项目信息接口（`ProjectInfo`）

### 4. API 客户端（`src/api.ts`）

`GcTypeClient` 类，处理与 gcType 网站的所有 HTTP 通信：

- 使用 **Axios** 进行 HTTP 请求
- 配置自定义 User-Agent 和请求头
- 为每个工具操作提供方法
- 返回结构化的 `SearchResponse` 对象
- 优雅处理错误，提供有意义的错误信息

**方法：**
| 方法 | 工具 | 描述 |
|------|------|------|
| `searchTypeStrains()` | `search_type_strains` | 按物种/菌株/登录号搜索 |
| `browseData()` | `browse_data_category` | 按类别浏览 |
| `queryFunction()` | `query_function_annotation` | 查询功能数据 |
| `getStatistics()` | `get_statistics` | 获取数据库统计 |
| `getGenomeInfo()` | `get_genome_info` | 按登录号获取基因组 |
| `search16SRdna()` | `search_16s_rdna` | 搜索 16S rDNA |
| `getProjectInfo()` | `get_project_info` | 获取项目信息 |
| `getDataCategories()` | `list_data_categories` | 列出数据类别 |
| `getFunctionCategories()` | `list_function_categories` | 列出功能类别 |
| `getAvailableTools()` | `list_available_tools` | 列出分析工具 |
| `getDownloadInfo()` | `get_download_info` | 获取下载信息 |
| `getDataUsagePolicy()` | `get_data_usage_policy` | 获取使用政策 |
| `getCitation()` | `get_citation` | 获取引用信息 |

### 5. 工具定义（`src/tools.ts`）

MCP 协议的声明式工具定义：

- 每个工具都有 `name`、`description` 和 `inputSchema`
- 描述为双语（英文 + 中文）
- 输入 schema 使用 JSON Schema 格式
- `getToolByName()` 辅助函数支持按名称查找

## 设计原则

### 1. 协议合规

服务器严格遵循 MCP 规范：
- 使用 `@modelcontextprotocol/sdk` 处理协议
- 支持 `ListToolsRequest` 和 `CallToolRequest`
- 以标准 `{ content: [{ type: "text", text: "..." }] }` 格式返回内容

### 2. 模块化

每个关注点分离到独立模块：
- 配置 → `config.ts`
- 类型 → `types.ts`
- API 通信 → `api.ts`
- 工具定义 → `tools.ts`
- 服务器逻辑 → `index.ts`

### 3. 类型安全

完整的 TypeScript 实现：
- 启用严格模式
- 公共接口中不使用 `any` 类型
- 泛型 `SearchResponse<T>` 实现类型化结果
- 枚举联合用于约束值

### 4. 错误韧性

- 所有 API 方法使用 try/catch
- 错误以结构化响应返回，而非抛出异常
- 进程级错误处理器处理未捕获异常
- SIGINT/SIGTERM 时优雅关闭

### 5. 双语支持

- 所有工具描述包含英文和中文
- 文档提供两种语言版本
- 类别标签支持两种语言

## 数据流

```
1. AI 助手通过 stdio 发送 CallToolRequest
2. 服务器在 CallToolRequestSchema 处理器中接收请求
3. 处理器分发到 gcTypeClient 的相应方法
4. gcTypeClient 向 gctype.wdcm.org 发起 HTTP 请求
5. 响应被结构化为 SearchResponse<T>
6. 响应序列化为 JSON 并作为 MCP 内容返回
7. AI 助手接收并处理响应
```

## 构建系统

- **TypeScript** 编译器（`tsc`），使用 ESNext 模块
- `tsc-alias` 用于路径别名解析（`@/*` → `src/*`）
- ES2022 目标，支持现代 Node.js 特性
- 源映射和声明文件用于调试
- ESLint 用于代码质量

## 依赖

### 运行时

| 包 | 用途 |
|----|------|
| `@modelcontextprotocol/sdk` | MCP 协议实现 |
| `axios` | gcType API 的 HTTP 客户端 |
| `zod` | Schema 验证（未来使用） |

### 开发

| 包 | 用途 |
|----|------|
| `typescript` | TypeScript 编译器 |
| `tsx` | 支持热重载的开发运行器 |
| `@types/node` | Node.js 类型定义 |
| `eslint` | 代码检查 |
| `typescript-eslint` | TypeScript ESLint 插件和解析器 |
| `tsc-alias` | 路径别名解析 |

## 未来增强

未来开发的潜在方向：

1. **直接 API 集成**：如果 gcType 暴露 REST API，用直接 API 调用替代网页抓取
2. **缓存**：添加响应缓存以减少冗余 HTTP 请求
3. **批量查询**：支持单次工具调用中的多个查询
4. **高级搜索**：添加分类学、基因组质量、注释状态的筛选器
5. **数据导出**：支持以 FASTA/CSV 格式下载结构化数据
6. **认证**：如果 gcType 添加认证，支持 API 密钥

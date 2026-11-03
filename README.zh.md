# gcType-MCP

**版本: 0.1.0**

> 一个基于 MCP（模型上下文协议）的服务器，为 [gcType 模式菌株基因组数据库](https://gctype.wdcm.org/)提供接口，使 AI 助手能够无缝访问微生物模式菌株基因组数据、物种信息、16S rDNA 序列、功能注释等内容。

[English](./README.md) | [中文](./README.zh.md)

---

## 目录

- [概述](#概述)
- [功能特性](#功能特性)
- [快速开始](#快速开始)
- [安装](#安装)
- [配置](#配置)
- [可用工具](#可用工具)
- [使用示例](#使用示例)
- [项目结构](#项目结构)
- [开发](#开发)
- [贡献](#贡献)
- [许可证](#许可证)
- [致谢](#致谢)

---

## 概述

**gcType-MCP** 是一个模型上下文协议（MCP）服务器，将 AI 助手与 [gcType 模式菌株基因组数据库](https://gctype.wdcm.org/)连接起来。gcType 数据库由[世界微生物数据联盟（WDCM）](https://www.wdcm.org/)和[国家微生物数据云（NMDC）](https://nmdc.cn/)运营，是一个涵盖细菌、古菌和真菌的全面微生物模式菌株基因组数据库。

通过使用此 MCP 服务器，AI 助手（如 Claude）可以：

- 按物种名称、菌株编号或基因组登录号搜索模式菌株
- 浏览多个类别的数据（有效发表物种、模式菌株基因组、16S rDNA 序列等）
- 查询功能注释（核心基因组、原噬菌体、防御系统、抗生素抗性、毒力因子、生物合成基因簇等）
- 获取统计信息、项目信息和引用详情
- 提供数据下载和使用政策的指导

## 功能特性

- **13 个 MCP 工具**：全面覆盖 gcType 数据库功能
- **MCP 协议兼容**：基于官方 MCP SDK 构建，使用 stdio 传输
- **中英双语**：所有文档均提供中文和英文版本
- **TypeScript 实现**：完整类型安全和现代 ES 模块实现
- **轻量级**：依赖少，启动快
- **可扩展**：清晰的架构，便于添加新工具

## 快速开始

### 前置条件

- [Node.js](https://nodejs.org/) >= 18.0.0
- 支持 MCP 的 AI 客户端（如 [Claude Desktop](https://claude.ai/)）

### 安装和配置

1. **克隆仓库：**

```bash
git clone https://github.com/ZengZichao/gcType-MCP.git
cd gcType-MCP
```

2. **安装依赖并构建：**

```bash
npm install
npm run build
```

3. **配置 MCP 客户端：**

将以下内容添加到您的 MCP 客户端配置中（例如 Claude Desktop 的 `claude_desktop_config.json`）：

```json
{
  "mcpServers": {
    "gctype": {
      "command": "node",
      "args": ["/path/to/gcType-MCP/dist/index.js"]
    }
  }
}
```

> 请将 `/path/to/gcType-MCP/dist/index.js` 替换为构建后服务器的实际绝对路径。

4. **重启 AI 客户端**，即可开始查询微生物模式菌株信息！

## 安装

### 从源码安装

```bash
git clone https://github.com/ZengZichao/gcType-MCP.git
cd gcType-MCP
npm install
npm run build
```

### 使用 npx（即将推出）

```bash
npx gctype-mcp
```

## 配置

### MCP 客户端配置

gcType-MCP 服务器使用 **stdio 传输**，不需要额外的配置文件。只需将 MCP 客户端指向构建后的服务器入口文件即可。

#### Claude Desktop

编辑 `claude_desktop_config.json`：

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "gctype": {
      "command": "node",
      "args": ["C:\\path\\to\\gcType-MCP\\dist\\index.js"]
    }
  }
}
```

#### Cursor / VS Code

添加到 MCP 设置中：

```json
{
  "mcpServers": {
    "gctype": {
      "command": "node",
      "args": ["/path/to/gcType-MCP/dist/index.js"]
    }
  }
}
```

### 环境变量

服务器无需任何环境变量即可运行。以下选项可通过代码常量（`src/config.ts`）自定义：

| 选项 | 默认值 | 描述 |
|------|--------|------|
| `BASE_URL` | `https://gctype.wdcm.org` | gcType 网站基础 URL |
| `REQUEST_TIMEOUT` | `30000` | HTTP 请求超时时间（毫秒） |
| `MAX_RESULTS` | `50` | 返回结果的最大数量 |
| `DEFAULT_PAGE_SIZE` | `20` | 默认每页结果数 |

## 可用工具

gcType-MCP 服务器提供 13 个工具：

### 搜索与浏览

| 工具 | 描述 |
|------|------|
| `search_type_strains` | 按物种名称、菌株编号或基因组登录号搜索模式菌株 |
| `browse_data_category` | 按类别浏览数据（有效物种、模式菌株、基因组等） |
| `get_genome_info` | 按登录号获取基因组信息 |
| `search_16s_rdna` | 按物种名称搜索 16S rDNA 序列 |

### 功能注释

| 工具 | 描述 |
|------|------|
| `query_function_annotation` | 查询功能注释数据（核心基因组、原噬菌体、防御系统等） |

### 发现与元数据

| 工具 | 描述 |
|------|------|
| `get_statistics` | 获取数据库统计信息 |
| `get_project_info` | 获取 gcType 项目信息 |
| `list_data_categories` | 列出所有可用的数据类别 |
| `list_function_categories` | 列出所有功能注释类别 |
| `list_available_tools` | 列出 gcType 平台上的分析工具 |

### 政策与引用

| 工具 | 描述 |
|------|------|
| `get_download_info` | 获取数据下载信息 |
| `get_data_usage_policy` | 获取数据使用政策 |
| `get_citation` | 获取引用信息 |

详细的工具 schema 和参数说明请参见[工具文档](./docs/tools.zh.md)。

## 使用示例

### 示例 1：搜索模式菌株

向 AI 助手提问：

> "在 gcType 数据库中搜索 *Streptomyces rubiginosus*"

AI 将使用 `search_type_strains` 工具：

```json
{
  "query": "Streptomyces rubiginosus",
  "searchType": "species_name"
}
```

### 示例 2：浏览模式菌株基因组

> "显示 gcType 中可用的模式菌株基因组"

AI 将使用 `browse_data_category` 工具：

```json
{
  "category": "type_strain_genomes"
}
```

### 示例 3：查询抗生素抗性数据

> "gcType 中有哪些抗生素抗性基因？"

AI 将使用 `query_function_annotation` 工具：

```json
{
  "category": "antibiotics_resistance"
}
```

### 示例 4：搜索 16S rDNA 序列

> "查找 *Escherichia coli* 的 16S rDNA 序列"

AI 将使用 `search_16s_rdna` 工具：

```json
{
  "speciesName": "Escherichia coli"
}
```

### 示例 5：获取数据库统计信息

> "gcType 数据库中有多少物种和基因组？"

AI 将使用 `get_statistics` 工具。

## 项目结构

```
gcType-MCP/
├── src/
│   ├── index.ts          # MCP 服务器入口
│   ├── config.ts         # 配置常量和 URL 映射
│   ├── api.ts            # gcType API 客户端
│   ├── tools.ts          # MCP 工具定义
│   └── types.ts          # TypeScript 类型定义
├── docs/
│   ├── installation.md       # 安装指南（英文）
│   ├── installation.zh.md    # 安装指南（中文）
│   ├── tools.md              # 工具参考（英文）
│   ├── tools.zh.md           # 工具参考（中文）
│   ├── architecture.md       # 架构文档（英文）
│   └── architecture.zh.md    # 架构文档（中文）
├── package.json
├── tsconfig.json
├── .gitignore
├── .npmignore
├── LICENSE
├── README.md             # 英文 README
├── README.zh.md          # 中文 README
├── CHANGELOG.md          # 英文变更日志
├── CHANGELOG.zh.md       # 中文变更日志
└── eslint.config.js
```

## 开发

### 构建

```bash
npm run build
```

将 TypeScript 编译为 JavaScript，输出到 `dist/` 目录。

### 开发模式

```bash
npm run dev
```

使用 `tsx` 运行服务器，开发期间支持热重载。

### 类型检查

```bash
npm run typecheck
```

### 代码检查

```bash
npm run lint
npm run lint:fix
```

### 测试服务器

构建后，可以运行以下命令测试服务器：

```bash
npm start
```

服务器通过 stdio 通信。您可以向 stdin 发送 MCP 协议消息，在 stdout 接收响应。

## 贡献

欢迎贡献！您可以通过以下方式贡献：

1. **Fork** 本仓库
2. **创建** 功能分支：`git checkout -b feature/my-feature`
3. **提交** 更改：`git commit -am 'Add my feature'`
4. **推送** 到分支：`git push origin feature/my-feature`
5. **提交** Pull Request

### 贡献指南

- 遵循现有代码风格（TypeScript、ES 模块）
- 为任何新功能添加中英双语文档
- 更新 CHANGELOG 文件
- 确保 `npm run typecheck` 和 `npm run lint` 通过
- 使用支持 MCP 的 AI 客户端测试您的更改

## 许可证

本项目基于 **MIT 许可证** - 详情请参见 [LICENSE](./LICENSE) 文件。

## 致谢

- **gcType 数据库**：由[世界微生物数据联盟（WDCM）](https://www.wdcm.org/)和[国家微生物数据云（NMDC）](https://nmdc.cn/)运营
- **MCP SDK**：基于[模型上下文协议 SDK](https://github.com/modelcontextprotocol) 构建
- **项目联系人**：吴林焕博士 (wulh@im.ac.cn) / gcm_admin@wdcm.org
- **引用**：使用数据时请正确引用 gcType 数据库。详情请参见[引用页面](https://gctype.wdcm.org/citation)。

---

<p align="center">
  <sub>为微生物研究社区用心构建 ❤️</sub>
</p>

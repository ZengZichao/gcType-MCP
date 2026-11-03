# 变更日志

本项目所有重要变更都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/spec/v2.0.0.html) 规范。

## [未发布]

## [0.1.0] - 2026-11-03

### 新增

- gcType-MCP 服务器初始版本。
- 基于模型上下文协议（MCP）规范构建的 MCP 服务器，使用 stdio 传输。
- 13 个 MCP 工具，用于与 gcType 模式菌株基因组数据库交互：
  - `search_type_strains` - 按物种名称、菌株编号或基因组登录号搜索模式菌株。
  - `browse_data_category` - 按类别浏览数据（有效发表物种、模式菌株、基因组等）。
  - `query_function_annotation` - 查询功能注释数据（核心基因组、原噬菌体、防御系统等）。
  - `get_statistics` - 获取数据库统计信息，包括物种、模式菌株和基因组数量。
  - `get_genome_info` - 按登录号获取基因组信息。
  - `search_16s_rdna` - 按物种名称搜索 16S rDNA 序列。
  - `get_project_info` - 获取 gcType 项目信息和描述。
  - `list_data_categories` - 列出所有可用的数据类别及其 URL 和描述。
  - `list_function_categories` - 列出所有可用的功能注释类别。
  - `list_available_tools` - 列出 gcType 平台上可用的分析工具。
  - `get_download_info` - 获取下载页面信息。
  - `get_data_usage_policy` - 获取数据使用政策。
  - `get_citation` - 获取引用信息。
- 所有文档均提供中英双语版本。
- TypeScript 实现，包含完整类型定义。
- 基于 Axios 的 HTTP 客户端，用于与 gcType 网站通信。
- MIT 许可证。

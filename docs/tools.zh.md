# 工具参考

本文档提供 gcType-MCP 服务器中所有 MCP 工具的详细参考。

## 概述

gcType-MCP 服务器提供 **13 个工具**，分为四个类别：

1. [搜索与浏览](#搜索与浏览)
2. [功能注释](#功能注释)
3. [发现与元数据](#发现与元数据)
4. [政策与引用](#政策与引用)

---

## 搜索与浏览

### search_type_strains

在 gcType 数据库中搜索模式菌株。

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| `query` | string | 是 | — | 搜索查询（物种名称、菌株编号或登录号） |
| `searchType` | enum | 否 | `species_name` | 搜索类型：`species_name`、`strain_number` 或 `genome_accession` |
| `page` | number | 否 | `1` | 页码 |
| `pageSize` | number | 否 | `20` | 每页结果数 |

**示例：**

```json
{
  "query": "Streptomyces rubiginosus",
  "searchType": "species_name"
}
```

---

### browse_data_category

按类别浏览 gcType 数据库中的数据。

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| `category` | enum | 是 | — | 数据类别（见下文） |
| `page` | number | 否 | `1` | 页码 |

**类别：**

- `valid_published_species` — 有效发表的物种名称
- `type_strains` — 模式菌株目录
- `type_strains_by_collection` — 按菌种保藏中心分类的模式菌株
- `type_strain_genomes` — 模式菌株基因组组装
- `16s_rdna_sequences` — 16S rDNA 序列
- `gcm_10k_genomes` — GCM 万株基因组项目
- `novel_species_genomes` — 新种基因组

**示例：**

```json
{
  "category": "type_strain_genomes"
}
```

---

### get_genome_info

按登录号获取基因组信息。

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `accession` | string | 是 | 基因组登录号（如 `GCF_000203835.1`） |

**示例：**

```json
{
  "accession": "GCF_000203835.1"
}
```

---

### search_16s_rdna

按物种名称搜索 16S rDNA 序列。

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `speciesName` | string | 是 | 要搜索的物种名称 |

**示例：**

```json
{
  "speciesName": "Escherichia coli"
}
```

---

## 功能注释

### query_function_annotation

查询模式菌株基因组的功能注释数据。

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `category` | enum | 是 | 功能类别（见下文） |
| `speciesName` | string | 否 | 可选的物种名称筛选 |

**类别：**

- `core_genome` — 核心基因组分析
- `prophage` — 原噬菌体序列
- `defense_system` — 防御系统基因（CRISPR、限制修饰系统等）
- `mobile_genetic_elements` — 可移动遗传元件（质粒、转座子、ICE）
- `antibiotics_resistance` — 抗生素抗性基因
- `virulence_factors` — 毒力因子基因
- `biosynthetic_gene_clusters` — 生物合成基因簇（BGC）

**示例：**

```json
{
  "category": "antibiotics_resistance",
  "speciesName": "Streptomyces rubiginosus"
}
```

---

## 发现与元数据

### get_statistics

获取 gcType 数据库的统计信息。

**参数：** 无

**返回：** 统计信息，包括物种总数、模式菌株数、基因组数和测序进度。

---

### get_project_info

获取 gcType 项目信息。

**参数：** 无

**返回：** 项目名称、描述、组织、联系邮箱和 URL。

---

### list_data_categories

列出所有可用的数据类别及其 URL 和描述。

**参数：** 无

**返回：** 类别数组，包含 `category`、`url` 和 `description` 字段。

---

### list_function_categories

列出所有可用的功能注释类别。

**参数：** 无

**返回：** 功能类别数组，包含 `category`、`url` 和 `description` 字段。

---

### list_available_tools

列出 gcType 平台上所有可用的分析工具。

**参数：** 无

**返回：** 工具数组：
- `genome_analysis` — 在线基因组分析工具
- `species_identification` — 物种鉴定工具
- `structure_based_alignment` — 基于结构的蛋白质比对工具

---

## 政策与引用

### get_download_info

获取 gcType 数据下载信息。

**参数：** 无

**返回：** 下载页面 URL 和指南。

---

### get_data_usage_policy

获取 gcType 数据使用政策。

**参数：** 无

**返回：** 数据使用政策，涵盖学术/商业使用、引用要求和再分发限制。

---

### get_citation

获取 gcType 数据库的引用信息。

**参数：** 无

**返回：** 在出版物中引用 gcType 数据库的详细信息。

---

## 响应格式

所有工具返回 JSON 格式的响应，结构如下：

```typescript
{
  "success": boolean;        // 请求是否成功
  "query"?: string;          // 原始查询（如适用）
  "total"?: number;          // 结果总数
  "results": Array<...>;     // 结果对象数组
  "message"?: string;        // 人类可读的消息
  "source"?: string;         // 来源 URL
}
```

## 错误处理

当工具遇到错误时，MCP 服务器返回：

```json
{
  "content": [
    {
      "type": "text",
      "text": "Error executing tool \"tool_name\": error message"
    }
  ],
  "isError": true
}
```

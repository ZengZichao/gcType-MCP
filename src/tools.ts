/**
 * Tool definitions for gcType-MCP Server
 * gcType MCP Server 工具定义
 *
 * Defines all available MCP tools that AI assistants can use
 * to interact with the gcType Type Strains Genome Database.
 *
 * 定义 AI 助手可用的所有 MCP 工具，用于与 gcType 模式菌株基因组数据库交互。
 *
 * @version 0.1.0
 */

import type { ToolDefinition } from "./types.js";

/**
 * List of all available MCP tools
 * 所有可用 MCP 工具列表
 */
export const tools: ToolDefinition[] = [
  {
    name: "search_type_strains",
    description:
      "Search the gcType database for type strains by species name, strain number, or genome accession. " +
      "The gcType database contains comprehensive information about microbial type strains including bacteria, archaea, and fungi. " +
      "Example: search_type_strains with query='Streptomyces rubiginosus' and searchType='species_name'.\n\n" +
      "在 gcType 数据库中按物种名称、菌株编号或基因组登录号搜索模式菌株。" +
      "gcType 数据库包含细菌、古菌和真菌等微生物模式菌株的全面信息。" +
      "示例：search_type_strains with query='Streptomyces rubiginosus' and searchType='species_name'。",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "Search query string. Can be a species name (e.g., 'Streptomyces rubiginosus'), strain number, or genome accession number. / 搜索查询字符串，可以是物种名称、菌株编号或基因组登录号。",
        },
        searchType: {
          type: "string",
          enum: ["species_name", "strain_number", "genome_accession"],
          description:
            "Type of search to perform. / 搜索类型。",
          default: "species_name",
        },
        page: {
          type: "number",
          description: "Page number for pagination. Default is 1. / 分页页码，默认为1。",
          default: 1,
        },
        pageSize: {
          type: "number",
          description: "Number of results per page. Default is 20. / 每页结果数，默认为20。",
          default: 20,
        },
      },
      required: ["query"],
    },
  },
  {
    name: "browse_data_category",
    description:
      "Browse data by category in the gcType database. Available categories include: " +
      "valid_published_species, type_strains, type_strains_by_collection, type_strain_genomes, " +
      "16s_rdna_sequences, gcm_10k_genomes, novel_species_genomes. " +
      "Returns the URL and metadata for the selected data category.\n\n" +
      "在 gcType 数据库中按类别浏览数据。可用类别包括：" +
      "有效发表物种、模式菌株、按菌种保藏中心分类的模式菌株、模式菌株基因组、" +
      "16S rDNA 序列、GCM 万株基因组、新种基因组。",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: [
            "valid_published_species",
            "type_strains",
            "type_strains_by_collection",
            "type_strain_genomes",
            "16s_rdna_sequences",
            "gcm_10k_genomes",
            "novel_species_genomes",
          ],
          description:
            "Data category to browse. / 要浏览的数据类别。",
        },
        page: {
          type: "number",
          description: "Page number for pagination. Default is 1. / 分页页码，默认为1。",
          default: 1,
        },
      },
      required: ["category"],
    },
  },
  {
    name: "query_function_annotation",
    description:
      "Query functional annotation data in the gcType database. " +
      "Available function categories include: core_genome, prophage, defense_system, " +
      "mobile_genetic_elements, antibiotics_resistance, virulence_factors, biosynthetic_gene_clusters. " +
      "Optionally filter by species name.\n\n" +
      "在 gcType 数据库中查询功能注释数据。" +
      "可用功能类别包括：核心基因组、原噬菌体、防御系统、" +
      "可移动遗传元件、抗生素抗性、毒力因子、生物合成基因簇。" +
      "可按物种名称筛选。",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: [
            "core_genome",
            "prophage",
            "defense_system",
            "mobile_genetic_elements",
            "antibiotics_resistance",
            "virulence_factors",
            "biosynthetic_gene_clusters",
          ],
          description:
            "Function annotation category. / 功能注释类别。",
        },
        speciesName: {
          type: "string",
          description:
            "Optional species name to filter results. / 可选的物种名称用于筛选结果。",
        },
      },
      required: ["category"],
    },
  },
  {
    name: "get_statistics",
    description:
      "Get statistics about the gcType database, including counts of species, type strains, genomes, and sequencing progress. " +
      "The database covers data from 20+ culture collections across 14 countries and regions.\n\n" +
      "获取 gcType 数据库的统计信息，包括物种数、模式菌株数、基因组数和测序进度。" +
      "该数据库涵盖来自14个国家和地区的20多个菌种保藏中心的数据。",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_genome_info",
    description:
      "Get genome information by accession number from the gcType database. " +
      "Provides accession number, species name, genome size, GC content, and assembly details.\n\n" +
      "按登录号从 gcType 数据库获取基因组信息。" +
      "提供登录号、物种名称、基因组大小、GC含量和组装详情。",
    inputSchema: {
      type: "object",
      properties: {
        accession: {
          type: "string",
          description:
            "Genome accession number (e.g., 'GCF_000203835.1'). / 基因组登录号。",
        },
      },
      required: ["accession"],
    },
  },
  {
    name: "search_16s_rdna",
    description:
      "Search 16S rDNA sequences in the gcType database by species name. " +
      "16S rDNA sequences are commonly used for bacterial and archaeal species identification and phylogenetic analysis.\n\n" +
      "按物种名称在 gcType 数据库中搜索 16S rDNA 序列。" +
      "16S rDNA 序列常用于细菌和古菌的物种鉴定和系统发育分析。",
    inputSchema: {
      type: "object",
      properties: {
        speciesName: {
          type: "string",
          description:
            "Species name to search for 16S rDNA sequences. / 要搜索16S rDNA序列的物种名称。",
        },
      },
      required: ["speciesName"],
    },
  },
  {
    name: "get_project_info",
    description:
      "Get information about the gcType project, including its description, organization, and contact details. " +
      "The gcType database is operated by WDCM (World Data Centre for Microorganisms) and NMDC (National Microbiology Data Center).\n\n" +
      "获取 gcType 项目信息，包括描述、组织和联系方式。" +
      "gcType 数据库由 WDCM（世界微生物数据联盟）和 NMDC（国家微生物数据云）运营。",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "list_data_categories",
    description:
      "List all available data categories in the gcType database with their URLs and descriptions. " +
      "Useful for discovering what types of data are available for browsing.\n\n" +
      "列出 gcType 数据库中所有可用的数据类别及其 URL 和描述。" +
      "用于发现可浏览的数据类型。",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "list_function_categories",
    description:
      "List all available functional annotation categories in the gcType database with their URLs and descriptions. " +
      "Categories include core genome, prophage, defense system, mobile genetic elements, antibiotics resistance, virulence factors, and biosynthetic gene clusters.\n\n" +
      "列出 gcType 数据库中所有可用的功能注释类别及其 URL 和描述。" +
      "类别包括核心基因组、原噬菌体、防御系统、可移动遗传元件、抗生素抗性、毒力因子和生物合成基因簇。",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "list_available_tools",
    description:
      "List all available analysis tools on the gcType platform, including genome analysis, species identification, and structure-based alignment of protein sequences.\n\n" +
      "列出 gcType 平台上所有可用的分析工具，包括基因组分析、物种鉴定和蛋白质序列结构比对。",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_download_info",
    description:
      "Get information about downloading data from the gcType database, including the download page URL and data usage guidelines.\n\n" +
      "获取从 gcType 数据库下载数据的信息，包括下载页面 URL 和数据使用指南。",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_data_usage_policy",
    description:
      "Get the data usage policy for the gcType database. " +
      "Outlines terms for academic and commercial use, citation requirements, and redistribution restrictions.\n\n" +
      "获取 gcType 数据库的数据使用政策。" +
      "概述了学术和商业使用条款、引用要求和再分发限制。",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_citation",
    description:
      "Get citation information for the gcType database. " +
      "When using data from gcType, proper citation is required.\n\n" +
      "获取 gcType 数据库的引用信息。" +
      "使用 gcType 数据时需要正确引用。",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

/**
 * Get a tool definition by name
 * 按名称获取工具定义
 *
 * @param name - Tool name
 * @returns Tool definition or undefined
 */
export function getToolByName(name: string): ToolDefinition | undefined {
  return tools.find((tool) => tool.name === name);
}

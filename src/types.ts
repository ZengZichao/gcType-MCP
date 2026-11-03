/**
 * Type definitions for gcType-MCP
 * gcType MCP Server 的类型定义
 *
 * @version 0.1.0
 */

/**
 * Search type for gcType database queries
 * gcType 数据库查询的搜索类型
 */
export type SearchType =
  | "species_name"   // 物种名称
  | "strain_number"  // 菌株编号
  | "genome_accession"; // 基因组登录号

/**
 * Data category available in gcType
 * gcType 中可用的数据类别
 */
export type DataCategory =
  | "valid_published_species"
  | "type_strains"
  | "type_strains_by_collection"
  | "type_strain_genomes"
  | "16s_rdna_sequences"
  | "gcm_10k_genomes"
  | "novel_species_genomes";

/**
 * Functional annotation category
 * 功能注释类别
 */
export type FunctionCategory =
  | "core_genome"
  | "prophage"
  | "defense_system"
  | "mobile_genetic_elements"
  | "antibiotics_resistance"
  | "virulence_factors"
  | "biosynthetic_gene_clusters";

/**
 * Tool category for the reference page mapping
 * 工具类别到参考页面映射
 */
export type ToolCategory =
  | "genome_analysis"
  | "species_identification"
  | "structure_based_alignment";

/**
 * A type strain search result item
 * 模式菌株搜索结果项
 */
export interface TypeStrainResult {
  speciesName: string;
  strainNumber: string;
  genomeAccession?: string;
  cultureCollection?: string;
  taxonomyId?: string;
  status?: string;
  url?: string;
}

/**
 * A genome information result
 * 基因组信息结果
 */
export interface GenomeResult {
  accession: string;
  speciesName: string;
  strainNumber: string;
  genomeSize?: string;
  gcContent?: string;
  contigs?: number;
  n50?: string;
  assemblyLevel?: string;
  url?: string;
}

/**
 * A 16S rDNA sequence result
 * 16S rDNA 序列结果
 */
export interface RdnaResult {
  accession: string;
  speciesName: string;
  strainNumber: string;
  sequenceLength?: number;
  url?: string;
}

/**
 * A functional annotation result
 * 功能注释结果
 */
export interface FunctionResult {
  category: FunctionCategory;
  speciesName: string;
  strainNumber: string;
  accession?: string;
  description?: string;
  count?: number;
  url?: string;
}

/**
 * A statistics result
 * 统计结果
 */
export interface StatisticsResult {
  totalSpecies?: number;
  totalTypeStrains?: number;
  totalGenomes?: number;
  totalSequences?: number;
  byCategory?: Record<string, number>;
  description?: string;
}

/**
 * Generic search response
 * 通用搜索响应
 */
export interface SearchResponse<T = unknown> {
  success: boolean;
  query?: string;
  total?: number;
  results: T[];
  message?: string;
  source?: string;
}

/**
 * MCP tool definition interface
 * MCP 工具定义接口
 */
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
}

/**
 * Project info about gcType
 * 关于 gcType 的项目信息
 */
export interface ProjectInfo {
  name: string;
  description: string;
  url: string;
  organization: string;
  contactEmail: string;
  version: string;
}

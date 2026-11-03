/**
 * Configuration for gcType-MCP Server
 * gcType MCP Server 配置
 *
 * @version 0.1.0
 */

/**
 * Base configuration constants
 * 基础配置常量
 */
export const config = {
  /** gcType website base URL / gcType 网站基础 URL */
  BASE_URL: "https://gctype.wdcm.org",

  /** MCP Server name / MCP 服务器名称 */
  SERVER_NAME: "gctype-mcp",

  /** MCP Server version / MCP 服务器版本 */
  SERVER_VERSION: "0.1.0",

  /** Request timeout in milliseconds / 请求超时时间（毫秒） */
  REQUEST_TIMEOUT: 30000,

  /** Maximum number of results to return / 返回结果的最大数量 */
  MAX_RESULTS: 50,

  /** Default number of results per page / 默认每页结果数 */
  DEFAULT_PAGE_SIZE: 20,

  /** User agent for HTTP requests / HTTP 请求的 User Agent */
  USER_AGENT: "gcType-MCP/0.1.0 (https://github.com/ZengZichao/gcType-MCP)",
} as const;

/**
 * gcType data page URLs
 * gcType 数据页面 URL 映射
 */
export const DATA_URLS = {
  home: "/",
  validPublishedSpecies: "/valid_published_species",
  typeStrains: "/type_strains",
  typeStrainsByCollection: "/type_strains_by_collection",
  typeStrainGenomes: "/type_strain_genomes",
  rnaSequences: "/16s_rdna_sequences",
  gcm10kGenomes: "/gcm_10k_genomes",
  novelSpeciesGenomes: "/novel_species_genomes",
  coreGenome: "/core_genome",
  prophage: "/prophage",
  defenseSystem: "/defense_system",
  mobileGeneticElements: "/mobile_genetic_elements",
  antibioticsResistance: "/antibiotics_resistance",
  virulenceFactors: "/virulence_factors",
  bgcs: "/bgcs",
  metaDataSearch: "/meta_data_search",
  about: "/about",
  sops: "/sops",
  citation: "/citation",
  genomeAnalysis: "/genome_analysis",
  speciesIdentification: "/species_identification",
  structureBasedAlignment: "/structure_based_alignment",
  statistics: "/statistics",
  download: "/download",
  dataUsagePolicy: "/data_usage_policy",
  sequencingNovelSpecies: "/sequencing_novel_species",
} as const;

/**
 * Build a full URL from a path
 * 从路径构建完整 URL
 *
 * @param path - The path on gcType website
 * @returns Full URL
 */
export function buildUrl(path: string): string {
  if (path.startsWith("http")) {
    return path;
  }
  return `${config.BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

/**
 * Data category labels (for display)
 * 数据类别标签（用于显示）
 */
export const CATEGORY_LABELS: Record<string, { en: string; zh: string }> = {
  valid_published_species: {
    en: "Valid Published Species",
    zh: "有效发表物种",
  },
  type_strains: {
    en: "Type Strains",
    zh: "模式菌株",
  },
  type_strains_by_collection: {
    en: "Type Strains by Culture Collection",
    zh: "按菌种保藏中心分类的模式菌株",
  },
  type_strain_genomes: {
    en: "Type Strain Genomes",
    zh: "模式菌株基因组",
  },
  "16s_rdna_sequences": {
    en: "16S rDNA Sequences",
    zh: "16S rDNA 序列",
  },
  gcm_10k_genomes: {
    en: "GCM 10K Genomes",
    zh: "GCM 万株基因组",
  },
  novel_species_genomes: {
    en: "Novel Species Genomes",
    zh: "新种基因组",
  },
  core_genome: {
    en: "Core Genome",
    zh: "核心基因组",
  },
  prophage: {
    en: "Prophage",
    zh: "原噬菌体",
  },
  defense_system: {
    en: "Defense System",
    zh: "防御系统",
  },
  mobile_genetic_elements: {
    en: "Mobile Genetic Elements",
    zh: "可移动遗传元件",
  },
  antibiotics_resistance: {
    en: "Antibiotics Resistance",
    zh: "抗生素抗性",
  },
  virulence_factors: {
    en: "Virulence Factors",
    zh: "毒力因子",
  },
  biosynthetic_gene_clusters: {
    en: "Biosynthetic Gene Clusters (BGCs)",
    zh: "生物合成基因簇",
  },
};

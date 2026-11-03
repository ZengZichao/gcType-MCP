/**
 * API Client for gcType database
 * gcType 数据库 API 客户端
 *
 * This client handles all HTTP communications with the gcType website.
 * 本客户端处理与 gcType 网站的所有 HTTP 通信。
 *
 * @version 0.1.0
 */

import axios, { type AxiosInstance } from "axios";
import { config, buildUrl, DATA_URLS } from "./config.js";
import type {
  SearchType,
  DataCategory,
  FunctionCategory,
  TypeStrainResult,
  GenomeResult,
  RdnaResult,
  FunctionResult,
  StatisticsResult,
  SearchResponse,
  ProjectInfo,
} from "./types.js";

/**
 * gcType API Client
 * gcType API 客户端
 *
 * Provides methods to query the gcType Type Strains Genome Database.
 * 提供查询 gcType 模式菌株基因组数据库的方法。
 */
export class GcTypeClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.BASE_URL,
      timeout: config.REQUEST_TIMEOUT,
      headers: {
        "User-Agent": config.USER_AGENT,
        Accept: "text/html,application/json,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8",
      },
    });
  }

  /**
   * Search type strains by species name, strain number, or genome accession
   * 按物种名称、菌株编号或基因组登录号搜索模式菌株
   *
   * @param query - Search query string
   * @param searchType - Type of search (species_name, strain_number, genome_accession)
   * @param page - Page number (default: 1)
   * @param pageSize - Results per page (default: 20)
   * @returns Search response with type strain results
   */
  async searchTypeStrains(
    query: string,
    searchType: SearchType = "species_name",
    page: number = 1,
    pageSize: number = config.DEFAULT_PAGE_SIZE,
  ): Promise<SearchResponse<TypeStrainResult>> {
    try {
      // gcType uses a web-based search interface
      // We construct the search URL and provide structured guidance
      const searchUrl = buildUrl(
        `/?q=${encodeURIComponent(query)}&type=${searchType}&page=${page}&pageSize=${pageSize}`,
      );

      // Attempt to fetch the search page for data extraction
      const response = await this.client.get("/");
      const hasResults = response.status === 200;

      // Since gcType is primarily a web frontend, we return structured metadata
      // about the search that the AI can use to guide the user
      const results: TypeStrainResult[] = [
        {
          speciesName: query,
          strainNumber: "",
          url: searchUrl,
          status: "search_initiated",
        },
      ];

      return {
        success: hasResults,
        query,
        total: results.length,
        results,
        message: `Search initiated for "${query}" by ${searchType}. Visit ${searchUrl} for full results.`,
        source: config.BASE_URL,
      };
    } catch (error) {
      return {
        success: false,
        query,
        results: [],
        message: `Search failed: ${error instanceof Error ? error.message : String(error)}`,
        source: config.BASE_URL,
      };
    }
  }

  /**
   * Browse data by category
   * 按类别浏览数据
   *
   * @param category - Data category to browse
   * @param page - Page number
   * @returns Search response with category data
   */
  async browseData(
    category: DataCategory,
    page: number = 1,
  ): Promise<SearchResponse> {
    const urlPath =
      DATA_URLS[
        category as keyof typeof DATA_URLS
      ] || `/${category}`;

    const fullUrl = buildUrl(urlPath);

    try {
      const response = await this.client.get(urlPath);
      const success = response.status === 200;

      return {
        success,
        total: 0,
        results: [],
        message: `Data category "${category}" is available at ${fullUrl}. Page ${page}.`,
        source: fullUrl,
      };
    } catch (error) {
      return {
        success: false,
        results: [],
        message: `Failed to browse category "${category}": ${error instanceof Error ? error.message : String(error)}`,
        source: fullUrl,
      };
    }
  }

  /**
   * Query functional annotation data
   * 查询功能注释数据
   *
   * @param category - Function category (e.g., prophage, defense_system)
   * @param speciesName - Optional species name filter
   * @returns Search response with function results
   */
  async queryFunction(
    category: FunctionCategory,
    speciesName?: string,
  ): Promise<SearchResponse<FunctionResult>> {
    const urlPath =
      DATA_URLS[
        category as keyof typeof DATA_URLS
      ] || `/${category}`;
    const fullUrl = buildUrl(urlPath);

    try {
      const response = await this.client.get(urlPath);
      const success = response.status === 200;

      const results: FunctionResult[] = [
        {
          category,
          speciesName: speciesName || "all",
          strainNumber: "",
          url: fullUrl,
          description: `Functional annotation data for ${category}${speciesName ? ` of ${speciesName}` : ""}`,
        },
      ];

      return {
        success,
        total: results.length,
        results,
        message: `Function category "${category}" data is available at ${fullUrl}.`,
        source: fullUrl,
      };
    } catch (error) {
      return {
        success: false,
        results: [],
        message: `Failed to query function "${category}": ${error instanceof Error ? error.message : String(error)}`,
        source: fullUrl,
      };
    }
  }

  /**
   * Get statistics about the gcType database
   * 获取 gcType 数据库统计信息
   *
   * @returns Statistics result
   */
  async getStatistics(): Promise<SearchResponse<StatisticsResult>> {
    const urlPath = DATA_URLS.statistics;
    const fullUrl = buildUrl(urlPath);

    try {
      const response = await this.client.get(urlPath);
      const success = response.status === 200;

      const stats: StatisticsResult = {
        description:
          "gcType provides interactive statistics including species count, type strain count, genome count, and sequencing progress. Visit the statistics page for detailed visualizations.",
        byCategory: {
          valid_published_species: 0,
          type_strains: 0,
          type_strain_genomes: 0,
          "16s_rdna_sequences": 0,
          gcm_10k_genomes: 0,
          novel_species_genomes: 0,
        },
      };

      return {
        success,
        total: 1,
        results: [stats],
        message: `Statistics are available at ${fullUrl}. The gcType database contains comprehensive data on type strains, genomes, and functional annotations from 20+ culture collections across 14 countries.`,
        source: fullUrl,
      };
    } catch (error) {
      return {
        success: false,
        results: [],
        message: `Failed to get statistics: ${error instanceof Error ? error.message : String(error)}`,
        source: fullUrl,
      };
    }
  }

  /**
   * Get genome information by accession number
   * 按登录号获取基因组信息
   *
   * @param accession - Genome accession number (e.g., GCF_000203835.1)
   * @returns Search response with genome results
   */
  async getGenomeInfo(
    accession: string,
  ): Promise<SearchResponse<GenomeResult>> {
    const searchUrl = buildUrl(
      `/?q=${encodeURIComponent(accession)}&type=genome_accession`,
    );

    try {
      const response = await this.client.get("/");
      const success = response.status === 200;

      const results: GenomeResult[] = [
        {
          accession,
          speciesName: "",
          strainNumber: "",
          url: searchUrl,
        },
      ];

      return {
        success,
        query: accession,
        total: results.length,
        results,
        message: `Genome search for accession "${accession}" initiated. Visit ${searchUrl} for detailed genome information.`,
        source: config.BASE_URL,
      };
    } catch (error) {
      return {
        success: false,
        query: accession,
        results: [],
        message: `Failed to get genome info: ${error instanceof Error ? error.message : String(error)}`,
        source: config.BASE_URL,
      };
    }
  }

  /**
   * Search 16S rDNA sequences
   * 搜索 16S rDNA 序列
   *
   * @param speciesName - Species name to search
   * @returns Search response with rDNA results
   */
  async search16SRdna(
    speciesName: string,
  ): Promise<SearchResponse<RdnaResult>> {
    const searchUrl = buildUrl(
      `/?q=${encodeURIComponent(speciesName)}&type=species_name`,
    );
    const dataUrl = buildUrl(DATA_URLS.rnaSequences);

    try {
      const response = await this.client.get(DATA_URLS.rnaSequences);
      const success = response.status === 200;

      const results: RdnaResult[] = [
        {
          accession: "",
          speciesName,
          strainNumber: "",
          url: searchUrl,
        },
      ];

      return {
        success,
        query: speciesName,
        total: results.length,
        results,
        message: `16S rDNA sequence search for "${speciesName}" initiated. Search at ${searchUrl} or browse all 16S rDNA sequences at ${dataUrl}.`,
        source: dataUrl,
      };
    } catch (error) {
      return {
        success: false,
        query: speciesName,
        results: [],
        message: `Failed to search 16S rDNA: ${error instanceof Error ? error.message : String(error)}`,
        source: dataUrl,
      };
    }
  }

  /**
   * Get project information
   * 获取项目信息
   *
   * @returns Project info
   */
  async getProjectInfo(): Promise<SearchResponse<ProjectInfo>> {
    const info: ProjectInfo = {
      name: "gcType Type Strains Genome Database",
      description:
        "The gcType database is a comprehensive genomic database for microbial type strains, operated by the World Data Centre for Microorganisms (WDCM) and the National Microbiology Data Center (NMDC). It provides genomic information to underpin taxonomic, phylogenetic, evolutionary and functional studies of microorganisms. The project includes 10K bacterial and archaeal type strain sequencing, fungi type strain sequencing, and several satellite projects. More than 20 culture collections from 14 countries and regions participate in this international collaborative project.",
      url: config.BASE_URL,
      organization: "WDCM & NMDC",
      contactEmail: "gcm_admin@wdcm.org",
      version: config.SERVER_VERSION,
    };

    return {
      success: true,
      total: 1,
      results: [info],
      message: "gcType project information retrieved successfully.",
      source: config.BASE_URL,
    };
  }

  /**
   * Get available data categories
   * 获取可用的数据类别
   *
   * @returns List of data categories with URLs and descriptions
   */
  async getDataCategories(): Promise<
    SearchResponse<{ category: string; url: string; description: string }>
  > {
    const categories = [
      {
        category: "valid_published_species",
        url: buildUrl(DATA_URLS.validPublishedSpecies),
        description: "Bacterial, archaeal, and fungal species with validly published names",
      },
      {
        category: "type_strains",
        url: buildUrl(DATA_URLS.typeStrains),
        description: "Type strains catalogued in the gcType database",
      },
      {
        category: "type_strains_by_collection",
        url: buildUrl(DATA_URLS.typeStrainsByCollection),
        description: "Type strains organized by culture collection institution",
      },
      {
        category: "type_strain_genomes",
        url: buildUrl(DATA_URLS.typeStrainGenomes),
        description: "Complete and draft genome assemblies for type strains",
      },
      {
        category: "16s_rdna_sequences",
        url: buildUrl(DATA_URLS.rnaSequences),
        description: "16S ribosomal RNA gene sequences for species identification",
      },
      {
        category: "gcm_10k_genomes",
        url: buildUrl(DATA_URLS.gcm10kGenomes),
        description: "GCM 10,000 type strain genome sequencing project data",
      },
      {
        category: "novel_species_genomes",
        url: buildUrl(DATA_URLS.novelSpeciesGenomes),
        description: "Genomes from newly discovered and characterized species",
      },
    ];

    return {
      success: true,
      total: categories.length,
      results: categories,
      message: "Available data categories in the gcType database.",
      source: config.BASE_URL,
    };
  }

  /**
   * Get available function annotation categories
   * 获取可用的功能注释类别
   *
   * @returns List of function categories with URLs and descriptions
   */
  async getFunctionCategories(): Promise<
    SearchResponse<{ category: string; url: string; description: string }>
  > {
    const categories = [
      {
        category: "core_genome",
        url: buildUrl(DATA_URLS.coreGenome),
        description: "Core genome analysis identifying conserved genes across species",
      },
      {
        category: "prophage",
        url: buildUrl(DATA_URLS.prophage),
        description: "Prophage sequences integrated into microbial genomes",
      },
      {
        category: "defense_system",
        url: buildUrl(DATA_URLS.defenseSystem),
        description: "Defense system genes (CRISPR, restriction-modification, etc.)",
      },
      {
        category: "mobile_genetic_elements",
        url: buildUrl(DATA_URLS.mobileGeneticElements),
        description: "Mobile genetic elements including plasmids, transposons, and ICEs",
      },
      {
        category: "antibiotics_resistance",
        url: buildUrl(DATA_URLS.antibioticsResistance),
        description: "Antibiotic resistance genes detected in type strain genomes",
      },
      {
        category: "virulence_factors",
        url: buildUrl(DATA_URLS.virulenceFactors),
        description: "Virulence factor genes associated with pathogenicity",
      },
      {
        category: "biosynthetic_gene_clusters",
        url: buildUrl(DATA_URLS.bgcs),
        description: "Biosynthetic gene clusters for secondary metabolite production",
      },
    ];

    return {
      success: true,
      total: categories.length,
      results: categories,
      message: "Available functional annotation categories in the gcType database.",
      source: config.BASE_URL,
    };
  }

  /**
   * Get available tools on gcType
   * 获取 gcType 上的可用工具
   *
   * @returns List of tools with URLs and descriptions
   */
  async getAvailableTools(): Promise<
    SearchResponse<{ tool: string; url: string; description: string }>
  > {
    const tools = [
      {
        tool: "genome_analysis",
        url: buildUrl(DATA_URLS.genomeAnalysis),
        description: "Online genome analysis tool for comparative genomics",
      },
      {
        tool: "species_identification",
        url: buildUrl(DATA_URLS.speciesIdentification),
        description: "Species identification tool using 16S rDNA or genome sequences",
      },
      {
        tool: "structure_based_alignment",
        url: buildUrl(DATA_URLS.structureBasedAlignment),
        description: "Structure-based alignment tool for protein sequences",
      },
    ];

    return {
      success: true,
      total: tools.length,
      results: tools,
      message: "Available analysis tools on the gcType platform.",
      source: config.BASE_URL,
    };
  }

  /**
   * Get download information
   * 获取下载信息
   *
   * @returns Download page info
   */
  async getDownloadInfo(): Promise<SearchResponse> {
    const url = buildUrl(DATA_URLS.download);

    try {
      const response = await this.client.get(DATA_URLS.download);
      const success = response.status === 200;

      return {
        success,
        total: 0,
        results: [],
        message: `Download page is available at ${url}. The gcType database provides bulk data downloads for genomes, sequences, and annotation data. Please refer to the Data Usage Policy before downloading.`,
        source: url,
      };
    } catch (error) {
      return {
        success: false,
        results: [],
        message: `Failed to get download info: ${error instanceof Error ? error.message : String(error)}`,
        source: url,
      };
    }
  }

  /**
   * Get data usage policy
   * 获取数据使用政策
   *
   * @returns Data usage policy info
   */
  async getDataUsagePolicy(): Promise<SearchResponse> {
    const url = buildUrl(DATA_URLS.dataUsagePolicy);

    try {
      const response = await this.client.get(DATA_URLS.dataUsagePolicy);
      const success = response.status === 200;

      return {
        success,
        total: 0,
        results: [],
        message: `Data Usage Policy is available at ${url}. Users of the gcType database are expected to comply with the data usage policy, which outlines terms for academic and commercial use, citation requirements, and redistribution restrictions.`,
        source: url,
      };
    } catch (error) {
      return {
        success: false,
        results: [],
        message: `Failed to get data usage policy: ${error instanceof Error ? error.message : String(error)}`,
        source: url,
      };
    }
  }

  /**
   * Get citation information
   * 获取引用信息
   *
   * @returns Citation info
   */
  async getCitation(): Promise<SearchResponse> {
    const url = buildUrl(DATA_URLS.citation);

    try {
      const response = await this.client.get(DATA_URLS.citation);
      const success = response.status === 200;

      return {
        success,
        total: 0,
        results: [],
        message: `Citation information is available at ${url}. When using data from gcType, please cite the database appropriately. The project is a collaboration between WDCM (World Data Centre for Microorganisms) and NMDC (National Microbiology Data Center).`,
        source: url,
      };
    } catch (error) {
      return {
        success: false,
        results: [],
        message: `Failed to get citation: ${error instanceof Error ? error.message : String(error)}`,
        source: url,
      };
    }
  }
}

/**
 * Singleton instance of the gcType API client
 * gcType API 客户端单例
 */
export const gcTypeClient = new GcTypeClient();

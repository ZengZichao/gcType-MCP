#!/usr/bin/env node

/**
 * gcType MCP Server - Main Entry Point
 * gcType MCP 服务器 - 主入口
 *
 * An MCP (Model Context Protocol) server that provides AI assistants
 * with access to the gcType Type Strains Genome Database.
 *
 * 一个 MCP（模型上下文协议）服务器，为 AI 助手提供
 * 对 gcType 模式菌株基因组数据库的访问。
 *
 * @version 0.1.0
 * @license MIT
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { config } from "./config.js";
import { tools } from "./tools.js";
import { gcTypeClient } from "./api.js";
import type { SearchType, DataCategory, FunctionCategory } from "./types.js";

/**
 * Create and configure the MCP server instance
 * 创建并配置 MCP 服务器实例
 */
const server = new Server(
  {
    name: config.SERVER_NAME,
    version: config.SERVER_VERSION,
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

/**
 * Handle ListTools requests
 * 处理工具列表请求
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    })),
  };
});

/**
 * Handle CallTool requests
 * 处理工具调用请求
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result: unknown;

    switch (name) {
      case "search_type_strains": {
        const query = String(args?.query ?? "");
        const searchType = String(args?.searchType ?? "species_name") as SearchType;
        const page = Number(args?.page ?? 1);
        const pageSize = Number(args?.pageSize ?? 20);
        result = await gcTypeClient.searchTypeStrains(query, searchType, page, pageSize);
        break;
      }

      case "browse_data_category": {
        const category = String(args?.category ?? "") as DataCategory;
        const page = Number(args?.page ?? 1);
        result = await gcTypeClient.browseData(category, page);
        break;
      }

      case "query_function_annotation": {
        const category = String(args?.category ?? "") as FunctionCategory;
        const speciesName = args?.speciesName ? String(args.speciesName) : undefined;
        result = await gcTypeClient.queryFunction(category, speciesName);
        break;
      }

      case "get_statistics": {
        result = await gcTypeClient.getStatistics();
        break;
      }

      case "get_genome_info": {
        const accession = String(args?.accession ?? "");
        result = await gcTypeClient.getGenomeInfo(accession);
        break;
      }

      case "search_16s_rdna": {
        const speciesName = String(args?.speciesName ?? "");
        result = await gcTypeClient.search16SRdna(speciesName);
        break;
      }

      case "get_project_info": {
        result = await gcTypeClient.getProjectInfo();
        break;
      }

      case "list_data_categories": {
        result = await gcTypeClient.getDataCategories();
        break;
      }

      case "list_function_categories": {
        result = await gcTypeClient.getFunctionCategories();
        break;
      }

      case "list_available_tools": {
        result = await gcTypeClient.getAvailableTools();
        break;
      }

      case "get_download_info": {
        result = await gcTypeClient.getDownloadInfo();
        break;
      }

      case "get_data_usage_policy": {
        result = await gcTypeClient.getDataUsagePolicy();
        break;
      }

      case "get_citation": {
        result = await gcTypeClient.getCitation();
        break;
      }

      default: {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error: Unknown tool "${name}". Available tools: ${tools.map((t) => t.name).join(", ")}`,
            },
          ],
          isError: true,
        };
      }
    }

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text" as const,
          text: `Error executing tool "${name}": ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

/**
 * Start the server using stdio transport
 * 使用 stdio 传输启动服务器
 */
async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Log to stderr (stdout is reserved for MCP protocol)
  // 日志输出到 stderr（stdout 保留给 MCP 协议）
  console.error(`gcType MCP Server v${config.SERVER_VERSION} started`);
  console.error(`Server name: ${config.SERVER_NAME}`);
  console.error(`gcType URL: ${config.BASE_URL}`);
  console.error(`Available tools: ${tools.length}`);
}

// Handle graceful shutdown
// 处理优雅关闭
process.on("SIGINT", () => {
  console.error("gcType MCP Server shutting down...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.error("gcType MCP Server terminated.");
  process.exit(0);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});

// Run the server
// 运行服务器
main().catch((error) => {
  console.error("Fatal error starting server:", error);
  process.exit(1);
});

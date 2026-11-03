# Architecture

This document describes the architecture and design of the gcType-MCP server.

## Overview

The gcType-MCP server is built on the **Model Context Protocol (MCP)** specification and uses a modular, layered architecture. The server acts as a bridge between AI assistants and the gcType Type Strains Genome Database website.

```
┌─────────────────┐     MCP Protocol      ┌─────────────────┐     HTTP      ┌─────────────────┐
│   AI Assistant   │ ◄──────────────────► │  gcType-MCP     │ ◄──────────► │  gcType Website │
│  (Claude, etc.)  │     (stdio)           │  Server         │   (HTTPS)     │  gctype.wdcm.org│
└─────────────────┘                        └─────────────────┘               └─────────────────┘
                                                    │
                                                    │
                                           ┌────────┴────────┐
                                           │  Tool Handlers  │
                                           │  (13 tools)     │
                                           └────────┬────────┘
                                                    │
                                           ┌────────┴────────┐
                                           │  API Client     │
                                           │  (Axios)        │
                                           └────────┬────────┘
                                                    │
                                           ┌────────┴────────┐
                                           │  Config & Types │
                                           └─────────────────┘
```

## Components

### 1. Entry Point (`src/index.ts`)

The main entry point that:

- Creates an MCP `Server` instance with stdio transport
- Registers request handlers for `ListTools` and `CallTool` operations
- Routes tool calls to the appropriate API client methods
- Handles errors and returns structured responses
- Manages graceful shutdown (SIGINT, SIGTERM)

**Key responsibilities:**
- MCP protocol communication
- Tool dispatch and error handling
- Process lifecycle management

### 2. Configuration (`src/config.ts`)

Centralized configuration containing:

- **Constants**: Server name, version, base URL, timeout, page size
- **URL mappings**: `DATA_URLS` object mapping category names to gcType website paths
- **Helper functions**: `buildUrl()` for constructing full URLs
- **Labels**: `CATEGORY_LABELS` for bilingual category display

### 3. Type Definitions (`src/types.ts`)

TypeScript interfaces and type unions defining:

- Search types (`SearchType`)
- Data categories (`DataCategory`)
- Function categories (`FunctionCategory`)
- Result types (`TypeStrainResult`, `GenomeResult`, `RdnaResult`, `FunctionResult`, `StatisticsResult`)
- Response type (`SearchResponse<T>`)
- Tool definition interface (`ToolDefinition`)
- Project info interface (`ProjectInfo`)

### 4. API Client (`src/api.ts`)

The `GcTypeClient` class that handles all HTTP communication with the gcType website:

- Uses **Axios** for HTTP requests
- Configured with custom User-Agent and headers
- Provides methods for each tool operation
- Returns structured `SearchResponse` objects
- Handles errors gracefully with informative messages

**Methods:**
| Method | Tool | Description |
|--------|------|-------------|
| `searchTypeStrains()` | `search_type_strains` | Search by species/strain/accession |
| `browseData()` | `browse_data_category` | Browse by category |
| `queryFunction()` | `query_function_annotation` | Query function data |
| `getStatistics()` | `get_statistics` | Get database stats |
| `getGenomeInfo()` | `get_genome_info` | Get genome by accession |
| `search16SRdna()` | `search_16s_rdna` | Search 16S rDNA |
| `getProjectInfo()` | `get_project_info` | Get project info |
| `getDataCategories()` | `list_data_categories` | List data categories |
| `getFunctionCategories()` | `list_function_categories` | List function categories |
| `getAvailableTools()` | `list_available_tools` | List analysis tools |
| `getDownloadInfo()` | `get_download_info` | Get download info |
| `getDataUsagePolicy()` | `get_data_usage_policy` | Get usage policy |
| `getCitation()` | `get_citation` | Get citation info |

### 5. Tool Definitions (`src/tools.ts`)

Declarative tool definitions for the MCP protocol:

- Each tool has a `name`, `description`, and `inputSchema`
- Descriptions are bilingual (English + Chinese)
- Input schemas use JSON Schema format
- The `getToolByName()` helper allows lookup by name

## Design Principles

### 1. Protocol Compliance

The server strictly follows the MCP specification:
- Uses `@modelcontextprotocol/sdk` for protocol handling
- Supports `ListToolsRequest` and `CallToolRequest`
- Returns content in the standard `{ content: [{ type: "text", text: "..." }] }` format

### 2. Modularity

Each concern is separated into its own module:
- Configuration → `config.ts`
- Types → `types.ts`
- API communication → `api.ts`
- Tool definitions → `tools.ts`
- Server logic → `index.ts`

### 3. Type Safety

Full TypeScript implementation with:
- Strict mode enabled
- No `any` types in public interfaces
- Generic `SearchResponse<T>` for typed results
- Enum unions for constrained values

### 4. Error Resilience

- All API methods use try/catch
- Errors are returned as structured responses, not thrown
- Process-level error handlers for uncaught exceptions
- Graceful shutdown on SIGINT/SIGTERM

### 5. Bilingual Support

- All tool descriptions include both English and Chinese
- Documentation provided in both languages
- Category labels support both languages

## Data Flow

```
1. AI Assistant sends CallToolRequest via stdio
2. Server receives request in CallToolRequestSchema handler
3. Handler dispatches to appropriate method on gcTypeClient
4. gcTypeClient makes HTTP request to gctype.wdcm.org
5. Response is structured into SearchResponse<T>
6. Response is serialized to JSON and returned as MCP content
7. AI Assistant receives and processes the response
```

## Build System

- **TypeScript** compiler (`tsc`) with ESNext modules
- `tsc-alias` for path alias resolution (`@/*` → `src/*`)
- ES2022 target for modern Node.js features
- Source maps and declaration files for debugging
- ESLint for code quality

## Dependencies

### Runtime

| Package | Purpose |
|---------|---------|
| `@modelcontextprotocol/sdk` | MCP protocol implementation |
| `axios` | HTTP client for gcType API |
| `zod` | Schema validation (future use) |

### Development

| Package | Purpose |
|---------|---------|
| `typescript` | TypeScript compiler |
| `tsx` | Development runner with hot-reload |
| `@types/node` | Node.js type definitions |
| `eslint` | Code linting |
| `typescript-eslint` | TypeScript ESLint plugin and parser |
| `tsc-alias` | Path alias resolution |

## Future Enhancements

Potential areas for future development:

1. **Direct API integration**: If gcType exposes a REST API, replace web scraping with direct API calls
2. **Caching**: Add response caching to reduce redundant HTTP requests
3. **Batch queries**: Support multiple queries in a single tool call
4. **Advanced search**: Add filters for taxonomy, genome quality, annotation status
5. **Data export**: Enable downloading of structured data in FASTA/CSV formats
6. **Authentication**: Support API keys if gcType adds authentication

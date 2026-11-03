# gcType-MCP

**Version: 0.1.0**

> An MCP (Model Context Protocol) server for the [gcType Type Strains Genome Database](https://gctype.wdcm.org/), providing AI assistants with seamless access to microbial type strain genome data, species information, 16S rDNA sequences, functional annotations, and more.

[English](./README.md) | [中文](./README.zh.md)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [Available Tools](#available-tools)
- [Usage Examples](#usage-examples)
- [Project Structure](#project-structure)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Overview

**gcType-MCP** is a Model Context Protocol (MCP) server that bridges AI assistants with the [gcType Type Strains Genome Database](https://gctype.wdcm.org/). The gcType database, operated by the [World Data Centre for Microorganisms (WDCM)](https://www.wdcm.org/) and the [National Microbiology Data Center (NMDC)](https://nmdc.cn/), is a comprehensive genomic database for microbial type strains, covering bacteria, archaea, and fungi.

By using this MCP server, AI assistants (such as Claude) can:

- Search type strains by species name, strain number, or genome accession
- Browse data across multiple categories (valid published species, type strain genomes, 16S rDNA sequences, etc.)
- Query functional annotations (core genome, prophage, defense systems, antibiotic resistance, virulence factors, BGCs, etc.)
- Access statistics, project information, and citation details
- Provide guidance on data download and usage policies

## Features

- **13 MCP Tools**: Comprehensive coverage of gcType database functionality
- **MCP Protocol Compliant**: Built on the official MCP SDK with stdio transport
- **Bilingual**: All documentation available in both English and Chinese
- **TypeScript**: Full type safety and modern ES module implementation
- **Lightweight**: Minimal dependencies, fast startup
- **Extensible**: Clean architecture for easy addition of new tools

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18.0.0
- An MCP-compatible AI client (e.g., [Claude Desktop](https://claude.ai/))

### Install & Configure

1. **Clone the repository:**

```bash
git clone https://github.com/ZengZichao/gcType-MCP.git
cd gcType-MCP
```

2. **Install dependencies and build:**

```bash
npm install
npm run build
```

3. **Configure your MCP client:**

Add the following to your MCP client configuration (e.g., Claude Desktop's `claude_desktop_config.json`):

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

> Replace `/path/to/gcType-MCP/dist/index.js` with the actual absolute path to the built server.

4. **Restart your AI client** and start asking questions about microbial type strains!

## Installation

### From Source

```bash
git clone https://github.com/ZengZichao/gcType-MCP.git
cd gcType-MCP
npm install
npm run build
```

### Using npx (coming soon)

```bash
npx gctype-mcp
```

## Configuration

### MCP Client Configuration

The gcType-MCP server uses **stdio transport** and requires no additional configuration files. Simply point your MCP client to the built server entry point.

#### Claude Desktop

Edit `claude_desktop_config.json`:

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

Add to your MCP settings:

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

### Environment Variables

The server works without any environment variables. The following options are available for customization (via code constants in `src/config.ts`):

| Option | Default | Description |
|--------|---------|-------------|
| `BASE_URL` | `https://gctype.wdcm.org` | gcType website base URL |
| `REQUEST_TIMEOUT` | `30000` | HTTP request timeout (ms) |
| `MAX_RESULTS` | `50` | Maximum results to return |
| `DEFAULT_PAGE_SIZE` | `20` | Default results per page |

## Available Tools

The gcType-MCP server provides 13 tools:

### Search & Browse

| Tool | Description |
|------|-------------|
| `search_type_strains` | Search type strains by species name, strain number, or genome accession |
| `browse_data_category` | Browse data by category (valid species, type strains, genomes, etc.) |
| `get_genome_info` | Get genome information by accession number |
| `search_16s_rdna` | Search 16S rDNA sequences by species name |

### Functional Annotations

| Tool | Description |
|------|-------------|
| `query_function_annotation` | Query functional annotation data (core genome, prophage, defense system, etc.) |

### Discovery & Metadata

| Tool | Description |
|------|-------------|
| `get_statistics` | Get database statistics |
| `get_project_info` | Get gcType project information |
| `list_data_categories` | List all available data categories |
| `list_function_categories` | List all functional annotation categories |
| `list_available_tools` | List analysis tools on the gcType platform |

### Policy & Citation

| Tool | Description |
|------|-------------|
| `get_download_info` | Get data download information |
| `get_data_usage_policy` | Get data usage policy |
| `get_citation` | Get citation information |

For detailed tool schemas and parameters, see the [Tools Documentation](./docs/tools.md).

## Usage Examples

### Example 1: Search for a Type Strain

Ask your AI assistant:

> "Search the gcType database for *Streptomyces rubiginosus*"

The AI will use the `search_type_strains` tool:

```json
{
  "query": "Streptomyces rubiginosus",
  "searchType": "species_name"
}
```

### Example 2: Browse Type Strain Genomes

> "Show me the type strain genomes available in gcType"

The AI will use the `browse_data_category` tool:

```json
{
  "category": "type_strain_genomes"
}
```

### Example 3: Query Antibiotic Resistance Data

> "What antibiotic resistance genes are available in gcType?"

The AI will use the `query_function_annotation` tool:

```json
{
  "category": "antibiotics_resistance"
}
```

### Example 4: Search 16S rDNA Sequences

> "Find 16S rDNA sequences for *Escherichia coli*"

The AI will use the `search_16s_rdna` tool:

```json
{
  "speciesName": "Escherichia coli"
}
```

### Example 5: Get Database Statistics

> "How many species and genomes are in the gcType database?"

The AI will use the `get_statistics` tool.

## Project Structure

```
gcType-MCP/
├── src/
│   ├── index.ts          # MCP server entry point
│   ├── config.ts         # Configuration constants and URL mappings
│   ├── api.ts            # gcType API client
│   ├── tools.ts          # MCP tool definitions
│   └── types.ts          # TypeScript type definitions
├── docs/
│   ├── installation.md       # Installation guide (English)
│   ├── installation.zh.md    # Installation guide (Chinese)
│   ├── tools.md              # Tools reference (English)
│   ├── tools.zh.md           # Tools reference (Chinese)
│   ├── architecture.md       # Architecture documentation (English)
│   └── architecture.zh.md    # Architecture documentation (Chinese)
├── package.json
├── tsconfig.json
├── .gitignore
├── .npmignore
├── LICENSE
├── README.md             # English README
├── README.zh.md          # Chinese README
├── CHANGELOG.md          # English changelog
├── CHANGELOG.zh.md       # Chinese changelog
└── eslint.config.js
```

## Development

### Building

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### Development Mode

```bash
npm run dev
```

Runs the server using `tsx` for hot-reload during development.

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Testing the Server

After building, you can test the server by running:

```bash
npm start
```

The server communicates via stdio. You can send MCP protocol messages to stdin and receive responses on stdout.

## Contributing

Contributions are welcome! Here's how you can contribute:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/my-feature`
3. **Commit** your changes: `git commit -am 'Add my feature'`
4. **Push** to the branch: `git push origin feature/my-feature`
5. **Open** a Pull Request

### Guidelines

- Follow the existing code style (TypeScript, ES modules)
- Add bilingual documentation (English and Chinese) for any new features
- Update the CHANGELOG files
- Ensure `npm run typecheck` and `npm run lint` pass
- Test your changes with an MCP-compatible AI client

## License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

## Acknowledgments

- **gcType Database**: Operated by the [World Data Centre for Microorganisms (WDCM)](https://www.wdcm.org/) and [National Microbiology Data Center (NMDC)](https://nmdc.cn/)
- **MCP SDK**: Built with the [Model Context Protocol SDK](https://github.com/modelcontextprotocol)
- **Project Contact**: Dr. Linhuan Wu (wulh@im.ac.cn) / gcm_admin@wdcm.org
- **Citation**: Please cite the gcType database appropriately when using data. See the [Citation page](https://gctype.wdcm.org/citation) for details.

---

<p align="center">
  <sub>Built with ❤️ for the microbiology research community</sub>
</p>

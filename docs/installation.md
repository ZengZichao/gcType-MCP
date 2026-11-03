# Installation Guide

This guide walks you through installing and configuring the gcType-MCP server.

## Prerequisites

- **Node.js** >= 18.0.0 — [Download](https://nodejs.org/)
- **npm** >= 9.0.0 (included with Node.js)
- An **MCP-compatible AI client**, such as:
  - [Claude Desktop](https://claude.ai/)
  - [Cursor](https://cursor.com/)
  - [VS Code with MCP extension](https://code.visualstudio.com/)
  - Any client supporting the Model Context Protocol

## Step 1: Clone the Repository

```bash
git clone https://github.com/ZengZichao/gcType-MCP.git
cd gcType-MCP
```

## Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages:
- `@modelcontextprotocol/sdk` — MCP protocol SDK
- `axios` — HTTP client
- `zod` — Schema validation
- `typescript-eslint` — TypeScript linting (dev)

## Step 3: Build the Server

```bash
npm run build
```

This compiles the TypeScript source in `src/` to JavaScript in `dist/`.

After a successful build, you should see:

```
dist/
├── index.js         # Main entry point
├── index.js.map
├── index.d.ts
├── config.js        # Configuration
├── api.js           # API client
├── tools.js         # Tool definitions
├── types.js         # Type definitions
└── ... (.d.ts, .d.ts.map, .js.map files for each module)
```

## Step 4: Configure Your MCP Client

### Claude Desktop

1. Locate your Claude Desktop configuration file:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. Add the gcType-MCP server:

```json
{
  "mcpServers": {
    "gctype": {
      "command": "node",
      "args": ["/absolute/path/to/gcType-MCP/dist/index.js"]
    }
  }
}
```

> **Important**: Use the **absolute path** to `dist/index.js`.

3. Restart Claude Desktop.

### Cursor

1. Open Cursor Settings → MCP Servers
2. Add a new server:

```json
{
  "name": "gctype",
  "command": "node",
  "args": ["/absolute/path/to/gcType-MCP/dist/index.js"]
}
```

### VS Code

1. Open Settings → MCP
2. Add server configuration:

```json
{
  "mcpServers": {
    "gctype": {
      "command": "node",
      "args": ["/absolute/path/to/gcType-MCP/dist/index.js"]
    }
  }
}
```

## Step 5: Verify the Installation

1. Start your AI client
2. Ask a question that requires gcType data, e.g.:
   > "Search the gcType database for Streptomyces rubiginosus"

3. The AI should use the `search_type_strains` tool and return results.

## Troubleshooting

### Server doesn't start

- Check that Node.js is installed: `node --version`
- Check that the build succeeded: `ls dist/index.js`
- Check the absolute path in your configuration

### Connection errors

- Verify the gcType website is accessible: `https://gctype.wdcm.org/`
- Check your network connection
- Review server logs (stderr output)

### Tool not found

- Ensure you've restarted your AI client after configuration changes
- Verify the server is running: check your AI client's MCP server status

### Build errors

- Ensure TypeScript is installed: `npm install`
- Check Node.js version: `node --version` (must be >= 18)
- Try cleaning and rebuilding:
  ```bash
  rm -rf dist node_modules
  npm install
  npm run build
  ```

## Development Mode

For development with hot-reload:

```bash
npm run dev
```

This uses `tsx` to run the TypeScript source directly without building.

## Next Steps

- Read the [Tools Reference](./tools.md) to learn about all available tools
- Read the [Architecture Documentation](./architecture.md) to understand the server design

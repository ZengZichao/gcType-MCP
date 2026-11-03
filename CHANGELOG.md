# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-11-03

### Added

- Initial release of gcType-MCP server.
- MCP server built on the Model Context Protocol (MCP) specification with stdio transport.
- 13 MCP tools for interacting with the gcType Type Strains Genome Database:
  - `search_type_strains` - Search type strains by species name, strain number, or genome accession.
  - `browse_data_category` - Browse data by category (valid published species, type strains, genomes, etc.).
  - `query_function_annotation` - Query functional annotation data (core genome, prophage, defense system, etc.).
  - `get_statistics` - Get database statistics including species, type strain, and genome counts.
  - `get_genome_info` - Get genome information by accession number.
  - `search_16s_rdna` - Search 16S rDNA sequences by species name.
  - `get_project_info` - Get gcType project information and description.
  - `list_data_categories` - List all available data categories with URLs and descriptions.
  - `list_function_categories` - List all available functional annotation categories.
  - `list_available_tools` - List analysis tools available on the gcType platform.
  - `get_download_info` - Get download page information.
  - `get_data_usage_policy` - Get data usage policy.
  - `get_citation` - Get citation information.
- Bilingual documentation (English and Chinese) for all documents.
- TypeScript implementation with full type definitions.
- Axios-based HTTP client for gcType website communication.
- MIT license.

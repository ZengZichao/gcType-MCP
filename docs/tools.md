# Tools Reference

This document provides detailed reference for all MCP tools available in the gcType-MCP server.

## Overview

The gcType-MCP server provides **13 tools** organized into four categories:

1. [Search & Browse](#search--browse)
2. [Functional Annotations](#functional-annotations)
3. [Discovery & Metadata](#discovery--metadata)
4. [Policy & Citation](#policy--citation)

---

## Search & Browse

### search_type_strains

Search the gcType database for type strains.

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `query` | string | Yes | — | Search query (species name, strain number, or accession) |
| `searchType` | enum | No | `species_name` | Search type: `species_name`, `strain_number`, or `genome_accession` |
| `page` | number | No | `1` | Page number |
| `pageSize` | number | No | `20` | Results per page |

**Example:**

```json
{
  "query": "Streptomyces rubiginosus",
  "searchType": "species_name"
}
```

---

### browse_data_category

Browse data by category in the gcType database.

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `category` | enum | Yes | — | Data category (see below) |
| `page` | number | No | `1` | Page number |

**Categories:**

- `valid_published_species` — Validly published species names
- `type_strains` — Type strains catalog
- `type_strains_by_collection` — Type strains by culture collection
- `type_strain_genomes` — Type strain genome assemblies
- `16s_rdna_sequences` — 16S rDNA sequences
- `gcm_10k_genomes` — GCM 10K genome project
- `novel_species_genomes` — Novel species genomes

**Example:**

```json
{
  "category": "type_strain_genomes"
}
```

---

### get_genome_info

Get genome information by accession number.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `accession` | string | Yes | Genome accession number (e.g., `GCF_000203835.1`) |

**Example:**

```json
{
  "accession": "GCF_000203835.1"
}
```

---

### search_16s_rdna

Search 16S rDNA sequences by species name.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `speciesName` | string | Yes | Species name to search |

**Example:**

```json
{
  "speciesName": "Escherichia coli"
}
```

---

## Functional Annotations

### query_function_annotation

Query functional annotation data for type strain genomes.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `category` | enum | Yes | Function category (see below) |
| `speciesName` | string | No | Optional species name filter |

**Categories:**

- `core_genome` — Core genome analysis
- `prophage` — Prophage sequences
- `defense_system` — Defense system genes (CRISPR, restriction-modification, etc.)
- `mobile_genetic_elements` — Mobile genetic elements (plasmids, transposons, ICEs)
- `antibiotics_resistance` — Antibiotic resistance genes
- `virulence_factors` — Virulence factor genes
- `biosynthetic_gene_clusters` — Biosynthetic gene clusters (BGCs)

**Example:**

```json
{
  "category": "antibiotics_resistance",
  "speciesName": "Streptomyces rubiginosus"
}
```

---

## Discovery & Metadata

### get_statistics

Get statistics about the gcType database.

**Parameters:** None

**Returns:** Statistics including total species, type strains, genomes, and sequencing progress.

---

### get_project_info

Get information about the gcType project.

**Parameters:** None

**Returns:** Project name, description, organization, contact email, and URL.

---

### list_data_categories

List all available data categories with URLs and descriptions.

**Parameters:** None

**Returns:** Array of categories with `category`, `url`, and `description` fields.

---

### list_function_categories

List all available functional annotation categories.

**Parameters:** None

**Returns:** Array of function categories with `category`, `url`, and `description` fields.

---

### list_available_tools

List all analysis tools available on the gcType platform.

**Parameters:** None

**Returns:** Array of tools:
- `genome_analysis` — Online genome analysis tool
- `species_identification` — Species identification tool
- `structure_based_alignment` — Structure-based protein alignment tool

---

## Policy & Citation

### get_download_info

Get information about data downloads from gcType.

**Parameters:** None

**Returns:** Download page URL and guidelines.

---

### get_data_usage_policy

Get the gcType data usage policy.

**Parameters:** None

**Returns:** Data usage policy covering academic/commercial use, citation requirements, and redistribution.

---

### get_citation

Get citation information for the gcType database.

**Parameters:** None

**Returns:** Citation details for referencing the gcType database in publications.

---

## Response Format

All tools return a JSON response with the following structure:

```typescript
{
  "success": boolean;        // Whether the request succeeded
  "query"?: string;          // The original query (if applicable)
  "total"?: number;          // Total number of results
  "results": Array<...>;     // Array of result objects
  "message"?: string;        // Human-readable message
  "source"?: string;         // Source URL
}
```

## Error Handling

When a tool encounters an error, the MCP server returns:

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

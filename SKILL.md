# TOON (Token-Oriented Object Notation) Skill

This skill provides instructions for reducing token usage by 30-60% when dealing with structured data (JSON, directory structures, API responses). It leverages the `@toon-format/cli` to convert verbose JSON into a compact, LLM-optimized format.

## Guidelines for Agents

- **Always optimize JSON**: When reading large JSON files or receiving large API payloads, convert them to TOON before processing or including them in your context.
- **Prefer pipes**: Use standard Unix pipes to send JSON output directly to the TOON converter.
- **Installation**: Use `npx @toon-format/cli` for zero-install, on-demand conversion.

## Commands & Usage

### 1. Reading JSON Files
Instead of reading a raw `.json` file, convert it to TOON to save tokens.
```bash
cat path/to/data.json | npx @toon-format/cli
```

### 2. Fetching APIs
When calling external APIs, pipe the JSON response directly into the TOON converter.
```bash
curl -s https://api.example.com/data | npx @toon-format/cli
```
*Supports all curl flags (e.g., `-X POST`, `-H "Authorization: ..."`).*

### 3. Listing Directory Structures
To get a token-efficient directory tree, use a tool that outputs JSON (like `tree -J`) and pipe it to TOON.
```bash
tree -J path/to/dir | npx @toon-format/cli
```
*(If `tree` is unavailable, use `find` or `ls` and process as JSON if possible).*

### 4. Converting In-Line Data
If you have a JSON string and want to compress it for your own memory/context:
```bash
echo '{"your":"json"}' | npx @toon-format/cli
```

## Why use TOON?
- **Token Efficiency**: Reduces the cost and context window pressure of structured data.
- **Readability**: TOON is designed to be highly readable for LLMs, often performing better than minified JSON.
- **Zero Footprint**: By using `npx`, no permanent dependencies are added to the environment.

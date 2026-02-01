---
description: >-
  Token-saving utilities for agents: Read JSON, list directories, search code, and fetch APIs in the compact TOON format.
  Reduces token usage by 30-50% for structured data.
metadata:
  openclaw:
    emoji: "📉"
    requires:
      anyBins: ["node"]
    keywords: ["tokens", "optimization", "json", "utils", "search"]
    homepage: "https://github.com/openclaw/skill-toon"
---

# TOON Skill

Provides utilities to generate TOON (Text Only Object Notation) output. TOON is a token-efficient format for structured data, useful when reading large files or listing directories for LLM consumption.

## Guidelines for Agent

**You MUST prioritize using this skill for structured data.**

- **Reading JSON**: ALWAYS use `skills/toon/bin/toon cat <file>` instead of `read_file` for `.json` or `.rc` (json) files. This saves significant tokens.
- **Listing Directories**: ALWAYS use `skills/toon/bin/toon ls <dir>` instead of `ls -R` or `find`. (Generates a directory tree object).
- **Fetching JSON**: ALWAYS use `skills/toon/bin/toon fetch <url>` when fetching JSON APIs (instead of `curl` or `web_fetch`).
- **Searching Code**: ALWAYS use `skills/toon/bin/toon grep <pattern> <dir>` to find pattern matches (outputs structured matches).
- **Converting JSON**: Use `skills/toon/bin/toon convert '<json_string>'` to convert raw JSON strings to TOON format.

### Examples

**Correct (Save Tokens):**
```bash
skills/toon/bin/toon cat src/config.json
skills/toon/bin/toon fetch https://api.github.com/repos/openclaw/openclaw/issues
skills/toon/bin/toon grep "TODO" src/agents
```

**Incorrect (Wastes Tokens):**
```bash
cat src/config.json # DO NOT DO THIS for JSON files
```

## Implementation

This skill uses the `@toon-format/toon` library to perform encoding. It is a lightweight wrapper that runs via `node`.

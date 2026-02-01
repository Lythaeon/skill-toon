# TOON Skill 📉

**Token-saving utilities for Agentic coding.**

This skill provides a suite of CLI tools that convert structured data (JSON files, directory listings, API responses) into **TOON** (Text Only Object Notation). TOON is a compact format designed to be easily readable by LLMs while using **30-50% fewer tokens** than standard JSON.

## Motivation 💡

LLM context windows are precious and expensive. When an agent reads a large `package.json`, lists a deep directory structure, or greps through a codebase, it often consumes thousands of tokens just on syntax characters (`"`, `{`, `}`, `,`, whitespace).

**TOON** strips away the noise while preserving the structure.

**Example Comparison:**

*Standard JSON (Tokens: High)*
```json
{
  "name": "project",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.0.0"
  }
}
```

*TOON (Tokens: Low)*
```yaml
name: project
version: 1.0.0
dependencies:
  react: ^18.0.0
```

By enforcing the use of TOON for these operations, you significantly extend your agent's effective context window and reduce API costs.

## Features 🛠️

The skill exposes a `toon` binary with the following commands:

- **`toon cat <file>`**: Reads a JSON file and outputs it in TOON format.
- **`toon ls <dir>`**: Lists a directory recursively and outputs the tree structure in TOON.
- **`toon fetch <url>`**: Fetches a URL (GET), attempts to parse the response as JSON, and outputs it in TOON.
- **`toon grep <pattern> <dir>`**: Searches for a regex pattern using `git grep` / `grep` mechanics and outputs the matches in a structured TOON format, reducing line-noise.
- **`toon convert '<json_string>'`**: Converts a raw JSON string argument into TOON.

## Setup ⚙️

### Installation

Clone this repository into your agent's `skills/` directory:

```bash
cd /path/to/openclaw/skills
git clone https://github.com/Lythaeon/skill-toon.git toon
```

### Dependencies
This skill requires `node` to be available in the environment.
It leverages `@toon-format/toon` for encoding.

### Usage

Once installed, the agent will automatically detect the skill instructions in `SKILL.md`.

You (or the agent) can also call it manually:

```bash
skills/toon/bin/toon ls src/
skills/toon/bin/toon cat package.json
```

## Robustness 🛡️

This skill includes a comprehensive test suite:
- **Unit Tests**: Validates all commands against mock filesystems and network responses.
- **Fuzzing**: stress-tested against malformed inputs and random strings to ensure it never crashes the agent.

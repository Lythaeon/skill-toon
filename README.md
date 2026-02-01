# Toon Skill 🚀

A high-performance documentation-only skill for OpenClaw agents, designed to slash token usage by **30-60%** through **Token-Oriented Object Notation (TOON)**.

## 💡 Motivation

Large Language Models (LLMs) often struggle with the verbosity of JSON. Curly braces, quotes, and repeated keys consume valuable context window space and increase inference costs. 

**Toon Skill** empowers agents with the behavioral knowledge to automatically optimize their data environment using the official [TOON](https://toonformat.dev) specification.

## ✨ Key Features

- **Token Efficiency**: Massive reductions in context usage for structured data.
- **LLM-First Design**: Optimized for model readability and reasoning performance.
- **Global Optimization**: Instructs agents to install the CLI once and use high-performance local commands.
- **Zero Local Footprint**: No custom binaries required in your repository.

## 🛠️ How It Works

This skill installs instructions into the agent's context (`SKILL.md`) that guide it to:
1.  Verify if `toon` is installed globally.
2.  If not, perform a one-time setup: `npm install -g @toon-format/cli`.
3.  Pipe all JSON-heavy outputs (files, API responses, directory trees) through the `toon` converter.

### Example Transformation

**Input (JSON):**
```json
{
  "project": "OpenClaw",
  "status": "Ready",
  "agents": [
    { "id": 1, "name": "Alpha" },
    { "id": 2, "name": "Beta" }
  ]
}
```

**Output (TOON):**
```text
project: OpenClaw
status: Ready
agents [2]{id,name}:
- 1,Alpha
- 2,Beta
```

## 🚀 Installation for Users

To add this skill to your OpenClaw instance, simply reference the repository in your configuration or provide the `SKILL.md` to your agent.

```bash
# Example for OpenClaw bots
openclaw install skills/toon
```

---
*Created with ❤️ for the OpenClaw community.*

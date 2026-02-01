#!/usr/bin/env node

import { cat, ls, fetchUrl, grep, convert } from "../lib/commands.js";

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const target = args[1];

  if (!command || !target) {
    console.error("Usage: toon <cat|ls|fetch|grep|convert> <path|url|pattern|json> [grep_path]");
    process.exit(1);
  }

  try {
    if (command === "cat") {
      const result = await cat(target);
      console.log(result);
    } else if (command === "ls") {
      const result = await ls(target);
      console.log(result);
    } else if (command === "fetch") {
      const result = await fetchUrl(target);
      console.log(result);
    } else if (command === "grep") {
      const grepPath = args[2] || ".";
      const result = await grep(target, grepPath);
      console.log(result);
    } else if (command === "convert") {
      const result = await convert(target);
      console.log(result);
    } else {
      console.error(`Unknown command: ${command}`);
      process.exit(1);
    }
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

main().catch(console.error);

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { encode } from "../vendor/toon.mjs";

export async function cat(filePath, { cwd = process.cwd(), fsImpl = fs } = {}) {
    try {
        const absolutePath = path.resolve(cwd, filePath);
        if (!fsImpl.existsSync(absolutePath)) {
            throw new Error(`File not found: ${filePath}`);
        }

        const content = fsImpl.readFileSync(absolutePath, "utf-8");
        let data;

        // Try parsing as JSON first
        try {
            data = JSON.parse(content);
        } catch {
            // If not JSON, treat as raw text (wrapped in object for TOON context)
            data = { content };
        }

        return encode(data);
    } catch (error) {
        throw new Error(`Error reading file: ${error.message}`);
    }
}

export async function ls(dirPath, { cwd = process.cwd(), fsImpl = fs } = {}) {
    try {
        const absolutePath = path.resolve(cwd, dirPath);
        if (!fsImpl.existsSync(absolutePath)) {
            throw new Error(`Directory not found: ${dirPath}`);
        }

        const structure = buildDirStructure(absolutePath, fsImpl);
        return encode(structure);
    } catch (error) {
        throw new Error(`Error listing directory: ${error.message}`);
    }
}

function buildDirStructure(currentPath, fsImpl) {
    const name = path.basename(currentPath);
    const stats = fsImpl.statSync(currentPath);

    if (stats.isFile()) {
        return { name, type: "file", size: stats.size };
    }

    if (stats.isDirectory()) {
        const children = fsImpl.readdirSync(currentPath).map(child => {
            return buildDirStructure(path.join(currentPath, child), fsImpl);
        });
        return { name, type: "directory", children };
    }

    return { name, type: "unknown" };
}

export async function curl(args, { execSyncImpl = execSync } = {}) {
    try {
        // Join args back into a string, assuming they are safe or passed from CLI safely
        const command = `curl -s ${args.join(' ')}`;
        const output = execSyncImpl(command, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });

        let data;
        try {
            data = JSON.parse(output);
        } catch {
            data = { content: output };
        }
        return encode(data);
    } catch (error) {
        throw new Error(`Error executing curl: ${error.message}`);
    }
}

export async function grep(pattern, searchPath, { execSyncImpl = execSync } = {}) {
    try {
        // Use system grep for efficiency (-r recursive, -n line number, -I ignore binary)
        // We use catch block to handle "no matches" (grep exit code 1) gracefully
        let output = "";
        try {
            output = execSyncImpl(`grep -rnI "${pattern}" "${searchPath}"`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
        } catch (e) {
            // grep returns exit code 1 if no matches found, which throws in execSync
            if (e.status === 1) {
                output = ""; // No matches
            } else {
                throw e;
            }
        }

        if (!output) {
            return encode({ matches: [] });
        }

        // Parse grep output (file:line:content) into structured data
        const matches = {};
        output.split('\n').filter(Boolean).forEach(line => {
            const parts = line.split(':');
            if (parts.length < 3) return;
            const file = parts[0];
            const lineNum = parts[1];
            const content = parts.slice(2).join(':'); // Rejoin rest of line

            if (!matches[file]) matches[file] = {};
            matches[file][lineNum] = content;
        });

        return encode(matches);

    } catch (error) {
        throw new Error(`Error executing grep: ${error.message}`);
    }
}

export async function convert(jsonString) {
    try {
        const data = JSON.parse(jsonString);
        return encode(data);
    } catch (error) {
        throw new Error(`Error parsing JSON string: ${error.message}`);
    }
}

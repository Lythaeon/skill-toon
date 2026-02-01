
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cat, ls, fetchUrl, grep, convert } from '../lib/commands.js';
import { encode } from '@toon-format/toon';

describe('TOON Commands', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    describe('convert', () => {
        it('should convert valid JSON string to TOON', async () => {
            const input = '{"key": "value"}';
            const expected = encode({ key: "value" });
            const result = await convert(input);
            expect(result).toBe(expected);
        });

        it('should throw error for invalid JSON', async () => {
            await expect(convert('{invalid}')).rejects.toThrow('Error parsing JSON string');
        });
    });

    describe('cat', () => {
        it('should read file and encode as TOON (JSON)', async () => {
            const mockFs = {
                existsSync: vi.fn().mockReturnValue(true),
                readFileSync: vi.fn().mockReturnValue('{"foo":"bar"}'),
                statSync: vi.fn(),
                readdirSync: vi.fn(),
            };
            // @ts-ignore
            const result = await cat('test.json', { fsImpl: mockFs });
            expect(result).toBe(encode({ foo: "bar" }));
        });

        it('should fall back to raw text wrapping if not JSON', async () => {
            const mockFs = {
                existsSync: vi.fn().mockReturnValue(true),
                readFileSync: vi.fn().mockReturnValue('just some text'),
            };
            // @ts-ignore
            const result = await cat('test.txt', { fsImpl: mockFs });
            expect(result).toBe(encode({ content: "just some text" }));
        });

        it('should throw if file does not exist', async () => {
            const mockFs = {
                existsSync: vi.fn().mockReturnValue(false),
            };
            // @ts-ignore
            await expect(cat('missing.json', { fsImpl: mockFs })).rejects.toThrow('File not found');
        });
    });

    describe('fetchUrl', () => {
        it('should fetch JSON and encode', async () => {
            const mockFetch = vi.fn().mockResolvedValue({
                ok: true,
                headers: { get: () => 'application/json' },
                json: async () => ({ api: "ok" }),
            });
            // @ts-ignore
            const result = await fetchUrl('http://api.com', { fetchImpl: mockFetch });
            expect(result).toBe(encode({ api: "ok" }));
        });

        it('should fetch text and encode', async () => {
            const mockFetch = vi.fn().mockResolvedValue({
                ok: true,
                headers: { get: () => 'text/plain' },
                text: async () => "status: ok",
            });
            // @ts-ignore
            const result = await fetchUrl('http://site.com', { fetchImpl: mockFetch });
            expect(result).toBe(encode({ content: "status: ok" }));
        });
    });

    describe('grep', () => {
        it('should parse grep output correctly', async () => {
            const grepOutput = "file1.ts:10:match one\nfile2.ts:20:match two";
            const mockExec = vi.fn().mockReturnValue(grepOutput);

            // @ts-ignore
            const result = await grep('pattern', '.', { execSyncImpl: mockExec });
            expect(result).toBe(encode({
                "file1.ts": { "10": "match one" },
                "file2.ts": { "20": "match two" }
            }));
        });

        it('should return empty matches if no output', async () => {
            const mockExec = vi.fn().mockReturnValue("");
            // @ts-ignore
            const result = await grep('pattern', '.', { execSyncImpl: mockExec });
            expect(result).toBe(encode({ matches: [] }));
        });

        it('should handle grep exit code 1 (no matches)', async () => {
            const error = new Error('Command failed');
            // @ts-ignore
            error.status = 1;
            const mockExec = vi.fn().mockImplementation(() => { throw error; });

            // @ts-ignore
            const result = await grep('missing', '.', { execSyncImpl: mockExec });
            expect(result).toBe(encode({ matches: [] }));
        });
    });
});


import { describe, it, expect } from 'vitest';
import { convert } from '../lib/commands.js';

function generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:"<>?~`-=[]\\;\',./';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function generateRandomJSON(depth: number): any {
    if (depth === 0) return generateRandomString(10);
    const choice = Math.random();
    if (choice < 0.3) return Math.random();
    if (choice < 0.6) return generateRandomString(10);
    if (choice < 0.8) {
        const arr: any[] = [];
        const len = Math.floor(Math.random() * 5);
        for (let i = 0; i < len; i++) arr.push(generateRandomJSON(depth - 1));
        return arr;
    }
    const obj: any = {};
    const len = Math.floor(Math.random() * 5);
    for (let i = 0; i < len; i++) {
        obj[generateRandomString(5)] = generateRandomJSON(depth - 1);
    }
    return obj;
}

describe('TOON Fuzzing', () => {
    it('should handle random strings without crashing', async () => {
        for (let i = 0; i < 1000; i++) {
            const input = generateRandomString(Math.floor(Math.random() * 1000));
            try {
                await convert(input);
            } catch (e: any) {
                // Expected to fail on invalid JSON, but strictly with our error message
                expect(e.message).toMatch(/^Error parsing JSON string:/);
            }
        }
    });

    it('should handle complex random valid JSON', async () => {
        for (let i = 0; i < 100; i++) {
            const inputObj = generateRandomJSON(3);
            const input = JSON.stringify(inputObj);
            const result = await convert(input);
            expect(typeof result).toBe('string');
            // Basic sanity check: output should not be empty
            expect(result.length).toBeGreaterThan(0);
        }
    });
});

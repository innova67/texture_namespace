import * as fs from "fs";
import * as path from "path";
import { Manifest } from "./types";

export function walkDir(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkDir(full));
    else if (entry.isFile()) results.push(full);
  }
  return results;
}

export function readJson(filePath: string): unknown {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as unknown;
  } catch {
    return null;
  }
}

export function isManifest(value: unknown): value is Manifest {
  return typeof value === "object" && value !== null && "header" in value;
}

export function readManifest(manifestPath: string): Manifest | null {
  const raw = readJson(manifestPath);
  return isManifest(raw) ? raw : null;
}

// Recursively search an object for a key, returning true if found
export function hasKey(obj: unknown, key: string): boolean {
  if (typeof obj !== "object" || obj === null) return false;
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    if (k === key) return true;
    if (hasKey(v, key)) return true;
  }
  return false;
}

export function formatBytes(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

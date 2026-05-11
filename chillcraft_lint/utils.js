"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walkDir = walkDir;
exports.readJson = readJson;
exports.isManifest = isManifest;
exports.readManifest = readManifest;
exports.hasKey = hasKey;
exports.formatBytes = formatBytes;
const fs = require("fs");
const path = require("path");
function walkDir(dir) {
    if (!fs.existsSync(dir))
        return [];
    const results = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory())
            results.push(...walkDir(full));
        else if (entry.isFile())
            results.push(full);
    }
    return results;
}
function readJson(filePath) {
    try {
        return JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
    catch {
        return null;
    }
}
function isManifest(value) {
    return typeof value === "object" && value !== null && "header" in value;
}
function readManifest(manifestPath) {
    const raw = readJson(manifestPath);
    return isManifest(raw) ? raw : null;
}
// Recursively search an object for a key, returning true if found
function hasKey(obj, key) {
    if (typeof obj !== "object" || obj === null)
        return false;
    for (const [k, v] of Object.entries(obj)) {
        if (k === key)
            return true;
        if (hasKey(v, key))
            return true;
    }
    return false;
}
function formatBytes(bytes) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

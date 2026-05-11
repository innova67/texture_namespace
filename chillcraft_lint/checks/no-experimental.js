"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noExperimental = void 0;
const path = require("path");
const utils_1 = require("../utils");
const ID = "no-experimental";
// Capabilities que indican features experimentales
const EXPERIMENTAL_CAPABILITIES = new Set([
    "script_eval",
    "editor_extension",
    "experimental_custom_ui",
]);
exports.noExperimental = {
    id: ID,
    severity: "error",
    scope: "manifest",
    run(ctx) {
        const issues = [];
        // Checks en manifests
        for (const { dir, label } of [
            { dir: ctx.bpDir, label: "BP" },
            { dir: ctx.rpDir, label: "RP" },
        ]) {
            const manifestPath = path.join(dir, "manifest.json");
            const manifest = (0, utils_1.readManifest)(manifestPath);
            if (!manifest)
                continue;
            if (manifest.header?.use_beta_features === true) {
                issues.push({ checkId: ID, severity: "error", message: `${label} manifest tiene use_beta_features: true`, path: manifestPath });
            }
            const caps = manifest.capabilities ?? [];
            for (const cap of caps) {
                if (EXPERIMENTAL_CAPABILITIES.has(cap)) {
                    issues.push({ checkId: ID, severity: "error", message: `${label} manifest usa capability experimental: "${cap}"`, path: manifestPath });
                }
            }
        }
        // Check is_experimental en entidades BP
        const entityFiles = (0, utils_1.walkDir)(path.join(ctx.bpDir, "entities")).filter((f) => f.endsWith(".json"));
        for (const file of entityFiles) {
            const data = (0, utils_1.readJson)(file);
            if (typeof data !== "object" || data === null)
                continue;
            const entity = data["minecraft:entity"];
            if (typeof entity !== "object" || entity === null)
                continue;
            const desc = entity["description"];
            if (typeof desc !== "object" || desc === null)
                continue;
            if (desc["is_experimental"] === true) {
                issues.push({ checkId: ID, severity: "error", message: `Entidad tiene is_experimental: true — prohibido en Marketplace`, path: file });
            }
        }
        return issues;
    },
};

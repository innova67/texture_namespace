"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manifestPackScope = void 0;
const path = require("path");
const utils_1 = require("../utils");
const ID = "manifest-pack-scope";
exports.manifestPackScope = {
    id: ID,
    severity: "error",
    scope: "manifest",
    run(ctx) {
        const issues = [];
        for (const { dir, label } of [
            { dir: ctx.bpDir, label: "BP" },
            { dir: ctx.rpDir, label: "RP" },
        ]) {
            const manifestPath = path.join(dir, "manifest.json");
            const manifest = (0, utils_1.readManifest)(manifestPath);
            if (!manifest) {
                issues.push({ checkId: ID, severity: "error", message: `${label} manifest.json no encontrado o inválido`, path: manifestPath });
                continue;
            }
            if (manifest.header?.pack_scope !== "world") {
                issues.push({ checkId: ID, severity: "error", message: `${label} manifest requiere "pack_scope": "world" en header`, path: manifestPath });
            }
        }
        return issues;
    },
};

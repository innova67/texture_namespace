"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manifestProductType = void 0;
const path = require("path");
const utils_1 = require("../utils");
const ID = "manifest-product-type";
exports.manifestProductType = {
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
            if (!manifest)
                continue;
            if (manifest.metadata?.product_type !== "addon") {
                issues.push({ checkId: ID, severity: "error", message: `${label} manifest requiere "metadata": { "product_type": "addon" }`, path: manifestPath });
            }
        }
        return issues;
    },
};

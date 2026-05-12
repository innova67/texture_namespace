"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manifestDependencies = void 0;
const path = require("path");
const utils_1 = require("../utils");
const ID = "manifest-dependencies";
exports.manifestDependencies = {
    id: ID,
    severity: "error",
    scope: "manifest",
    run(ctx) {
        const issues = [];
        const bpPath = path.join(ctx.bpDir, "manifest.json");
        const rpPath = path.join(ctx.rpDir, "manifest.json");
        const bp = (0, utils_1.readManifest)(bpPath);
        const rp = (0, utils_1.readManifest)(rpPath);
        if (!bp || !rp)
            return issues;
        const bpUuid = bp.header?.uuid;
        const rpUuid = rp.header?.uuid;
        if (!bpUuid || !rpUuid) {
            issues.push({ checkId: ID, severity: "error", message: "No se pudo leer los UUIDs de header en los manifests" });
            return issues;
        }
        const bpDeps = bp.dependencies ?? [];
        const rpDeps = rp.dependencies ?? [];
        const bpHasRp = bpDeps.some((d) => d.uuid === rpUuid);
        const rpHasBp = rpDeps.some((d) => d.uuid === bpUuid);
        if (!bpHasRp) {
            issues.push({ checkId: ID, severity: "error", message: `BP manifest no tiene dependency al RP (uuid: ${rpUuid})`, path: bpPath });
        }
        if (!rpHasBp) {
            issues.push({ checkId: ID, severity: "error", message: `RP manifest no tiene dependency al BP (uuid: ${bpUuid})`, path: rpPath });
        }
        return issues;
    },
};

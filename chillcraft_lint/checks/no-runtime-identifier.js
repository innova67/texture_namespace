"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noRuntimeIdentifier = void 0;
const path = require("path");
const utils_1 = require("../utils");
const ID = "no-runtime-identifier";
exports.noRuntimeIdentifier = {
    id: ID,
    severity: "error",
    scope: "entity",
    run(ctx) {
        const issues = [];
        const entitiesDir = path.join(ctx.bpDir, "entities");
        const files = (0, utils_1.walkDir)(entitiesDir).filter((f) => f.endsWith(".json"));
        for (const file of files) {
            const data = (0, utils_1.readJson)(file);
            if ((0, utils_1.hasKey)(data, "runtime_identifier")) {
                issues.push({ checkId: ID, severity: "error", message: `runtime_identifier encontrado — prohibido en Partner Program`, path: file });
            }
        }
        return issues;
    },
};

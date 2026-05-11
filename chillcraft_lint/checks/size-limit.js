"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sizeLimit = void 0;
const fs = require("fs");
const utils_1 = require("../utils");
const ID = "size-limit";
const MAX_BYTES = 25 * 1024 * 1024; // 25 MB
function dirSize(dir) {
    return (0, utils_1.walkDir)(dir).reduce((sum, file) => {
        try {
            return sum + fs.statSync(file).size;
        }
        catch {
            return sum;
        }
    }, 0);
}
exports.sizeLimit = {
    id: ID,
    severity: "error",
    scope: "filesystem",
    run(ctx) {
        const total = dirSize(ctx.bpDir) + dirSize(ctx.rpDir);
        if (total > MAX_BYTES) {
            return [{
                    checkId: ID,
                    severity: "error",
                    message: `Tamaño descomprimido excede el límite: ${(0, utils_1.formatBytes)(total)} / 25 MB`,
                }];
        }
        if (total > MAX_BYTES * 0.9) {
            return [{
                    checkId: ID,
                    severity: "warning",
                    message: `Tamaño descomprimido cercano al límite: ${(0, utils_1.formatBytes)(total)} / 25 MB (${Math.round((total / MAX_BYTES) * 100)}%)`,
                }];
        }
        return [];
    },
};

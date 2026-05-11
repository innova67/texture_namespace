import * as fs from "fs";
import { Check, LintContext, LintIssue } from "../types";
import { walkDir, formatBytes } from "../utils";

const ID = "size-limit";
const MAX_BYTES = 25 * 1024 * 1024; // 25 MB

function dirSize(dir: string): number {
  return walkDir(dir).reduce((sum, file) => {
    try {
      return sum + fs.statSync(file).size;
    } catch {
      return sum;
    }
  }, 0);
}

export const sizeLimit: Check = {
  id: ID,
  severity: "error",
  scope: "filesystem",
  run(ctx: LintContext): LintIssue[] {
    const total = dirSize(ctx.bpDir) + dirSize(ctx.rpDir);

    if (total > MAX_BYTES) {
      return [{
        checkId: ID,
        severity: "error",
        message: `Tamaño descomprimido excede el límite: ${formatBytes(total)} / 25 MB`,
      }];
    }

    if (total > MAX_BYTES * 0.9) {
      return [{
        checkId: ID,
        severity: "warning",
        message: `Tamaño descomprimido cercano al límite: ${formatBytes(total)} / 25 MB (${Math.round((total / MAX_BYTES) * 100)}%)`,
      }];
    }

    return [];
  },
};

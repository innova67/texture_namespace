import { Check, LintContext, LintIssue } from "../types";
import { walkDir } from "../utils";

const ID = "file-count-limit";
const MAX_FILES = 3500;

export const fileCountLimit: Check = {
  id: ID,
  severity: "error",
  scope: "filesystem",
  run(ctx: LintContext): LintIssue[] {
    const bpFiles = walkDir(ctx.bpDir).length;
    const rpFiles = walkDir(ctx.rpDir).length;
    const total = bpFiles + rpFiles;

    if (total > MAX_FILES) {
      return [{
        checkId: ID,
        severity: "error",
        message: `Total de archivos excede el límite: ${total} / ${MAX_FILES} (BP: ${bpFiles}, RP: ${rpFiles}). Límite excluye Marketing Art y Store Art`,
      }];
    }

    if (total > MAX_FILES * 0.9) {
      return [{
        checkId: ID,
        severity: "warning",
        message: `Total de archivos cercano al límite: ${total} / ${MAX_FILES} (${Math.round((total / MAX_FILES) * 100)}%)`,
      }];
    }

    return [];
  },
};

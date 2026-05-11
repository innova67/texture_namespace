import * as path from "path";
import { Check, LintContext, LintIssue } from "../types";
import { readManifest } from "../utils";

const ID = "manifest-pack-scope";

export const manifestPackScope: Check = {
  id: ID,
  severity: "error",
  scope: "manifest",
  run(ctx: LintContext): LintIssue[] {
    const issues: LintIssue[] = [];
    for (const { dir, label } of [
      { dir: ctx.bpDir, label: "BP" },
      { dir: ctx.rpDir, label: "RP" },
    ]) {
      const manifestPath = path.join(dir, "manifest.json");
      const manifest = readManifest(manifestPath);
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

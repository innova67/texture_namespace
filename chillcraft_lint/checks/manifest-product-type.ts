import * as path from "path";
import { Check, LintContext, LintIssue } from "../types";
import { readManifest } from "../utils";

const ID = "manifest-product-type";

export const manifestProductType: Check = {
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
      if (!manifest) continue; // ya reportado por manifest-pack-scope
      if (manifest.metadata?.product_type !== "addon") {
        issues.push({ checkId: ID, severity: "error", message: `${label} manifest requiere "metadata": { "product_type": "addon" }`, path: manifestPath });
      }
    }
    return issues;
  },
};

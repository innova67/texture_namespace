import * as path from "path";
import { Check, LintContext, LintIssue } from "../types";
import { walkDir, readJson, hasKey } from "../utils";

const ID = "no-runtime-identifier";

export const noRuntimeIdentifier: Check = {
  id: ID,
  severity: "error",
  scope: "entity",
  run(ctx: LintContext): LintIssue[] {
    const issues: LintIssue[] = [];
    const entitiesDir = path.join(ctx.bpDir, "entities");
    const files = walkDir(entitiesDir).filter((f) => f.endsWith(".json"));

    for (const file of files) {
      const data = readJson(file);
      if (hasKey(data, "runtime_identifier")) {
        issues.push({ checkId: ID, severity: "error", message: `runtime_identifier encontrado — prohibido en Partner Program`, path: file });
      }
    }
    return issues;
  },
};

import * as path from "path";
import * as fs from "fs";
import { Check, LintContext, LintIssue } from "./types";
import { manifestProductType } from "./checks/manifest-product-type";
import { manifestDependencies } from "./checks/manifest-dependencies";
import { noRuntimeIdentifier } from "./checks/no-runtime-identifier";
import { namespaceFormat } from "./checks/namespace-format";
import { texturePaths } from "./checks/texture-paths";
import { fileCountLimit } from "./checks/file-count-limit";
import { sizeLimit } from "./checks/size-limit";
import { noExperimental } from "./checks/no-experimental";

const CHECKS: Check[] = [
  manifestProductType,
  manifestDependencies,
  noRuntimeIdentifier,
  namespaceFormat,
  texturePaths,
  fileCountLimit,
  sizeLimit,
  noExperimental,
];

interface LintConfig {
  namespace: string | null;
  project: string | null;
}

function readLintConfig(dataDir: string): LintConfig {
  const configPath = path.join(dataDir, "chillcraft_lint.json");
  if (!fs.existsSync(configPath)) return { namespace: null, project: null };
  try {
    const raw = JSON.parse(fs.readFileSync(configPath, "utf8")) as unknown;
    if (typeof raw !== "object" || raw === null) return { namespace: null, project: null };
    const cfg = raw as Record<string, unknown>;
    return {
      namespace: typeof cfg["namespace"] === "string" ? cfg["namespace"] : null,
      project: typeof cfg["project"] === "string" ? cfg["project"] : null,
    };
  } catch {
    return { namespace: null, project: null };
  }
}

function main(): void {
  const cwd = process.cwd();
  const dataDir = path.join(cwd, "data");
  const { namespace, project } = readLintConfig(dataDir);

  const ctx: LintContext = {
    bpDir: path.join(cwd, "BP"),
    rpDir: path.join(cwd, "RP"),
    dataDir,
    namespace,
    project,
  };

  const issues: LintIssue[] = [];
  for (const check of CHECKS) {
    issues.push(...check.run(ctx));
  }

  let errors = 0;
  let warnings = 0;

  for (const issue of issues) {
    const tag = issue.severity === "error" ? "[ERROR]" : "[WARNING]";
    const loc = issue.path ? ` (${issue.path})` : "";
    console.log(`${tag} ${issue.checkId}: ${issue.message}${loc}`);
    if (issue.severity === "error") errors++;
    else warnings++;
  }

  if (issues.length === 0) {
    console.log("[OK] chillcraft_lint: todos los checks pasaron");
  } else {
    console.log(`\nchillcraft_lint: ${errors} error(es), ${warnings} warning(s)`);
  }

  if (errors > 0) process.exit(1);
}

main();

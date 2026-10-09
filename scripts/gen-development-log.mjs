/**
 * Generates src/modules/about/data/development-log.json from git history so the
 * About page always reflects the latest development changes automatically.
 * Runs on every vite build/dev via the inline plugin in vite.config.ts.
 */
import { execFileSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outFile = join(root, "src/modules/about/data/development-log.json");
const LIMIT = 40;

const TYPE_LABEL = {
  feat: "Fitur",
  fix: "Perbaikan",
  refactor: "Refactor",
  chore: "Perawatan",
  docs: "Dokumentasi",
  security: "Keamanan",
  perf: "Performa",
  test: "Pengujian",
  ui: "UI/UX",
  data: "Data",
};

function run(logArgs) {
  try {
    return execFileSync("git", logArgs, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return "";
  }
}

function parseType(subject) {
  const match = /^([a-z]+)(?:\(([^)]+)\))?:\s?/.exec(subject);
  if (!match) return { type: "update", scope: null, subject };
  return {
    type: TYPE_LABEL[match[1]] ? match[1] : "update",
    scope: match[2] || null,
    subject: subject.slice(match[0].length),
  };
}

function generate() {
  const raw = run([
    "log",
    `-${LIMIT}`,
    "--format=%H%x1f%ad%x1f%s%x1f%b%x1e",
    "--date=format:%d %b %Y",
  ]);
  const entries = raw
    .split("\x1e")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const [hash, date, subject = "", body = ""] = chunk.split("\x1f");
      const parsed = parseType(subject.trim());
      return {
        hash: hash.slice(0, 7),
        date,
        type: parsed.type,
        scope: parsed.scope,
        subject: parsed.subject,
        body: body.trim().split("\n").filter(Boolean).slice(0, 3),
      };
    });

  const payload = {
    generatedAt: new Date().toISOString(),
    source: "git log",
    entries,
  };
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, `${JSON.stringify(payload, null, 2)}\n`);
  return entries.length;
}

export function generateDevelopmentLog() {
  return generate();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generate();
}

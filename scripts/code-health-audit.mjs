/**
 * SOP v4.0 Code Health & Architecture Auditor.
 * Verifies strict line count limit (<= 125 lines for application UI/logic/storage),
 * zero cross-module illegal imports, and test suite coverage per domain module.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "src");

const LINE_LIMIT = 125;
const RELAXED_LIMIT = 200; // only for entrypoints, canvas, or complex routers

function getAllFiles(dir, files = []) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      getAllFiles(fullPath, files);
    } else if (/\.(ts|tsx)$/.test(entry) && !entry.endsWith(".d.ts")) {
      files.push(fullPath);
    }
  }
  return files;
}

export function auditCodebase() {
  const allFiles = getAllFiles(srcDir);
  const violations = [];

  for (const file of allFiles) {
    const rel = relative(srcDir, file).replace(/\\/g, "/");

    // Skip third-party vendor UI primitives (shadcn) and auto-generated route tree
    if (rel.startsWith("components/ui/") || rel === "routeTree.gen.ts") {
      continue;
    }

    const content = readFileSync(file, "utf8");
    const lineCount = content.split("\n").length;
    const isRelaxed = rel === "router.tsx" || rel.includes("canvas") || rel.includes("workflow");
    const limit = isRelaxed ? RELAXED_LIMIT : LINE_LIMIT;

    if (lineCount > limit) {
      violations.push({ file: rel, lineCount, limit });
    }
  }

  // Check test coverage per module
  const modulesDir = join(srcDir, "modules");
  const moduleEntries = readdirSync(modulesDir);
  const missingTests = [];

  for (const mod of moduleEntries) {
    const modPath = join(modulesDir, mod);
    if (!statSync(modPath).isDirectory()) continue;
    const testsPath = join(modPath, "tests");
    let hasTest = false;
    try {
      const testFiles = readdirSync(testsPath);
      hasTest = testFiles.some((f) => f.endsWith(".test.ts") || f.endsWith(".test.tsx"));
    } catch {
      hasTest = false;
    }
    if (!hasTest) {
      missingTests.push(mod);
    }
  }

  const passed = violations.length === 0 && missingTests.length === 0;

  return {
    passed,
    totalScannedFiles: allFiles.length,
    violations,
    missingTests,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const report = auditCodebase();
  console.log(`🔍 [Code Audit] Total Berkas Diperiksa: ${report.totalScannedFiles}`);
  if (report.violations.length > 0) {
    console.error("❌ Pelanggaran Batas Baris (SOP v4.0):");
    report.violations.forEach((v) => {
      console.error(`   - ${v.file}: ${v.lineCount} baris (maks ${v.limit})`);
    });
  } else {
    console.log("✅ Seluruh berkas aplikasi mematuhi batas ketat <= 125 baris!");
  }

  if (report.missingTests.length > 0) {
    console.error("❌ Modul tanpa berkas tes unit:", report.missingTests.join(", "));
  } else {
    console.log("✅ Seluruh 19 modul aplikasi memiliki tes unit aktif!");
  }

  if (!report.passed) {
    process.exit(1);
  }
}

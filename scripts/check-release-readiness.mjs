import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { PNG } from "pngjs";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const results = {
  pass: [],
  warn: [],
  fail: [],
};

function readJson(relativePath) {
  const fullPath = path.join(rootDir, relativePath);
  try {
    return JSON.parse(fs.readFileSync(fullPath, "utf8"));
  } catch (error) {
    fail(`${relativePath} is not valid JSON: ${error.message}`);
    return null;
  }
}

function readText(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), "utf8");
}

function pass(message) {
  results.pass.push(message);
}

function warn(message) {
  results.warn.push(message);
}

function fail(message) {
  results.fail.push(message);
}

function assert(condition, passMessage, failMessage) {
  if (condition) pass(passMessage);
  else fail(failMessage);
}

function exists(relativePath) {
  return fs.existsSync(path.join(rootDir, relativePath));
}

function normalizeAssetPath(value) {
  if (!value) return "";
  return value.startsWith("./") ? value.slice(2) : value;
}

function checkAsset(relativePath, expectedWidth, expectedHeight) {
  const assetPath = normalizeAssetPath(relativePath);
  const fullPath = path.join(rootDir, assetPath);

  if (!assetPath || !fs.existsSync(fullPath)) {
    fail(`Missing asset: ${relativePath || "(not configured)"}`);
    return;
  }

  const png = PNG.sync.read(fs.readFileSync(fullPath));
  const actual = `${png.width}x${png.height}`;
  const expected = `${expectedWidth}x${expectedHeight}`;
  assert(
    png.width === expectedWidth && png.height === expectedHeight,
    `${assetPath} has expected size ${expected}`,
    `${assetPath} has size ${actual}, expected ${expected}`,
  );
}

function checkRequiredDoc(relativePath) {
  assert(exists(relativePath), `${relativePath} exists`, `${relativePath} is missing`);
}

const packageJson = readJson("package.json");
const appJson = readJson("app.json");
const easJson = readJson("eas.json");
const expo = appJson?.expo;

if (packageJson) {
  assert(packageJson.scripts?.["assets:generate"], "assets:generate script is configured", "assets:generate script is missing");
  assert(packageJson.scripts?.typecheck, "typecheck script is configured", "typecheck script is missing");
  assert(packageJson.scripts?.["release:check"], "release:check script is configured", "release:check script is missing");
  assert(packageJson.dependencies?.expo?.startsWith("~55.0."), "Expo SDK 55 dependency is configured", "Expo SDK 55 dependency is missing");
}

if (expo) {
  assert(expo.name === "LuckyPets", "App name is LuckyPets", "App name is not LuckyPets");
  assert(Boolean(expo.description), "Expo description is configured", "Expo description is missing");
  assert(expo.ios?.bundleIdentifier === "com.lovelsf.luckypets", "iOS bundle identifier is stable", "iOS bundle identifier is missing or unstable");
  assert(expo.android?.package === "com.lovelsf.luckypets", "Android package name is stable", "Android package name is missing or unstable");

  checkAsset(expo.icon, 1024, 1024);
  checkAsset(expo.android?.adaptiveIcon?.foregroundImage, 1024, 1024);
  checkAsset(expo.android?.adaptiveIcon?.monochromeImage, 1024, 1024);
  checkAsset(expo.splash?.image, 1242, 2436);
  checkAsset(expo.web?.favicon, 48, 48);

  if (expo.extra?.eas?.projectId === "replace-after-eas-init") {
    warn("EAS projectId is still a placeholder. Run eas init before internal builds.");
  } else if (expo.extra?.eas?.projectId) {
    pass("EAS projectId is configured");
  } else {
    warn("EAS projectId is not configured. Run eas init before internal builds.");
  }
}

if (easJson) {
  assert(Boolean(easJson.build?.development), "EAS development build profile exists", "EAS development build profile is missing");
  assert(Boolean(easJson.build?.preview), "EAS preview build profile exists", "EAS preview build profile is missing");
  assert(Boolean(easJson.build?.production), "EAS production build profile exists", "EAS production build profile is missing");
}

[
  "docs/internal-testing.md",
  "docs/store-listing-draft.md",
  "docs/store-readiness.md",
  "docs/development-plan.md",
].forEach(checkRequiredDoc);

if (exists("docs/store-listing-draft.md")) {
  const storeDraft = readText("docs/store-listing-draft.md");
  if (storeDraft.includes("Privacy policy URL / 隐私政策链接：TBD")) {
    warn("Privacy policy URL is still TBD.");
  }
  if (storeDraft.includes("Terms of service URL / 服务条款链接：TBD")) {
    warn("Terms of service URL is still TBD.");
  }
  if (storeDraft.includes("Support URL or email / 支持链接或邮箱：TBD")) {
    warn("Support URL or email is still TBD.");
  }
}

console.log("LuckyPets release readiness check");
console.log("");

for (const message of results.pass) console.log(`PASS ${message}`);
for (const message of results.warn) console.log(`WARN ${message}`);
for (const message of results.fail) console.log(`FAIL ${message}`);

console.log("");
console.log(`${results.pass.length} passed, ${results.warn.length} warnings, ${results.fail.length} failed`);

if (results.fail.length > 0) {
  process.exit(1);
}

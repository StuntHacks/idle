#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

console.log(process.argv);
if (!process.argv[2]) {
    console.log("Please provide a target");
    process.exit(1);
}

const MASTER_PATH = "./src/ts/i18n/translations/en.json";
const TARGET_PATH = `./src/ts/i18n/translations/${process.argv[2]}.json`;

function deepMerge(master, target) {
  const result = { ...target };

  for (const key of Object.keys(master)) {
    if (!(key in target)) {
      result[key] = master[key];
    } else if (
      typeof master[key] === "object" &&
      master[key] !== null &&
      !Array.isArray(master[key]) &&
      typeof target[key] === "object" &&
      target[key] !== null &&
      !Array.isArray(target[key])
    ) {
      result[key] = deepMerge(master[key], target[key]);
    }
  }

  return result;
}

const masterPath = path.resolve(MASTER_PATH);
const targetPath = path.resolve(TARGET_PATH);

if (!fs.existsSync(targetPath)) {
  console.error(`Target file not found: ${targetPath}`);
  process.exit(1);
}

const master = JSON.parse(fs.readFileSync(masterPath, "utf-8"));
const target = JSON.parse(fs.readFileSync(targetPath, "utf-8"));

const merged = deepMerge(master, target);

fs.writeFileSync(targetPath, JSON.stringify(merged, null, 2), "utf-8");
console.log(
  `Updated "${TARGET_PATH}"`,
);

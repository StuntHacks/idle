const fs = require("fs");

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const changelog = JSON.parse(
  fs.readFileSync("src/ts/game_logic/data/changelog.json", "utf8"),
);

const today = new Date();
const date = [
  String(today.getDate()).padStart(2, "0"),
  String(today.getMonth() + 1).padStart(2, "0"),
  today.getFullYear(),
].join(".");

const exists = changelog.some((entry) => entry.version === pkg.version);

if (exists) {
  console.log(`Changelog entry for v${pkg.version} already exists, skipping.`);
  process.exit(0);
}

changelog.push({
  version: pkg.version,
  date,
  changes: [],
});

fs.writeFileSync(
  "src/ts/game_logic/data/changelog.json",
  JSON.stringify(changelog, null, 4),
);
console.log(`Added changelog entry for v${pkg.version} (${date}).`);

const fs = require("fs");

const PACKAGE = "package.json";
const PACKAGE_LOCK = "package-lock.json";
const CHANGELOG = "src/ts/game_logic/data/changelog.json";

const updateJson = (file, indent, update) => {
  const raw = fs.readFileSync(file, "utf8");
  const eol = raw.includes("\r\n") ? "\r\n" : "\n";
  const data = JSON.parse(raw);
  update(data);

  let out = JSON.stringify(data, null, indent).replace(/\n/g, eol);
  if (/\r?\n$/.test(raw)) out += eol;
  fs.writeFileSync(file, out);
};

const pkg = JSON.parse(fs.readFileSync(PACKAGE, "utf8"));
const [major, minor, patch] = pkg.version.split(".").map(Number);
const version = [major, minor, patch + 1].join(".");

updateJson(PACKAGE, 2, (data) => {
  data.version = version;
});

if (fs.existsSync(PACKAGE_LOCK)) {
  updateJson(PACKAGE_LOCK, 2, (data) => {
    data.version = version;
    if (data.packages?.[""]) data.packages[""].version = version;
  });
}

console.log(`Bumped version from v${pkg.version} to v${version}.`);

const today = new Date();
const date = [
  String(today.getDate()).padStart(2, "0"),
  String(today.getMonth() + 1).padStart(2, "0"),
  today.getFullYear(),
].join(".");

updateJson(CHANGELOG, 4, (changelog) => {
  if (changelog.some((entry) => entry.version === version)) {
    console.log(`Changelog entry for v${version} already exists, skipping.`);
    return;
  }

  changelog.push({
    version,
    date,
    changes: [],
  });
  console.log(`Added changelog entry for v${version} (${date}).`);
});

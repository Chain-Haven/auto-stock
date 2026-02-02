const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

async function build() {
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const zipPath = path.join(dist, "merchant-connector.zip");

fs.mkdirSync(dist, { recursive: true });
const files = ["merchant-connector.php"];
const output = fs.createWriteStream(zipPath);
const archive = archiver("zip", { zlib: { level: 9 } });
archive.pipe(output);
for (const f of files) {
  archive.file(path.join(root, f), { name: f });
}
archive.finalize();
await new Promise((resolve, reject) => {
  output.on("close", resolve);
  archive.on("error", reject);
});
console.log("Built:", zipPath);
}
build().catch((e) => { console.error(e); process.exit(1); });

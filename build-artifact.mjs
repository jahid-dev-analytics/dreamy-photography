/* Inline every local asset into a single self-contained page.
 *
 * The local site (photo/index.html) references real files under assets/ so it
 * can be hosted anywhere. The claude.ai artifact host blocks relative and
 * remote media, and this user's account has no `assets` capability, so the
 * published build has to carry its media as data URIs inside the page.
 *
 *   node build-artifact.mjs
 *   -> photo/dist/index.html
 *
 * Fails loudly if the result would exceed the 16 MB artifact ceiling.
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, statSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, 'index.html');
const ASSETS = join(HERE, 'assets');
const DIST = join(HERE, 'dist');
const CAP = 16 * 1024 * 1024;

const MIME = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.mp4': 'video/mp4', '.webm': 'video/webm',
};

/* every file under assets/, keyed by the relative path the HTML would use */
function walk(dir, prefix = 'assets') {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) { out.push(...walk(full, `${prefix}/${name}`)); continue; }
    const mime = MIME[extname(name).toLowerCase()];
    if (mime) out.push({ rel: `${prefix}/${name}`, full, mime });
  }
  return out;
}

let html = readFileSync(SRC, 'utf8');
const files = walk(ASSETS);

/* longest paths first, so assets/p1.jpg never clobbers assets/p12.jpg */
files.sort((a, b) => b.rel.length - a.rel.length);

let inlined = 0, bytes = 0;
const unused = [];

for (const f of files) {
  if (!html.includes(f.rel)) { unused.push(f.rel); continue; }
  const b64 = readFileSync(f.full).toString('base64');
  const uri = `data:${f.mime};base64,${b64}`;
  html = html.split(f.rel).join(uri);
  inlined++;
  bytes += uri.length;
  console.log(`  inlined ${f.rel.padEnd(30)} ${(statSync(f.full).size / 1024 | 0)}kB -> ${(uri.length / 1024 | 0)}kB base64`);
}

/* anything still pointing at assets/ would silently fail on the host */
const leftover = [...html.matchAll(/(?:src|poster)="(assets\/[^"]+)"/g)].map(m => m[1]);
const leftoverJs = [...html.matchAll(/'(assets\/[^']+)'/g)].map(m => m[1]);
const missing = [...new Set([...leftover, ...leftoverJs])];

mkdirSync(DIST, { recursive: true });
writeFileSync(join(DIST, 'index.html'), html);

const size = Buffer.byteLength(html);
console.log(`\ninlined ${inlined} assets (${(bytes / 1048576).toFixed(2)} MB of base64)`);
console.log(`page: ${(size / 1048576).toFixed(2)} MB of ${(CAP / 1048576)} MB ceiling`);
if (unused.length) console.log(`unused in assets/: ${unused.length} file(s)`);
if (missing.length) {
  console.log(`\nWARNING — ${missing.length} asset path(s) had no matching file and will not load:`);
  missing.forEach(m => console.log(`  ${m}`));
}
if (size > CAP) {
  console.error(`\nFAIL: ${(size / 1048576).toFixed(2)} MB exceeds the ${CAP / 1048576} MB ceiling. Re-encode smaller.`);
  process.exit(1);
}
console.log('\nok -> photo/dist/index.html');

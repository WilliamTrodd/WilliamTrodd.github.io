#!/usr/bin/env node
/**
 * Builds every Kind B teaching tool from ../tools-src/<slug>/ into
 * public/tools/<slug>/. Run automatically by `prebuild`, so `npm run build`
 * and `npm run deploy` always ship a fresh copy. The output directories are
 * gitignored — tools-src/ is the versioned source.
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TOOLS = [
  { slug: 'bit-panel' },
  { slug: 'gate-check' },
  { slug: 'trace-table' },
  {
    slug: 'worksheet-app',
    // transformers.js overrides wasm.wasmPaths to cdn.jsdelivr.net at import
    // time, so the ~21MB copy Vite bundles is never fetched. Dropping it keeps
    // that dead weight out of the deploy branch. Don't "fix" this back in
    // without confirming in devtools that the local copy is actually used.
    prune: ['assets/ort-wasm-*.wasm'],
  },
];

const run = (cmd, args, cwd) =>
  execFileSync(cmd, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' });

for (const { slug, prune = [] } of TOOLS) {
  const src = path.join('..', 'tools-src', slug);
  if (!fs.existsSync(src)) throw new Error(`missing tool source: ${src}`);
  process.stdout.write(`\n=== building ${slug} ===\n`);

  // ci when a lockfile is present (reproducible), install otherwise.
  const hasLock = fs.existsSync(path.join(src, 'package-lock.json'));
  run('npm', [hasLock ? 'ci' : 'install'], src);
  run('npm', ['run', 'build'], src);

  const out = path.join('public', 'tools', slug);
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  fs.cpSync(path.join(src, 'dist'), out, { recursive: true });

  for (const pattern of prune) {
    const dir = path.join(out, path.dirname(pattern));
    const re = new RegExp('^' + path.basename(pattern).replace(/[.]/g, '\\.').replace(/\*/g, '.*') + '$');
    for (const f of fs.existsSync(dir) ? fs.readdirSync(dir) : []) {
      if (re.test(f)) { fs.rmSync(path.join(dir, f)); console.log(`  pruned ${path.join(pattern.split('/')[0], f)}`); }
    }
  }
}
console.log('\nall tools built');

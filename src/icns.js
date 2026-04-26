// Wraps `iconutil -c icns` for every variant. Mac-only — uses the built-in
// iconutil CLI from Xcode command line tools.
//
// Usage: npm run icns

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { VARIANTS } from './variants.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ICONS_DIR = path.join(ROOT, 'icons');

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit' });
    p.on('close', (code) => code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`)));
    p.on('error', reject);
  });
}

async function main() {
  if (process.platform !== 'darwin') {
    console.error('iconutil is macOS-only. Skipping .icns generation.');
    process.exit(1);
  }

  for (const v of VARIANTS) {
    const iconset = path.join(ICONS_DIR, v.id, 'rootshell.iconset');
    const out = path.join(ICONS_DIR, v.id, 'rootshell.icns');
    try {
      await fs.access(iconset);
    } catch {
      console.warn(`  ⚠  ${v.id}: missing rootshell.iconset (run \`npm run build\` first)`);
      continue;
    }
    console.log(`  → ${v.id}`);
    await run('iconutil', ['-c', 'icns', iconset, '-o', out]);
  }
  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

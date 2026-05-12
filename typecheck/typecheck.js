const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const root = process.env['ROOT_DIR'];
if (!root) {
  console.error('[typecheck] ROOT_DIR not set');
  process.exit(1);
}

const tscBin = process.platform === 'win32' ? 'tsc.cmd' : 'tsc';
const tsc = path.join(__dirname, 'node_modules', '.bin', tscBin);
if (!fs.existsSync(tsc)) {
  console.error('[typecheck] tsc not found — run npm install in the filter directory');
  process.exit(1);
}

try {
  execSync(`"${tsc}" --noEmit`, { cwd: root, stdio: 'inherit', shell: true });
  console.log('[OK] typecheck: no type errors found');
} catch {
  process.exit(1);
}

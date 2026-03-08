#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('[MellAC] Verifying setup...\n');

const checks = [
  {
    name: 'Node.js version',
    check: () => {
      const version = parseInt(process.version.split('.')[0].slice(1));
      return version >= 18;
    },
    message: 'Node.js 18+ required'
  },
  {
    name: 'package.json',
    check: () => fs.existsSync(path.join(__dirname, '..', 'package.json')),
    message: 'package.json found'
  },
  {
    name: 'Dependencies',
    check: () => fs.existsSync(path.join(__dirname, '..', 'node_modules')),
    message: 'Dependencies installed'
  },
  {
    name: 'App directory',
    check: () => fs.existsSync(path.join(__dirname, '..', 'app')),
    message: 'App directory found'
  },
  {
    name: 'Data directory',
    check: () => {
      const dataDir = path.join(__dirname, '..', 'data');
      if (!fs.existsSync(dataDir)) {
        try {
          fs.mkdirSync(dataDir, { recursive: true });
          return true;
        } catch {
          return false;
        }
      }
      return true;
    },
    message: 'Data directory ready'
  },
  {
    name: 'Required packages',
    check: () => {
      try {
        require('better-sqlite3');
        require('bcryptjs');
        require('jsonwebtoken');
        return true;
      } catch {
        return false;
      }
    },
    message: 'All required packages installed'
  }
];

let passed = 0;
let failed = 0;

checks.forEach(({ name, check, message }) => {
  const result = check();
  const status = result ? '✓' : '✗';
  const color = result ? '\x1b[32m' : '\x1b[31m';
  const reset = '\x1b[0m';
  
  console.log(`${color}${status}${reset} ${name}: ${message}`);
  
  if (result) passed++;
  else failed++;
});

console.log(`\n${passed} passed, ${failed} failed\n`);

if (failed === 0) {
  console.log('\x1b[32m✓ Setup verification complete! You can run "pnpm dev"\x1b[0m\n');
  process.exit(0);
} else {
  console.log('\x1b[31m✗ Setup verification failed. Please fix the issues above.\x1b[0m\n');
  process.exit(1);
}

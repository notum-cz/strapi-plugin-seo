'use strict';

const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const ADMIN_SRC = path.join(__dirname, '..', 'admin', 'src');
const en = require(path.join(ADMIN_SRC, 'translations', 'en.json'));

const listSourceFiles = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return listSourceFiles(fullPath);
    return /\.(js|jsx)$/.test(entry.name) ? [fullPath] : [];
  });

// Collects every literal key passed to getTrad('...'). Template-literal keys are skipped.
const collectTranslationKeys = () => {
  const keys = [];
  for (const file of listSourceFiles(ADMIN_SRC)) {
    const source = fs.readFileSync(file, 'utf8');
    for (const match of source.matchAll(/getTrad\(\s*(['"])(.+?)\1\s*\)/g)) {
      keys.push({ key: match[2], file: path.relative(ADMIN_SRC, file) });
    }
  }
  return keys;
};

test('every getTrad() key used in the admin exists in en.json', () => {
  const keys = collectTranslationKeys();
  assert.ok(keys.length > 0, 'no getTrad() calls found');

  const missing = keys.filter(({ key }) => !(key in en)).map(({ key, file }) => `${file}: ${key}`);
  assert.deepStrictEqual(missing, []);
});

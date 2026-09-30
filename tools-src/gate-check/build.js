// Copies index.html into dist/ alongside the compiled stylesheet, swapping the
// inline <style> block for a <link> to it. Keeps the tool's own JS untouched.
const fs = require('fs');
const path = require('path');
const src = fs.readFileSync('index.html', 'utf8');
const out = src.replace(
  /<!--TAILWIND-->/,
  '<link rel="stylesheet" href="./style.css">'
);
if (out === src) throw new Error('TAILWIND placeholder not found in index.html');
fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync(path.join('dist', 'index.html'), out);
console.log('wrote dist/index.html');

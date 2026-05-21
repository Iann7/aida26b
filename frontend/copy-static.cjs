const fs = require('fs');
const path = require('path');

const srcIndex = path.join(__dirname, 'index.html');
const destIndex = path.join(__dirname, 'dist', 'index.html');
const srcStyles = path.join(__dirname, 'styles.css');
const destStyles = path.join(__dirname, 'dist', 'styles.css');

if (!fs.existsSync(path.join(__dirname, 'dist'))) {
  fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
}

fs.copyFileSync(srcIndex, destIndex);
fs.copyFileSync(srcStyles, destStyles);
console.log('Copied index.html to dist/index.html');
console.log('Copied styles.css to dist/styles.css');

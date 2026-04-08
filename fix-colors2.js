const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /bg-\[#141420\]/g, replacement: 'bg-[var(--bg-card)]' },
  { regex: /bg-\[#0c0c17\]/g, replacement: 'bg-[var(--bg-base)]' },
  { regex: /hover:bg-\[#222235\]/g, replacement: 'hover:bg-[var(--bg-elevated)]' },
  { regex: /hover:border-\[#353550\]/g, replacement: 'hover:border-[var(--border-strong)]' },
  { regex: /border-\[#1e1e2e\]/g, replacement: 'border-[var(--border-subtle)]' },
  { regex: /bg-\[#222235\]/g, replacement: 'bg-[var(--bg-elevated)]' },
  { regex: /hover:bg-\[#141420\]/g, replacement: 'hover:bg-[var(--bg-surface)]' },
  { regex: /border-\[var\(--border-default\)\]/g, replacement: 'border-[var(--border-default)]' }, // safety
  { regex: /text-slate-600/g, replacement: 'text-[var(--text-muted)]' },
  { regex: /hover:text-slate-400/g, replacement: 'hover:text-[var(--text-secondary)]' },
  { regex: /hover:text-slate-300/g, replacement: 'hover:text-[var(--text-primary)]' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      for (const { regex, replacement } of replacements) {
        if (regex.test(content)) {
          content = content.replace(regex, replacement);
          modified = true;
        }
      }
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src', 'components'));
processDirectory(path.join(__dirname, 'src', 'app'));

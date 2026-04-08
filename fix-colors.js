const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /bg-\[#1a1a28\]/g, replacement: 'bg-[var(--bg-surface)]' },
  { regex: /bg-\[#0f0f1a\]/g, replacement: 'bg-[var(--bg-base)]' },
  { regex: /bg-\[#13131f\]/g, replacement: 'bg-[var(--bg-card)]' },
  { regex: /border-\[#252535\]/g, replacement: 'border-[var(--border-default)]' },
  { regex: /border-\[#1a1a28\]/g, replacement: 'border-[var(--border-subtle)]' },
  { regex: /text-slate-400/g, replacement: 'text-[var(--text-muted)]' },
  { regex: /text-slate-500/g, replacement: 'text-[var(--text-muted)]' },
  { regex: /text-slate-300/g, replacement: 'text-[var(--text-secondary)]' },
  { regex: /text-slate-200/g, replacement: 'text-[var(--text-primary)]' },
  { regex: /text-gray-400/g, replacement: 'text-[var(--text-muted)]' },
  { regex: /text-gray-500/g, replacement: 'text-[var(--text-muted)]' },
  { regex: /text-gray-300/g, replacement: 'text-[var(--text-secondary)]' },
  { regex: /text-white/g, replacement: 'text-[var(--text-primary)]' },
  { regex: /hover:text-white/g, replacement: 'hover:text-[var(--text-primary)]' },
  { regex: /hover:bg-white\/5/g, replacement: 'hover:bg-[var(--bg-elevated)]' },
  { regex: /bg-white\/5/g, replacement: 'bg-[var(--bg-elevated)]' },
  { regex: /bg-white\/10/g, replacement: 'bg-[var(--bg-elevated)]' },
  { regex: /text-violet-400/g, replacement: 'text-[var(--accent)]' },
  { regex: /text-violet-500/g, replacement: 'text-[var(--accent)]' },
  { regex: /bg-violet-600\/20/g, replacement: 'bg-[var(--accent-glow)]' },
  { regex: /border-violet-500\/30/g, replacement: 'border-[var(--accent)]' },
  { regex: /border-violet-500/g, replacement: 'border-[var(--accent)]' },
  { regex: /focus:border-violet-500/g, replacement: 'focus:border-[var(--accent)]' },
  { regex: /focus:ring-violet-500\/20/g, replacement: 'focus:ring-[var(--accent-glow)]' },
  { regex: /ring-violet-500\/20/g, replacement: 'ring-[var(--accent-glow)]' },
  { regex: /hover:border-violet-500\/30/g, replacement: 'hover:border-[var(--accent)]' },
  { regex: /hover:text-violet-400/g, replacement: 'hover:text-[var(--accent)]' },
  { regex: /bg-gray-950\/30/g, replacement: 'bg-[var(--bg-elevated)]' },
  { regex: /border-gray-700\/30/g, replacement: 'border-[var(--border-subtle)]' }
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

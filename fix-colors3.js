const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /text-violet-300/g, replacement: 'text-[var(--accent)]' },
  { regex: /bg-violet-500\/8/g, replacement: 'bg-[var(--accent-glow)]' },
  { regex: /hover:bg-violet-500\/5/g, replacement: 'hover:bg-[var(--accent-glow)]' },
  { regex: /bg-violet-950\/20/g, replacement: 'bg-[var(--bg-elevated)]' },
  { regex: /bg-violet-400/g, replacement: 'bg-[var(--accent)]' },
  { regex: /text-violet-100/g, replacement: 'text-white' },
  { regex: /bg-violet-500\/15/g, replacement: 'bg-[var(--accent-glow)]' },
  { regex: /via-violet-500/g, replacement: 'via-[var(--accent)]' },
  { regex: /ring-violet-500\/30/g, replacement: 'ring-[var(--accent-glow)]' },
  { regex: /border-violet-700\/30/g, replacement: 'border-[var(--accent)]/30' },
  { regex: /bg-violet-950\/30/g, replacement: 'bg-[var(--accent-glow)]' }
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

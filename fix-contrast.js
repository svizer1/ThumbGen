const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /bg-\[var\(--accent\)\] text-\[var\(--text-primary\)\]/g, replacement: 'bg-[var(--accent)] text-white' },
  { regex: /text-\[var\(--text-primary\)\] bg-\[var\(--accent\)\]/g, replacement: 'text-white bg-[var(--accent)]' },
  { regex: /bg-\[var\(--accent\)\](.*?)text-\[var\(--text-primary\)\]/g, replacement: 'bg-[var(--accent)]$1text-white' },
  { regex: /bg-\[var\(--success\)\](.*?)text-\[var\(--text-primary\)\]/g, replacement: 'bg-[var(--success)]$1text-white' },
  { regex: /bg-\[var\(--error\)\](.*?)text-\[var\(--text-primary\)\]/g, replacement: 'bg-[var(--error)]$1text-white' }
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

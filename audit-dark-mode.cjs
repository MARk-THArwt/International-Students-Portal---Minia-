const fs = require('fs');
const path = require('path');

const replacements = [
  // Hardcoded RGBA colors
  { from: /rgba\(231,\s*231,\s*243,\s*1\)/g, to: 'var(--color-border)' },
  { from: /rgba\(255,\s*255,\s*255,\s*0\.9\)/g, to: 'var(--color-card)' },
  { from: /rgba\(15,\s*15,\s*189,\s*1\)/g, to: 'var(--color-primary)' },
  { from: /rgba\(15,\s*15,\s*189,\s*0\.1\)/g, to: 'var(--color-primary-subtle)' },
  { from: /rgba\(13,\s*13,\s*27,\s*1\)/g, to: 'var(--color-text-dark)' },
  { from: /rgba\(76,\s*76,\s*154,\s*1\)/g, to: 'var(--color-text-muted)' },
  { from: /rgba\(254,\s*240,\s*138,\s*1\)/g, to: 'var(--color-accent)' },
  { from: /rgba\(226,\s*232,\s*240,\s*0\.8\)/g, to: 'var(--color-border)' },
  { from: /rgba\(255,\s*255,\s*255,\s*0\.5\)/g, to: 'rgba(var(--color-card), 0.5)' },
  
  // Tailwind White/Black
  { from: /\bbg-white(?!\/)\b/g, to: 'bg-original-card' },
  { from: /\btext-black(?!\/)\b/g, to: 'text-original-text-dark' },
  { from: /\bborder-white(?!\/)\b/g, to: 'border-original-border-light' },
  
  // Grays/Slates/Zinc/Neutral -> Semantic (Generic replacements)
  { from: /\b(bg|text|border|divide|ring|placeholder)-(gray|slate|zinc|neutral|stone)-50\b/g, to: '$1-original-background-alt' },
  { from: /\b(bg|text|border|divide|ring|placeholder)-(gray|slate|zinc|neutral|stone)-100\b/g, to: '$1-original-border-light' },
  { from: /\b(bg|text|border|divide|ring|placeholder)-(gray|slate|zinc|neutral|stone)-200\b/g, to: '$1-original-border' },
  { from: /\b(bg|text|border|divide|ring|placeholder)-(gray|slate|zinc|neutral|stone)-300\b/g, to: '$1-original-border' },
  { from: /\b(bg|text|border|divide|ring|placeholder)-(gray|slate|zinc|neutral|stone)-400\b/g, to: '$1-original-text-muted/70' },
  { from: /\b(bg|text|border|divide|ring|placeholder)-(gray|slate|zinc|neutral|stone)-500\b/g, to: '$1-original-text-muted' },
  { from: /\b(bg|text|border|divide|ring|placeholder)-(gray|slate|zinc|neutral|stone)-600\b/g, to: '$1-original-text' },
  { from: /\b(bg|text|border|divide|ring|placeholder)-(gray|slate|zinc|neutral|stone)-700\b/g, to: '$1-original-text' },
  { from: /\b(bg|text|border|divide|ring|placeholder)-(gray|slate|zinc|neutral|stone)-800\b/g, to: '$1-original-text-dark' },
  { from: /\b(bg|text|border|divide|ring|placeholder)-(gray|slate|zinc|neutral|stone)-900\b/g, to: '$1-original-text-dark' },

  // Hover states
  { from: /\bhover:bg-(gray|slate|zinc|neutral)-50\b/g, to: 'hover:bg-original-background-alt' },
  { from: /\bhover:bg-(gray|slate|zinc|neutral)-100\b/g, to: 'hover:bg-original-background-alt' },
  
  // Shadows (handle double shadows and color-named shadows)
  { from: /\bshadow-lg shadow-md\b/g, to: 'shadow-lg' },
  { from: /\bshadow-md shadow-md\b/g, to: 'shadow-md' },
  { from: /\bshadow-(gray|slate|zinc|neutral|blue|indigo|rose|emerald|amber|violet|sky|fuchsia|indigo)-\d+(?:\/\d+)?\b/g, to: 'shadow-md dark:shadow-black/40' },
  { from: /\bhover:shadow-(gray|slate|zinc|neutral|blue|indigo)-\d+\b/g, to: 'hover:shadow-lg dark:hover:shadow-black/40' },

  // Blue variations (often used as primary replacements)
  { from: /\btext-blue-100\b/g, to: 'text-original-primary-light' },
  { from: /\btext-blue-300\b/g, to: 'text-original-primary-light' },
  { from: /\bfrom-blue-900 to-blue-600\b/g, to: 'from-original-secondary via-original-primary to-original-primary-active' },
  
  // Specific fixes found in scan
  { from: /bg-\[#c59f5928\]/g, to: 'bg-original-accent-subtle' },
  { from: /focus:border-gray-400/g, to: 'focus:border-original-primary' },
  { from: /bg-gray-300\/40/g, to: 'bg-original-background-alt/40' },
  { from: /bg-slate-900\/40/g, to: 'bg-black/40' }, 
  { from: /bg-slate-900\/60/g, to: 'bg-black/60' },
  { from: /bg-orange-50/g, to: 'bg-original-warning-light' },

  // Clean up previous run mistakes or specific hardcoded vars
  { from: /text-\[var\(--color-primary\)\]/g, to: 'text-original-primary' },
  { from: /bg-\[var\(--color-primary-light\)\]/g, to: 'bg-original-primary-light' },
  { from: /bg-\[var\(--color-primary-subtle\)\]/g, to: 'bg-original-primary-subtle' },
  { from: /text-\[var\(--color-text-dark\)\]/g, to: 'text-original-text-dark' },
  { from: /text-\[var\(--color-text-muted\)\]/g, to: 'text-original-text-muted' },
  { from: /bg-\[var\(--color-card\)\]/g, to: 'bg-original-card' },
  { from: /border-\[var\(--color-border\)\]/g, to: 'border-original-border' },
];

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const targetDir = path.join(__dirname, 'src');

walkDir(targetDir, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.css')) {
    if (filePath.includes('style.css') || filePath.includes('audit-dark-mode.js') || filePath.includes('chartTheme.ts')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    replacements.forEach(r => {
      content = content.replace(r.from, r.to);
    });
    
    if (content !== originalContent) {
      console.log(`Updated: ${filePath}`);
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }
});

console.log('Audit and cleanup completed.');

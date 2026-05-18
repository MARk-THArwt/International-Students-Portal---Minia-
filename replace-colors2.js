import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src');

const exactReplacements = {
    'bg-white': 'bg-original-card',
    'text-black': 'text-original-text-dark',
    'text-gray-900': 'text-original-text-dark',
    'text-gray-800': 'text-original-text',
    'text-gray-700': 'text-original-text',
    'text-gray-600': 'text-original-text-muted',
    'text-gray-500': 'text-original-text-muted',
    'text-gray-400': 'text-original-text-muted/70',
    'border-gray-100': 'border-original-border-light',
    'border-gray-200': 'border-original-border',
    'border-slate-100': 'border-original-border-light',
    'border-slate-200': 'border-original-border',
    'bg-gray-50': 'bg-original-background-alt',
    'bg-slate-50': 'bg-original-background-alt',
    'bg-gray-100': 'bg-original-background-alt',
    'hover:bg-gray-50': 'hover:bg-original-background-alt',
    'hover:bg-gray-100': 'hover:bg-original-border-light',
    'bg-[#F8F8FC]': 'bg-original-background',
    'bg-[#fafbff]': 'bg-original-background',
    'bg-[#F5F7FA]': 'bg-original-background',
    'text-[#4C4C9A]': 'text-original-primary',
    'text-[#1e1e1e]': 'text-original-text-dark',
    'text-[#2f66c5]': 'text-original-primary',
    'text-[#BFDBFE]': 'text-original-primary-light',
    'bg-[#EFF6FF]': 'bg-original-background-alt',
    'border-[#FFD700]': 'border-original-accent',
    'fill-[#C5A059]': 'fill-original-accent',
    'hover:bg-[#0a0a9e]': 'hover:bg-original-primary-hover',
    'border-l-[#0F0FBD]': 'border-l-original-primary',
};

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            for (const [target, replacement] of Object.entries(exactReplacements)) {
                // Escape brackets for regex if needed
                const escapedTarget = target.replace(/\[/g, '\\[').replace(/\]/g, '\\]');
                // Regex with word boundaries for safe replacement, but allowing brackets
                const regex = new RegExp(`(?<![a-zA-Z0-9_-])${escapedTarget}(?![a-zA-Z0-9_-])`, 'g');
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

processDirectory(srcDir);
console.log('Second color replacement pass complete.');

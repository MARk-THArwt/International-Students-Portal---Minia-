import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src');

const replacements = {
    // Primary
    '\\[#0F0FBD\\]': 'original-primary',
    '\\[#0909AA\\]': 'original-primary-hover',
    '\\[#144BB8\\]': 'original-primary-light',
    '\\[#0c0ca0\\]': 'original-primary-active',
    // Secondary
    '\\[#002147\\]': 'original-secondary',
    '\\[#0A1931\\]': 'original-secondary-hover',
    // Accent
    '\\[#C5A059\\]': 'original-accent',
    '\\[rgba\\(197,160,89,0\\.1\\)\\]': 'original-accent-light',
    // Backgrounds
    '\\[#F4F7FB\\]': 'original-background',
    '\\[#F8FAFC\\]': 'original-background-alt',
    // Text
    '\\[#1e293b\\]': 'original-text',
    '\\[#0D0D1C\\]': 'original-text-dark',
    '\\[#475569\\]': 'original-text-muted',
    // Borders
    '\\[#E2E8F0\\]': 'original-border',
    '\\[#F1F5F9\\]': 'original-border-light'
};

const prefixes = ['bg-', 'text-', 'border-', 'ring-', 'border-b-', 'border-t-', 'border-s-', 'hover:bg-', 'hover:text-', 'focus:ring-', 'focus:border-', 'active:bg-', 'active:ring-'];

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            for (const [hexRegex, themeClass] of Object.entries(replacements)) {
                for (const prefix of prefixes) {
                    const regex = new RegExp(`${prefix}${hexRegex}`, 'gi');
                    // E.g., bg-\[#0F0FBD\] -> bg-original-primary
                    const targetClass = `${prefix}${themeClass}`;
                    if (regex.test(content)) {
                        content = content.replace(regex, targetClass);
                        modified = true;
                    }
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
console.log('Color replacement complete.');

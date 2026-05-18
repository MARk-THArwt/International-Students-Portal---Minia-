import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src');

const mapping = {
    // Backgrounds
    'bg-blue-50': 'bg-original-background-alt text-original-primary',
    'bg-blue-100': 'bg-original-background-alt text-original-primary',
    'bg-indigo-50': 'bg-original-background-alt',
    'bg-indigo-100': 'bg-original-background-alt',
    'bg-purple-50': 'bg-original-background-alt',
    'bg-purple-100': 'bg-original-background-alt',
    
    'bg-blue-500': 'bg-original-primary text-white',
    'bg-blue-600': 'bg-original-primary text-white',
    'bg-indigo-400': 'bg-original-primary text-white',
    'bg-indigo-500': 'bg-original-primary text-white',
    'bg-indigo-600': 'bg-original-primary text-white',
    'bg-blue-800': 'bg-original-primary-hover text-white',
    'bg-blue-950': 'bg-original-secondary text-white',
    
    'bg-green-50': 'bg-original-success-light',
    'bg-green-100': 'bg-original-success-light',
    'bg-emerald-50': 'bg-original-success-light',
    'bg-emerald-100': 'bg-original-success-light',
    'bg-emerald-500': 'bg-original-success text-white',
    
    'bg-amber-50': 'bg-original-warning-light',
    'bg-yellow-50': 'bg-original-warning-light',
    'bg-yellow-100': 'bg-original-warning-light',
    'bg-amber-500': 'bg-original-warning text-white',
    
    'bg-red-50': 'bg-original-danger-light',
    'bg-red-100': 'bg-original-danger-light',
    'bg-rose-50': 'bg-original-danger-light',
    'bg-red-500': 'bg-original-danger text-white',
    'bg-rose-500': 'bg-original-danger text-white',
    
    'bg-slate-100': 'bg-original-background-alt',
    'bg-gray-200': 'bg-original-background-alt',
    'bg-gray-800': 'bg-original-text-dark text-white',

    // Text
    'text-blue-500': 'text-original-primary',
    'text-blue-600': 'text-original-primary',
    'text-blue-700': 'text-original-primary-hover',
    'text-blue-800': 'text-original-primary-active',
    'text-blue-900': 'text-original-secondary',
    'text-indigo-400': 'text-original-primary-light',
    'text-indigo-500': 'text-original-primary',
    'text-indigo-600': 'text-original-primary',
    'text-indigo-700': 'text-original-primary-hover',
    'text-purple-600': 'text-original-primary',
    'text-purple-700': 'text-original-primary-hover',
    
    'text-green-500': 'text-original-success',
    'text-green-600': 'text-original-success',
    'text-green-700': 'text-original-success',
    'text-green-800': 'text-original-success',
    'text-emerald-600': 'text-original-success',
    
    'text-amber-500': 'text-original-warning',
    'text-amber-600': 'text-original-warning',
    'text-amber-700': 'text-original-warning',
    'text-amber-800': 'text-original-warning',
    'text-yellow-600': 'text-original-warning',
    'text-yellow-700': 'text-original-warning',
    'text-yellow-800': 'text-original-warning',
    'text-orange-600': 'text-original-warning',
    
    'text-red-400': 'text-original-danger',
    'text-red-500': 'text-original-danger',
    'text-red-600': 'text-original-danger',
    'text-red-700': 'text-original-danger',
    'text-red-800': 'text-original-danger',
    'text-rose-500': 'text-original-danger',
    'text-rose-600': 'text-original-danger',
    
    'text-slate-300': 'text-original-text-muted',
    'text-slate-400': 'text-original-text-muted',
    'text-slate-500': 'text-original-text-muted',
    'text-slate-600': 'text-original-text-muted',
    'text-slate-700': 'text-original-text',
    'text-zinc-600': 'text-original-text-muted',
    'text-gray-200': 'text-original-text-muted',
    'text-gray-300': 'text-original-text-muted',
    
    // Borders
    'border-blue-100': 'border-original-border-light',
    'border-blue-200': 'border-original-border-light',
    'border-blue-600': 'border-original-primary',
    'border-indigo-100': 'border-original-border-light',
    'border-indigo-200': 'border-original-border-light',
    'border-indigo-400': 'border-original-primary-light',
    'border-indigo-600': 'border-original-primary',
    
    'border-green-200': 'border-original-success-light',
    'border-green-400': 'border-original-success',
    'border-green-500': 'border-original-success',
    'border-green-600': 'border-original-success',
    'border-emerald-100': 'border-original-success-light',
    'border-emerald-500': 'border-original-success',
    
    'border-amber-200': 'border-original-warning-light',
    'border-amber-500': 'border-original-warning',
    'border-yellow-200': 'border-original-warning-light',
    'border-orange-100': 'border-original-warning-light',
    
    'border-red-100': 'border-original-danger-light',
    'border-red-200': 'border-original-danger-light',
    'border-red-400': 'border-original-danger',
    'border-red-500': 'border-original-danger',
    'border-rose-100': 'border-original-danger-light',
    
    'border-zinc-300': 'border-original-border',

    // Focus & Hover variations
    'focus:border-blue-500': 'focus:border-original-primary',
    'focus:border-blue-600': 'focus:border-original-primary',
    'focus:ring-blue-100': 'focus:ring-original-primary-light',
    'focus:ring-blue-500': 'focus:ring-original-primary',
    'focus:ring-indigo-500': 'focus:ring-original-primary',
    
    'hover:bg-blue-50': 'hover:bg-original-background-alt',
    'hover:bg-blue-100': 'hover:bg-original-background-alt',
    'hover:bg-blue-600': 'hover:bg-original-primary-hover',
    'hover:bg-blue-700': 'hover:bg-original-primary-hover',
    'hover:bg-blue-900': 'hover:bg-original-secondary',
    'hover:bg-indigo-50': 'hover:bg-original-background-alt',
    'hover:bg-indigo-100': 'hover:bg-original-background-alt',
    'hover:bg-indigo-700': 'hover:bg-original-primary-hover',
    'hover:bg-red-50': 'hover:bg-original-danger-light',
    'hover:bg-red-100': 'hover:bg-original-danger-light',
    'hover:bg-rose-50': 'hover:bg-original-danger-light',
    'hover:bg-rose-600': 'hover:bg-original-danger text-white',
    'hover:bg-green-50': 'hover:bg-original-success-light',
    'hover:bg-slate-100': 'hover:bg-original-background-alt',
    'hover:bg-slate-200': 'hover:bg-original-border-light',
    'hover:bg-gray-200': 'hover:bg-original-border-light',
    
    'hover:text-blue-600': 'hover:text-original-primary',
    'hover:text-blue-700': 'hover:text-original-primary-hover',
    'hover:text-indigo-600': 'hover:text-original-primary',
    'hover:text-indigo-700': 'hover:text-original-primary-hover',
    'hover:text-green-600': 'hover:text-original-success',
    'hover:text-rose-500': 'hover:text-original-danger',
    'hover:text-rose-600': 'hover:text-original-danger',
    
    'hover:border-blue-100': 'hover:border-original-border',
    'hover:border-indigo-400': 'hover:border-original-primary-light',
    
    'group-hover:text-blue-500': 'group-hover:text-original-primary',
    'group-hover:text-blue-600': 'group-hover:text-original-primary',
    'group-hover:text-blue-900': 'group-hover:text-original-secondary',
    'group-hover:text-indigo-500': 'group-hover:text-original-primary',
    'group-hover:bg-blue-50': 'group-hover:bg-original-background-alt',
    'group-hover:bg-blue-100': 'group-hover:bg-original-background-alt',
    'group-hover:bg-indigo-50': 'group-hover:bg-original-background-alt',
    'group-hover:border-blue-200': 'group-hover:border-original-border',
};

// Also add a direct hex replace for text-[#64748B] just in case it wasn't caught
const extraExactReplacements = {
    'text-[#64748B]': 'text-original-text-muted',
    'text-\\[#64748B\\]': 'text-original-text-muted',
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

            for (const [target, replacement] of Object.entries(mapping)) {
                // Must ensure we only match exact utility classes to not break substrings like `bg-blue-500/20`
                const regex = new RegExp(`(?<![a-zA-Z0-9_-])${target}(?![a-zA-Z0-9_-])`, 'g');
                if (regex.test(content)) {
                    content = content.replace(regex, replacement);
                    modified = true;
                }
            }
            
            // Hex ones with brackets
            for (const [target, replacement] of Object.entries(extraExactReplacements)) {
                if (content.includes(target)) {
                    content = content.replace(new RegExp(target.replace(/\[/g, '\\[').replace(/\]/g, '\\]'), 'g'), replacement);
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
console.log('Third color replacement pass complete.');

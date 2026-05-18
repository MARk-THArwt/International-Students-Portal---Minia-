import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src');

const foundColors = new Set();
const foundHex = new Set();

const colorRegex = /\b(?:hover:|focus:|active:|group-hover:)?(?:bg|text|border|ring|fill|stroke)-([a-z]+)-([0-9]{2,3})(?:\/[0-9]+)?\b/g;
const hexRegex = /\b(?:hover:|focus:|active:|group-hover:)?(?:bg|text|border|ring|fill|stroke)-\[#([0-9a-fA-F]{3,6})\]/g;
// also search for any text-black, text-white, bg-black, bg-white
const simpleColorRegex = /\b(?:hover:|focus:|active:|group-hover:)?(?:bg|text|border)-(white|black|transparent)\b/g;

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            
            let match;
            while ((match = colorRegex.exec(content)) !== null) {
                // Ignore our own custom theme variables if they accidently match (they don't have numbers usually, except maybe original-blue-500)
                if (match[1] !== 'original') {
                    foundColors.add(match[0]);
                }
            }
            while ((match = hexRegex.exec(content)) !== null) {
                foundHex.add(match[0]);
            }
            while ((match = simpleColorRegex.exec(content)) !== null) {
                foundColors.add(match[0]);
            }
        }
    }
}

processDirectory(srcDir);

console.log(JSON.stringify({
    standardColors: Array.from(foundColors).sort(),
    hexColors: Array.from(foundHex).sort()
}, null, 2));

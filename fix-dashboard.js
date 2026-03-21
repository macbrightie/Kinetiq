const fs = require('fs');

let content = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

// The first replacement was done but DAYS was removed. Let's add DAYS back under the new imports.
if (!content.includes('const DAYS =')) {
    content = content.replace(
        'import ClientHealthChart, { ClientType, SortMode, STATUS_CFG } from "@/components/ClientHealthChart";',
        'import ClientHealthChart, { ClientType, SortMode, STATUS_CFG } from "@/components/ClientHealthChart";\n\nconst DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];'
    );
}

// Remove the inline block of ClientHealthChart
const lines = content.split('\n');
let newLines = [];
let inChart = false;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('// ─── Client Health Chart')) {
        inChart = true;
    }
    
    if (inChart && lines[i].includes('// ─── Activity Section')) {
        inChart = false;
        newLines.push(lines[i]);
        continue;
    }

    if (!inChart) {
        newLines.push(lines[i]);
    }
}

fs.writeFileSync('src/app/dashboard/page.tsx', newLines.join('\n'));
console.log('Fixed dashboard page');

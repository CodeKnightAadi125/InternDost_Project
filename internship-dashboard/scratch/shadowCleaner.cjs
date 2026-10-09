const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const componentsDir = path.join(srcDir, 'components');

const shadowReplacements = [
    // Neutralize heavy dark shadows
    { regex: /boxShadow:\s*['"]0 \d+px \d+px -?\d*px rgba\(0,\s*0,\s*0,\s*0\.[58]\)['"]/gi, replace: "boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'" },
    { regex: /boxShadow:\s*['"]0 4px 20px rgba\(0,\s*0,\s*0,\s*0\.3\)['"]/gi, replace: "boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)'" },
    
    // Neutralize cyan/orange neon shadows
    { regex: /boxShadow:\s*['"]0 \d*px? \d+px rgba\(0,\s*229,\s*255,\s*0\.\d+\)['"]/gi, replace: "boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'" },
    { regex: /boxShadow:\s*['"]0 \d*px? \d+px rgba\(37,\s*99,\s*235,\s*0\.[24]\)['"]/gi, replace: "boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'" },
    { regex: /boxShadow:\s*['"]0 \d*px? \d+px rgba\(245,\s*158,\s*11,\s*0\.\d+\)['"]/gi, replace: "boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.2)'" },
    { regex: /boxShadow:\s*['"]0 \d*px? \d+px rgba\(255,\s*100,\s*100,\s*0\.2\)['"]/gi, replace: "boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2)'" },
    { regex: /boxShadow:\s*['"]0 \d*px? \d+px rgba\(52,\s*211,\s*153,\s*0\.4\)['"]/gi, replace: "boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)'" },

    // Fix remaining #00E5FF logic in React conditionals
    { regex: /'#00E5FF'/gi, replace: "'#2563EB'" },
    { regex: /rgba\(0,\s*229,\s*255,\s*0\.[1-9]\)/gi, replace: "rgba(37, 99, 235, 0.1)" },

    // Remaining dark colors
    { regex: /color:\s*['"]#0B1120['"]/gi, replace: "color: '#FFFFFF'" }
];

function processFile(filePath) {
    if (filePath.endsWith('AdminDashboard.jsx')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    shadowReplacements.forEach(({ regex, replace }) => {
        const newContent = content.replace(regex, replace);
        if (newContent !== content) {
            content = newContent;
            modified = true;
        }
    });

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed Shadows in:', filePath);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            processFile(fullPath);
        }
    }
}

walkDir(componentsDir);
console.log('Shadow cleanup complete!');

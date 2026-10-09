const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const componentsDir = path.join(srcDir, 'components');

const replacements = [
    // Backgrounds
    { regex: /background-color: #0b1120/gi, replace: "background-color: #F1F5F9" },
    { regex: /background:\s*['"]#0B1120['"]/gi, replace: "background: '#F1F5F9'" },
    { regex: /backgroundColor:\s*['"]#0b1120['"]/gi, replace: "backgroundColor: '#F1F5F9'" },
    
    // Cards
    { regex: /background:\s*['"]rgba\(15,\s*23,\s*42,\s*0\.6\)['"]/gi, replace: "background: '#FFFFFF'" },
    { regex: /background:\s*['"]rgba\(15,\s*23,\s*42,\s*1\)['"]/gi, replace: "background: '#FFFFFF'" },
    { regex: /background:\s*['"]rgba\(11,\s*17,\s*32,\s*1\)['"]/gi, replace: "background: '#F8FAFC'" },
    { regex: /background:\s*['"]rgba\(0,0,0,0\.3\)['"]/gi, replace: "background: '#F1F5F9'" },
    
    // Borders
    { regex: /border:\s*['"]1px solid rgba\(0,\s*229,\s*255,\s*0\.[123]\)['"]/gi, replace: "border: '1px solid #E2E8F0'" },
    { regex: /border:\s*['"]1px solid rgba\(255,\s*255,\s*255,\s*0\.1\)['"]/gi, replace: "border: '1px solid #E2E8F0'" },
    { regex: /border:\s*['"]1px solid rgba\(255,\s*255,\s*255,\s*0\.05\)['"]/gi, replace: "border: '1px solid #F1F5F9'" },
    { regex: /borderBottom:\s*['"]1px solid rgba\(255,255,255,0\.1\)['"]/gi, replace: "borderBottom: '1px solid #E2E8F0'" },
    
    // Text Colors
    { regex: /color:\s*['"]#F8FAFC['"]/gi, replace: "color: '#0F172A'" },
    { regex: /color:\s*['"]#CBD5E1['"]/gi, replace: "color: '#475569'" },
    { regex: /color:\s*['"]#94A3B8['"]/gi, replace: "color: '#64748B'" },
    { regex: /color:\s*['"]#00E5FF['"]/gi, replace: "color: '#2563EB'" },
    { regex: /color:\s*['"]#0B1120['"]/gi, replace: "color: '#FFFFFF'" },

    // Primary Accents (Cyan -> Blue)
    { regex: /['"]#00E5FF['"]/gi, replace: "'#2563EB'" },
    { regex: /rgba\(0,\s*229,\s*255,\s*0\.1\)/gi, replace: "rgba(37, 99, 235, 0.1)" },
    { regex: /rgba\(0,\s*229,\s*255,\s*0\.2\)/gi, replace: "rgba(37, 99, 235, 0.2)" },
    { regex: /rgba\(0,\s*229,\s*255,\s*0\.4\)/gi, replace: "rgba(37, 99, 235, 0.4)" },

    // Shadows
    { regex: /boxShadow:\s*['"]0 8px 32px 0 rgba\(0,\s*0,\s*0,\s*0\.3\)['"]/gi, replace: "boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'" },
    { regex: /boxShadow:\s*['"]0 15px 30px rgba\(0,\s*229,\s*255,\s*0\.15\)['"]/gi, replace: "boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'" },
    { regex: /boxShadow:\s*['"]0 0 15px rgba\(0,\s*229,\s*255,\s*0\.4\)['"]/gi, replace: "boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.4)'" },
];

function processFile(filePath) {
    if (filePath.endsWith('AdminDashboard.jsx')) return; // skip AdminDashboard as it's already built
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    replacements.forEach(({ regex, replace }) => {
        const newContent = content.replace(regex, replace);
        if (newContent !== content) {
            content = newContent;
            modified = true;
        }
    });

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated:', filePath);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.css')) {
            processFile(fullPath);
        }
    }
}

// Update App.css manually for the global layout
const appCssPath = path.join(srcDir, 'App.css');
if (fs.existsSync(appCssPath)) {
    let appCss = fs.readFileSync(appCssPath, 'utf8');
    appCss = appCss.replace(/background-color: #0b1120;/gi, "background-color: #F1F5F9;");
    appCss = appCss.replace(/color: #f8fafc;/gi, "color: #334155;");
    appCss = appCss.replace(/background: radial-gradient.*#0b1120;/gis, "background: #F1F5F9;");
    fs.writeFileSync(appCssPath, appCss, 'utf8');
    console.log('Updated App.css');
}

walkDir(componentsDir);
console.log('Theme replacement complete!');

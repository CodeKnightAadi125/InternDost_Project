const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
    if (!fs.existsSync(dir)) return files;
    const fileList = fs.readdirSync(dir);
    for (const file of fileList) {
        const name = path.join(dir, file);
        if (fs.statSync(name).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== 'scratch') {
                getFiles(name, files);
            }
        } else {
            if (name.endsWith('.js') || name.endsWith('.jsx') || name.endsWith('.css')) {
                files.push(name);
            }
        }
    }
    return files;
}

const frontendFiles = getFiles('c:/Users/adity/Desktop/Main Project(React+Node)/internship-dashboard/src');
const backendFiles = getFiles('c:/Users/adity/Desktop/Main Project(React+Node)/server').filter(f => !f.includes('node_modules'));
const allFiles = [...frontendFiles, ...backendFiles];

let result = '# Full Codebase\\n\\n';

for (const file of allFiles) {
    const relativePath = file.replace('c:\\\\Users\\\\adity\\\\Desktop\\\\Main Project(React+Node)\\\\', '').replace(/\\/g, '/');
    result += '## ' + relativePath + '\\n\\n';
    const ext = path.extname(file).substring(1);
    const lang = ext === 'css' ? 'css' : (ext === 'jsx' ? 'jsx' : 'javascript');
    result += '```' + lang + '\\n';
    try {
        result += fs.readFileSync(file, 'utf8') + '\\n';
    } catch (e) {
        result += '// Error reading file\\n';
    }
    result += '```\\n\\n';
}

fs.writeFileSync('c:/Users/adity/Desktop/Main Project(React+Node)/full_codebase.txt', result);
console.log('Successfully created full_codebase.txt');

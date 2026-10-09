const fs = require('fs');
let adminCode = fs.readFileSync('src/components/AdminDashboard.jsx', 'utf8');

adminCode = adminCode.replace(/function AdminDashboard\(\{ setActiveTab \}\) \{/, 'function AdminDashboard({ activeTab, setActiveTab }) {');
adminCode = adminCode.replace(/const \[adminView, setAdminView\] = useState\('dashboard'\);/, "const adminView = activeTab ? activeTab.replace('admin_', '') : 'dashboard';");

const startString = "return (";
const endString = "{/* SCROLLABLE VIEW */}";
const startIdx = adminCode.indexOf(startString);
const endIdx = adminCode.indexOf(endString);

if (startIdx !== -1 && endIdx !== -1) {
    const replacement = `return (\n        <div style={{ padding: '0px', width: '100%', boxSizing: 'border-box' }}>\n`;
    // We skip the `<div style={{ flex: 1, overflowY: 'auto', padding: '40px' }}>` which is around 63 chars
    adminCode = adminCode.substring(0, startIdx) + replacement + adminCode.substring(endIdx + endString.length + 65);
    
    // We also need to strip out the trailing 3 divs
    adminCode = adminCode.replace(/<\/div>\s*<\/div>\s*<\/div>\s*\);\s*}\s*export default AdminDashboard;/g, "</div>\n    );\n}\nexport default AdminDashboard;");
}

fs.writeFileSync('src/components/AdminDashboard.jsx', adminCode);
console.log('AdminDashboard stripped correctly.');

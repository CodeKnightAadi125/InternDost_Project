const fs = require('fs');

let code = fs.readFileSync('src/components/Login.jsx', 'utf8');

// Container
code = code.replace(/background: 'rgba\\(15, 23, 42, 0\.65\\)'/g, "background: '#FFFFFF'");
code = code.replace(/backdropFilter: 'blur\\(16px\\)',?/g, "");
code = code.replace(/border: activeRole === 'admin'[\\s\\S]*?: '1px solid rgba\\(0, 229, 255, 0\.15\\)',/g, "border: '1px solid #E2E8F0',");

// Role toggle container
code = code.replace(/background: 'rgba\\(0, 0, 0, 0\.3\\)'/g, "background: '#F1F5F9'");
code = code.replace(/border: '1px solid #F1F5F9'/g, "border: '1px solid #E2E8F0'");

// Role toggle text colors
code = code.replace(/color: activeRole === 'user' \? '#0B1120' : '#94A3B8'/g, "color: activeRole === 'user' ? '#FFFFFF' : '#475569'");
code = code.replace(/color: activeRole === 'admin' \? '#0B1120' : '#94A3B8'/g, "color: activeRole === 'admin' ? '#FFFFFF' : '#475569'");

// Typography
code = code.replace(/color: '#F8FAFC'/g, "color: '#0F172A'");
code = code.replace(/color: '#94A3B8'/g, "color: '#64748B'");

// Submit button glow
code = code.replace(/boxShadow: activeRole === 'admin'[^]+?: '0 0 20px rgba\\(0, 229, 255, 0\.4\\)'/g, "boxShadow: 'none'");

fs.writeFileSync('src/components/Login.jsx', code);
console.log("Login styles updated.");

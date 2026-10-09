const fs = require('fs');
let code = fs.readFileSync('server/index.js', 'utf8');

// 1. Add multer
const multerImport = `const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: (req, file, cb) => {
        const allowed = ['.pdf', '.doc', '.docx'];
        if (allowed.includes(path.extname(file.originalname).toLowerCase())) cb(null, true);
        else cb(new Error('Only PDF/DOC/DOCX files are allowed'));
    }
});
`;

code = code.replace("const { z } = require('zod');", "const { z } = require('zod');\n" + multerImport);
code = code.replace("app.use(express.json());", "app.use(express.json());\napp.use('/uploads', express.static('uploads'));");

// 2. Remove resume from applicationSchema
code = code.replace("resume: z.string().min(1),", "");

// 3. Update POST /api/applications to use upload.single
const newAppRoute = `app.post('/api/applications', authMiddleware, upload.single('resume'), async (req, res) => {
    try {
        const data = applicationSchema.parse(req.body);
        const userId = req.user.id;

        const existingApplication = await Application.findOne({ userId, internshipId: data.internshipId });
        if (existingApplication) {
            return res.status(400).json({ error: 'You have already applied for this internship' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Resume file is required' });
        }

        const newApplication = new Application({
            userId,
            resume: '/uploads/' + req.file.filename,
            ...data
        });

        await newApplication.save();
        res.status(201).json({ message: 'Application submitted successfully', application: newApplication });
    } catch (err) {
        if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
        console.error(err);
        res.status(500).json({ error: 'Failed to submit application' });
    }
});`;

code = code.replace(/app\.post\('\/api\/applications'[\s\S]*?res\.status\(500\)\.json\(\{ error: 'Failed to submit application' \}\);\n    }\n\}\);/, newAppRoute);

// 4. Add PUT /api/admin/applications/:id/status
const putStatusRoute = `
app.put('/api/admin/applications/:id/status', authMiddleware, adminOnly, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        const updated = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!updated) return res.status(404).json({ error: 'Application not found' });
        res.json({ message: 'Status updated successfully', application: updated });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update status' });
    }
});
`;

code = code.replace('// ==========================================\n// 3. AUTHENTICATION ROUTES', putStatusRoute + '\n// ==========================================\n// 3. AUTHENTICATION ROUTES');

fs.writeFileSync('server/index.js', code);
console.log('Done rewriting index.js');

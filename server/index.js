const dns = require("dns");
dns.setServers(["1.1.1.1"]);
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
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


// Import Models
const User = require('./models/User');
const Admin = require('./models/Admin');
const Internship = require('./models/Internship');
const Application = require('./models/Application');
const ContactMessage = require('./models/ContactMessage');
const authMiddleware = require('./middleware/auth');
const adminOnly = require('./middleware/adminOnly');
const superAdminOnly = require('./middleware/superAdminOnly');

const app = express();
const PORT = process.env.PORT || 5000;

// Env validation
if (!process.env.JWT_SECRET || !process.env.MONGODB_URI) {
    console.error("FATAL ERROR: JWT_SECRET or MONGODB_URI is missing in the environment.");
    process.exit(1);
}

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Rate Limiters
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas gracefully');

        app.listen(PORT, () => {
            console.log(`Server running smoothly on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('🛑 MongoDB Connection Error:', err.message);
        process.exit(1);
    }
};

connectDB();

// Basic health check route for UptimeRobot
app.get('/', (req, res) => {
    res.status(200).send('Intern Dost Backend is running! 🚀');
});

// Validation Schemas
const registerSchema = z.object({
    name: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(8)
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});

const internshipSchema = z.object({
    title: z.string().min(1),
    company: z.string().min(1),
    location: z.string().min(1),
    duration: z.string().min(1),
    stipend: z.string().min(1),
    category: z.string().min(1),
    skillsRequired: z.array(z.string()).optional()
});

const applicationSchema = z.object({
    internshipId: z.string().min(1),
    qualification: z.string().min(1),
    education: z.string().min(1),

    whyHire: z.string().min(1)
});

const contactSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    category: z.string().min(1),
    message: z.string().min(1)
});


// ==========================================
// 1. INTERNSHIP ROUTES
// ==========================================

app.get('/api/internships', async (req, res) => {
    try {
        const internships = await Internship.find();
        const formattedInternships = internships.map(intern => ({
            id: intern._id,
            title: intern.title,
            company: intern.company,
            location: intern.location,
            duration: intern.duration,
            stipend: intern.stipend,
            category: intern.category,
            skillsRequired: intern.skillsRequired
        }));
        res.json(formattedInternships);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Could not fetch internships' });
    }
});

app.post('/api/admin/internships', authMiddleware, adminOnly, async (req, res) => {
    try {
        const data = internshipSchema.parse(req.body);
        const newInternship = new Internship({
            ...data,
            skillsRequired: data.skillsRequired || []
        });

        const savedInternship = await newInternship.save();
        res.status(201).json({
            message: 'Internship added successfully!',
            internship: { ...savedInternship._doc, id: savedInternship._id }
        });
    } catch (err) {
        if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
        console.error(err);
        res.status(500).json({ error: 'Could not save the new internship' });
    }
});

app.put('/api/admin/internships/:id', authMiddleware, adminOnly, async (req, res) => {
    try {
        const updatedInternship = await Internship.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!updatedInternship) return res.status(404).json({ error: 'Internship not found' });
        res.json({ message: 'Internship updated successfully', internship: updatedInternship });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update internship' });
    }
});

app.delete('/api/admin/internships/:id', authMiddleware, adminOnly, async (req, res) => {
    try {
        const deletedInternship = await Internship.findByIdAndDelete(req.params.id);
        if (!deletedInternship) return res.status(404).json({ error: 'Internship not found' });

        res.json({ message: 'Internship deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete internship' });
    }
});

// ==========================================
// 2. APPLICATION ROUTES
// ==========================================

app.post('/api/applications', authMiddleware, upload.single('resume'), async (req, res) => {
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
});

app.get('/api/applications/user', authMiddleware, async (req, res) => {
    try {
        const applications = await Application.find({ userId: req.user.id })
            .populate('internshipId', 'title company location stipend');

        const formattedApplications = applications.map(app => ({
            id: app.internshipId ? app.internshipId._id : 'N/A',
            title: app.internshipId ? app.internshipId.title : 'Deleted Role',
            company: app.internshipId ? app.internshipId.company : 'Deleted Company',
            status: app.status,
            appliedOn: new Date(app.appliedOn).toLocaleDateString()
        }));

        res.json(formattedApplications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch your applications' });
    }
});

app.get('/api/admin/applications', authMiddleware, adminOnly, async (req, res) => {
    try {
        const applications = await Application.find()
            .populate('userId', 'name email degree')
            .populate('internshipId', 'title company');

        const formattedApplications = applications.map(app => ({
            id: app._id,
            studentName: app.userId ? app.userId.name : 'Deleted User',
            studentEmail: app.userId ? app.userId.email : 'N/A',
            studentDegree: app.userId ? app.userId.degree : 'N/A',
            role: app.internshipId ? app.internshipId.title : 'Deleted Role',
            company: app.internshipId ? app.internshipId.company : 'Deleted Company',
            status: app.status,
            qualification: app.qualification,
            education: app.education,
            resume: app.resume,
            whyHire: app.whyHire,
            aiScore: app.aiScore,
            aiSummary: app.aiSummary,
            appliedOn: new Date(app.appliedOn).toLocaleDateString()
        }));

        res.json(formattedApplications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch all applications' });
    }
});




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

// ==========================================
// 3. AUTHENTICATION ROUTES
// ==========================================

app.post('/api/register', authLimiter, async (req, res) => {
    try {
        const { name, email, password } = registerSchema.parse(req.body);
        const cleanEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({ email: cleanEmail });
        if (existingUser) return res.status(400).json({ error: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name: (name && name.trim()) || 'User',
            email: cleanEmail,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
        console.error(err);
        res.status(500).json({ error: 'Could not save user' });
    }
});

app.post('/api/login', authLimiter, async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const cleanEmail = email.trim().toLowerCase();

        const user = await User.findOne({ email: cleanEmail });
        if (!user) return res.status(400).json({ error: 'Invalid user email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid user email or password' });

        const token = jwt.sign({ id: user._id, email: user.email, role: 'user' }, JWT_SECRET, { expiresIn: '1h' });

        res.json({
            message: 'User login successful',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: 'user' }
        });
    } catch (err) {
        if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
        console.error(err);
        res.status(500).json({ error: 'Server error during login' });
    }
});

app.post('/api/admin/login', authLimiter, async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const cleanEmail = email.trim().toLowerCase();

        const admin = await Admin.findOne({ email: cleanEmail });
        if (!admin) return res.status(400).json({ error: 'Invalid admin email or password' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid admin email or password' });

        const token = jwt.sign({ id: admin._id, email: admin.email, role: admin.role }, JWT_SECRET, { expiresIn: '1h' });

        res.json({
            message: 'Admin login successful',
            token,
            user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role }
        });
    } catch (err) {
        if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
        console.error(err);
        res.status(500).json({ error: 'Server error reading admin database' });
    }
});

app.get('/api/admin/list', authMiddleware, superAdminOnly, async (req, res) => {
    try {
        const admins = await Admin.find().select('-password');
        res.json(admins);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch admins' });
    }
});

app.post('/api/admin/create', authMiddleware, superAdminOnly, async (req, res) => {
    try {
        const { name, email, password } = registerSchema.parse(req.body);
        const cleanEmail = email.trim().toLowerCase();

        const existingAdmin = await Admin.findOne({ email: cleanEmail });
        if (existingAdmin) return res.status(400).json({ error: 'Admin email already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new Admin({
            name: (name && name.trim()) || 'Admin',
            email: cleanEmail,
            password: hashedPassword
        });

        await newAdmin.save();
        res.status(201).json({ message: 'Admin account created successfully!' });
    } catch (err) {
        if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
        console.error(err);
        res.status(500).json({ error: 'Could not create admin account' });
    }
});

app.delete('/api/admin/:id', authMiddleware, superAdminOnly, async (req, res) => {
    try {
        if (req.params.id === req.user.id) {
            return res.status(400).json({ error: 'You cannot delete your own admin account.' });
        }
        const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
        if (!deletedAdmin) return res.status(404).json({ error: 'Admin not found' });

        res.json({ message: 'Admin deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete admin' });
    }
});

// ==========================================
// 4. PROFILE ROUTES
// ==========================================

app.get('/api/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

app.put('/api/profile', authMiddleware, async (req, res) => {
    try {
        const { title, about, degree, university, year, phone, location } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { title, about, degree, university, year, phone, location } },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// ==========================================
// 5. CONTACT ROUTES
// ==========================================

app.post('/api/contact', async (req, res) => {
    try {
        const data = contactSchema.parse(req.body);
        const newMessage = new ContactMessage(data);
        await newMessage.save();
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (err) {
        if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
        console.error(err);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

app.get('/api/admin/messages', authMiddleware, adminOnly, async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});
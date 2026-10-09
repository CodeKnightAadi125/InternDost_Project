const dns = require("dns");
dns.setServers(["1.1.1.1"]);
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const User = require('./models/User');
const Admin = require('./models/Admin');
const Internship = require('./models/Internship');

async function migrateData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Migrate Users
        const usersFile = path.join(__dirname, 'data', 'users.json');
        if (fs.existsSync(usersFile)) {
            const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
            for (let user of users) {
                const existing = await User.findOne({ email: user.email });
                if (!existing) {
                    await User.create({
                        name: user.name,
                        email: user.email,
                        password: user.password,
                        role: user.role || 'user'
                    });
                }
            }
            console.log('✅ Users migrated');
        }

        // Migrate Admins
        const adminsFile = path.join(__dirname, 'data', 'admins.json');
        if (fs.existsSync(adminsFile)) {
            const admins = JSON.parse(fs.readFileSync(adminsFile, 'utf8'));
            for (let admin of admins) {
                const existing = await Admin.findOne({ email: admin.email });
                if (!existing) {
                    await Admin.create({
                        name: admin.name,
                        email: admin.email,
                        password: admin.password,
                        role: admin.role || 'admin'
                    });
                }
            }
            console.log('✅ Admins migrated');
        }

        // Migrate Internships
        const internshipsFile = path.join(__dirname, 'data', 'internships.json');
        if (fs.existsSync(internshipsFile)) {
            const internships = JSON.parse(fs.readFileSync(internshipsFile, 'utf8'));
            for (let intern of internships) {
                const existing = await Internship.findOne({ title: intern.title, company: intern.company });
                if (!existing) {
                    await Internship.create({
                        title: intern.title,
                        company: intern.company,
                        location: intern.location,
                        duration: intern.duration,
                        stipend: intern.stipend,
                        category: intern.category,
                        skillsRequired: intern.skillsRequired || []
                    });
                }
            }
            console.log('✅ Internships migrated');
        }

        console.log('🚀 Migration Complete!');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrateData();

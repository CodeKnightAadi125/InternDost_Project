const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    duration: { type: String, required: true },
    stipend: { type: String, required: true },
    category: { type: String, required: true },
    skillsRequired: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Internship', internshipSchema);

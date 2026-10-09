const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    internshipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
    qualification: { type: String, required: true },
    education: { type: String, required: true },
    resume: { type: String }, // Store filename or base64
    whyHire: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    aiScore: { type: Number },
    aiSummary: { type: String },
    appliedOn: { type: Date, default: Date.now }
}, { timestamps: true });

applicationSchema.index({ userId: 1, internshipId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);

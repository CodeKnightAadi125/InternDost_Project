const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    title: { type: String, default: 'Student' },
    about: { type: String, default: '' },
    degree: { type: String, default: '' },
    university: { type: String, default: '' },
    year: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

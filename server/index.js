const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Route to fetch all internships
app.get('/api/internships', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'internships.json');

    // THIS LINE WILL TELL US THE EXACT FOLDER IT IS LOOKING IN:
    console.log("Reading data from:", filePath);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Could not read internship data' });
        }
        res.json(JSON.parse(data));
    });
});
// API Route to add a new internship
app.post('/api/internships', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'internships.json');

    // 1. Read the existing file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Could not read internship data' });
        }

        const internships = JSON.parse(data);

        // 2. Create the new internship object with an auto-incrementing ID
        const newInternship = {
            id: internships.length > 0 ? internships[internships.length - 1].id + 1 : 1,
            title: req.body.title,
            company: req.body.company,
            location: req.body.location,
            duration: req.body.duration,
            stipend: req.body.stipend,
            category: req.body.category,
            skillsRequired: req.body.skillsRequired || []
        };

        // 3. Push the new item into the array
        internships.push(newInternship);

        // 4. Write the updated array back to internships.json
        fs.writeFile(filePath, JSON.stringify(internships, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Could not save the new internship' });
            }

            // 5. Send success response back to the client
            res.status(201).json({
                message: 'Internship added successfully!',
                internship: newInternship
            });
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running smoothly on http://localhost:${PORT}`);
});
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Log file path
const logFilePath = path.join(__dirname, 'tcg120_data.json');

// POST endpoint to receive data from TCG120
app.post('/data', (req, res) => {
    const receivedData = req.body;
    const timestampedData = {
        timestamp: new Date().toISOString(),
        ...receivedData
    };

    console.log("Received Data:", timestampedData);

    // Save to local JSON file
    fs.readJson(logFilePath)
        .then(data => {
            data.push(timestampedData);
            return fs.writeJson(logFilePath, data);
        })
        .catch(() => {
            return fs.writeJson(logFilePath, [timestampedData]);
        });

    // Respond to TCG120
    res.status(200).json({
        status: "success",
        message: "Data received"
    });
});

// Basic GET route for testing
app.get('/', (req, res) => {
    res.send("TCG120 Server is running!");
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
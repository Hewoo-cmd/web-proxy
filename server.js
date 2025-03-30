// server.js
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve the static frontend (Game Hub)
app.use(express.static(path.join(__dirname, 'public')));

// Proxy request to target game URL
app.get('/proxy', async (req, res) => {
    let targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).send('❌ No URL provided');
    }

    // Automatically load Block Blast if "block blast" is entered
    if (targetUrl.toLowerCase() === 'block blast') {
        targetUrl = 'https://block-blast.io/';
    }

    try {
        // Fetch the target content
        const response = await axios({
            method: 'GET',
            url: targetUrl,
            responseType: 'arraybuffer',
        });

        // Set content type for HTML content
        const contentType = response.headers['content-type'];
        res.set('Content-Type', contentType);
        res.send(response.data);
    } catch (error) {
        console.error(`Error fetching URL: ${error.message}`);
        res.status(500).send('❌ Error fetching the game');
    }
});

// Proxy for assets like JS, CSS, and images
app.get('/proxy/assets', async (req, res) => {
    const assetUrl = req.query.url;
    if (!assetUrl) {
        return res.status(400).send('❌ No asset URL provided');
    }

    try {
        // Fetch the asset (JS, CSS, images)
        const response = await axios({
            method: 'GET',
            url: assetUrl,
            responseType: 'arraybuffer',
        });

        // Set the correct content type for the asset
        const contentType = response.headers['content-type'];
        res.set('Content-Type', contentType);
        res.send(response.data);
    } catch (error) {
        console.error(`Error fetching asset: ${error.message}`);
        res.status(500).send('❌ Error fetching the asset');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`✅ Proxy server running at: http://localhost:${PORT}`);
});

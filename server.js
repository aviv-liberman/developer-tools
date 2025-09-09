const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from root directory
app.use(express.static('.'));

// Serve index.html at root
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
    console.log('\x1b[32m%s\x1b[0m', `Server running on http://localhost:${PORT}`,);
}); 
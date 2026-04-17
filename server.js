const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve all files in /public as static assets (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// For any other route, return index.html (single-page behaviour)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Ketlen Celestin website running → http://localhost:${PORT}`);
});

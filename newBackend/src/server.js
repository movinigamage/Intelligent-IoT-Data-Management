//handles server setup and configuration for the Express backend

require('dotenv').config({ path: '../.env' }); // Load .env from root

const express = require('express');
const cors = require('cors');

// Import routes
const apiRouter = require('./routes');   // loads index.js inside /routes

const app = express();
app.use(cors());
app.use(express.json());

// Root ping
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Mount all /api routes (datasets, series, timestamps, analyse)
app.use('/api', apiRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');

// Load env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helmet with explicit, permissive-enough CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://inventario-3v7f.onrender.com"],
      objectSrc: ["'none'"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      frameAncestors: ["'none'"],
    }
  }
}));

// Serve static files (optional, in case you add frontend later)
app.use(express.static(path.join(__dirname, 'public')));

// Dummy favicon route to silence browser complaints
app.use('/favicon.ico', (req, res) => res.sendStatus(204));

// Optional root route
app.get('/', (req, res) => {
  res.send('SmartInventory API is live');
});

// Routes
const receiptRoutes = require('./routes/receiptRoutes');
const inventoryRoutes = require('./routes/centralInventoryRoutes');

app.use('/api/receipts', receiptRoutes);
app.use('/api/inventory', inventoryRoutes);
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/upload.html'));
});
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  dbName: 'InventorySystem',
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});


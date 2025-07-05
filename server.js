const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const receiptRoutes = require('./routes/receiptRoutes');
const inventoryRoutes = require('./routes/centralInventoryRoutes');

app.use('/api/receipts', receiptRoutes);
app.use('/api/inventory', inventoryRoutes);

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


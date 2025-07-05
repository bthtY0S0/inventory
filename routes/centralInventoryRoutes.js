// routes/centralInventoryRoutes.js
const express = require('express');
const router = express.Router();
const CentralInventory = require('../models/CentralInventory');

router.get('/export', async (req, res) => {
  try {
    const inventory = await CentralInventory.find({}, '-_id itemCode quantity');
    res.json({ inventory });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch inventory.', error: err.message });
  }
});

module.exports = router;


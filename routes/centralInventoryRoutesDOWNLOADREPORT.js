// routes/centralInventoryRoutes.js
const express = require('express');
const router = express.Router();
const CentralInventory = require('../models/CentralInventory');
const { Parser } = require('json2csv');

router.get('/export-csv', async (req, res) => {
  try {
    const inventory = await CentralInventory.find({}, '-_id itemCode quantity');
    const parser = new Parser({ fields: ['itemCode', 'quantity'] });
    const csv = parser.parse(inventory);

    res.header('Content-Type', 'text/csv');
    res.attachment('SmartInventory.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: 'Failed to export inventory.', error: err.message });
  }
});

module.exports = router;


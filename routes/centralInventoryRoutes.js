const express = require('express');
const router = express.Router();
const CentralInventory = require('../models/CentralInventory');
const { Parser } = require('json2csv');

// ✅ Route: GET /api/inventory/export-csv
router.get('/export-csv', async (req, res) => {
  try {
    const inventory = await CentralInventory.find({}, 'sku name logo quantity').sort({ name: 1, logo: 1 });

    const fields = ['name', 'logo', 'sku', 'quantity'];
    const parser = new Parser({ fields });
    const csv = parser.parse(inventory);

    res.header('Content-Type', 'text/csv');
    res.attachment('SmartInventory.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: 'Failed to export inventory.', error: err.message });
  }
});

// ✅ Route: GET /api/inventory/report (returns JSON for table view)
router.get('/report', async (req, res) => {
  try {
    const items = await CentralInventory.find({}, 'sku name logo quantity').sort({ name: 1, logo: 1 });
    res.json({ items }); // Must be JSON to support frontend fetch
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch inventory report.', error: err.message });
  }
});

module.exports = router;


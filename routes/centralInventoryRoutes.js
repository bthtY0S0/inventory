// ✅ Add this inside routes/centralInventoryRoutes.js

const express = require('express');
const router = express.Router();
const CentralInventory = require('../models/CentralInventory');
const { Parser } = require('json2csv');

// Existing routes: export-csv and report...

router.get('/export-csv', async (req, res) => {
  try {
    const inventory = await CentralInventory.find({}, 'sku name logo quantity').sort({ name: 1, logo: 1 });
    const parser = new Parser({ fields: ['name', 'logo', 'sku', 'quantity'] });
    const csv = parser.parse(inventory);
    res.header('Content-Type', 'text/csv');
    res.attachment('SmartInventory.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: 'Failed to export inventory.', error: err.message });
  }
});

router.get('/report', async (req, res) => {
  try {
    const items = await CentralInventory.find({}, 'sku name logo quantity').sort({ name: 1, logo: 1 });
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch inventory report.', error: err.message });
  }
});

// ✅ New PATCH /api/inventory/adjust
router.patch('/adjust', async (req, res) => {
  const { sku, logo, quantity } = req.body;

  if (!sku || !logo || isNaN(quantity)) {
    return res.status(400).json({ message: 'Missing or invalid sku, logo, or quantity.' });
  }

  try {
    const updated = await CentralInventory.findOneAndUpdate(
      { sku, logo },
      { $inc: { quantity: parseInt(quantity) }, last_updated: Date.now() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: `Item not found: SKU ${sku}, Logo ${logo}` });
    }

    res.json({
      message: `Inventory updated.`,
      updatedItem: {
        name: updated.name,
        sku: updated.sku,
        logo: updated.logo,
        newQty: updated.quantity
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating inventory.', error: err.message });
  }
});

module.exports = router;


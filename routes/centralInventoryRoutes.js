const express = require('express');
const router = express.Router();
const CentralInventory = require('../models/CentralInventory');
const Item = require('../models/Item');

router.get('/report', async (req, res) => {
  try {
    const [inventory, items] = await Promise.all([
      CentralInventory.find({}).lean(),
      Item.find({}).lean()
    ]);

    const itemMap = {};
    for (const item of items) {
      itemMap[item.sku] = item.name || 'Unnamed';
    }

    const report = inventory.map(entry => ({
      sku: entry.sku,
      name: itemMap[entry.sku] || 'Unknown SKU',
      quantity: entry.quantity,
      last_updated: entry.last_updated
    }));

    res.json(report);
  } catch (err) {
    console.error('Error generating inventory report:', err);
    res.status(500).json({ message: 'Failed to generate report' });
  }
});

module.exports = router;

const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const CentralInventory = require('../models/CentralInventory');
const Item = require('../models/Item');

async function exportInventoryToCSV(filePath) {
  const [inventory, items] = await Promise.all([
    CentralInventory.find({}).lean(),
    Item.find({}).lean()
  ]);

  const itemMap = {};
  items.forEach(item => {
    itemMap[item.sku] = item.name;
  });

  const csvWriter = createCsvWriter({
    path: filePath,
    header: [
      { id: 'sku', title: 'SKU' },
      { id: 'name', title: 'Name' },
      { id: 'quantity', title: 'Quantity' },
      { id: 'last_updated', title: 'Last Updated' }
    ]
  });

  const records = inventory.map(entry => ({
    sku: entry.sku,
    name: itemMap[entry.sku] || 'Unknown',
    quantity: entry.quantity,
    last_updated: entry.last_updated
  }));

  await csvWriter.writeRecords(records);
  return filePath;
}

module.exports = { exportInventoryToCSV };


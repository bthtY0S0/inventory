// csvUploadController.js
const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const CentralInventory = require('../models/CentralInventory');
const InventoryUpdateLog = require('../models/InventoryUpdateLog');
const Location = require('../models/Location');

async function uploadCSVData(req, res) {
  try {
    const filePath = req.file.path;
    const updates = [];

    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => rows.push(data))
      .on('end', async () => {
        for (const row of rows) {
          const { sku, quantity, location_code } = row;
          const qty = parseInt(quantity);

          const location = await Location.findOne({ code: location_code });
          if (!location) {
            console.warn(`Unknown location: ${location_code}`);
            continue;
          }

          await CentralInventory.updateOne(
            { sku },
            { $inc: { quantity: -qty }, $set: { last_updated: new Date() } },
            { upsert: true }
          );

          updates.push({
            sku,
            quantity_changed: -qty,
            location_id: location._id,
            reason: 'store_shipment',
            timestamp: new Date()
          });
        }

        await InventoryUpdateLog.insertMany(updates);
        res.json({ message: 'Inventory updated from CSV' });
      });
  } catch (err) {
    console.error('CSV Upload Error:', err);
    res.status(500).json({ message: 'Error processing CSV' });
  }
}

exports.uploadCSVData = uploadCSVData;


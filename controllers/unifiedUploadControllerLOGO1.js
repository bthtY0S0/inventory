const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const CentralInventory = require('../models/CentralInventory');
const storeRegions = require('../utils/storeRegions');

const isBolsa = (sku) => ["2400760", "2400761"].includes(sku);

async function parseCSVFile(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', reject);
  });
}

exports.handleUpload = async (req, res) => {
  const filePath = req.file?.path;
  if (!filePath) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    const ext = path.extname(filePath).toLowerCase();
    if (ext !== '.csv') {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'Only .csv files are supported.' });
    }

    const parsedRows = await parseCSVFile(filePath);
    const updatedItems = [];

    for (const row of parsedRows) {
      const { storeId, sku, quantity } = row;

      if (!storeId || !sku || !quantity || isNaN(quantity)) continue;

      const logo = isBolsa(sku) ? "Universal" : storeRegions[storeId];

      if (!logo) {
        console.warn(`Skipping unknown storeId: ${storeId}`);
        continue;
      }

      const updated = await CentralInventory.findOneAndUpdate(
        { sku: sku.trim(), logo },
        { $inc: { quantity: -parseInt(quantity) }, last_updated: Date.now() },
        { new: true }
      );

      if (updated) {
        updatedItems.push({
          sku: updated.sku,
          logo: updated.logo,
          newQty: updated.quantity
        });
      } else {
        console.warn(`No match found for SKU ${sku} at logo ${logo}`);
      }
    }

    fs.unlinkSync(filePath);

    return res.json({
      message: 'CSV processed and inventory updated.',
      updatedItems
    });

  } catch (err) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return res.status(500).json({ message: 'Processing failed.', error: err.message });
  }
};


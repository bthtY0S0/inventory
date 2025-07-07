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
    const skippedRows = [];

    for (let i = 0; i < parsedRows.length; i++) {
      const row = parsedRows[i];
      const line = i + 2; // assumes line 1 = header row

      const storeId = row.storeId?.trim();
      const sku = row.sku?.trim();
      const quantity = parseInt(row.quantity);

      if (!storeId || !sku || isNaN(quantity)) {
        skippedRows.push({ line, reason: 'Missing or invalid storeId, sku, or quantity', row });
        continue;
      }

      const logo = isBolsa(sku) ? "Universal" : storeRegions[storeId];
      if (!logo) {
        skippedRows.push({ line, reason: `Unknown storeId '${storeId}'`, row });
        continue;
      }

      const updated = await CentralInventory.findOneAndUpdate(
        { sku, logo },
        { $inc: { quantity: -quantity }, last_updated: Date.now() },
        { new: true }
      );

      if (updated) {
        updatedItems.push({
          sku: updated.sku,
          logo: updated.logo,
          newQty: updated.quantity
        });
      } else {
        skippedRows.push({ line, reason: `SKU '${sku}' not found in region '${logo}'`, row });
      }
    }

    fs.unlinkSync(filePath);

    return res.json({
      message: 'CSV processed and inventory updated.',
      updatedItems,
      skippedRows
    });

  } catch (err) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return res.status(500).json({ message: 'Processing failed.', error: err.message });
  }
};


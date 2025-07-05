const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const CentralInventory = require('../models/CentralInventory');

function parseCSVFile(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', (err) => reject(err));
  });
}

async function updateInventoryFromRows(rows) {
  const updatedItems = [];

  for (const row of rows) {
    const itemCode = row.itemCode?.trim();
    const quantity = parseInt(row.quantity);

    if (!itemCode || isNaN(quantity)) continue;

    const updated = await CentralInventory.findOneAndUpdate(
      { itemCode },
      { $inc: { quantity } },
      { new: true }
    );

    if (updated) {
      updatedItems.push({ itemCode, newQty: updated.quantity });
    }
  }

  return updatedItems;
}

exports.handleUpload = async (req, res) => {
  const filePath = req.file?.path;

  if (!filePath) {
    return res.status(400).json({ message: 'No CSV file uploaded.' });
  }

  try {
    const ext = path.extname(filePath).toLowerCase();
    if (ext !== '.csv') {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'Only .csv files are supported.' });
    }

    const rows = await parseCSVFile(filePath);
    const updatedItems = await updateInventoryFromRows(rows);

    fs.unlinkSync(filePath);

    res.json({ message: 'CSV processed and inventory updated.', updatedItems });
  } catch (err) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.status(500).json({ message: 'Processing failed.', error: err.message });
  }
};


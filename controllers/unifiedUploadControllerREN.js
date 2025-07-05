const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { uploadCSVData } = require('./csvUploadController');

exports.uploadUnified = async (req, res) => {
  try {
    const { originalname, path: tempPath } = req.file;

    // Check file extension
    const ext = path.extname(originalname).toLowerCase();

    if (ext === '.csv') {
      // Just hand off to CSV processor directly
      return await uploadCSVData(req, res);
    }

    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
      // OCR the image and create CSV
      const { data: { text } } = await Tesseract.recognize(tempPath, 'eng');

      const lines = text.split('\n').filter(l => l.trim().length > 0);

      const rows = lines.map(line => {
        const parts = line.trim().split(/\s{2,}/);
        return {
          document_number: parts[0],
          order_number: parts[1],
          date_received: parts[2],
          location_code: parts[3],
          sku: parts[4],
          name: parts[5],
          quantity: parseInt(parts[6]) || 0,
          unit_cost: parseFloat(parts[7]) || 0
        };
      });

      // Save as temporary CSV
      const csvPath = path.join(__dirname, '../temp/temp_converted.csv');
      const csvWriter = createCsvWriter({
        path: csvPath,
        header: [
          { id: 'document_number', title: 'document_number' },
          { id: 'order_number', title: 'order_number' },
          { id: 'date_received', title: 'date_received' },
          { id: 'location_code', title: 'location_code' },
          { id: 'sku', title: 'sku' },
          { id: 'name', title: 'name' },
          { id: 'quantity', title: 'quantity' },
          { id: 'unit_cost', title: 'unit_cost' }
        ]
      });

      await csvWriter.writeRecords(rows);

      // Reuse existing CSV upload logic
      req.file.path = csvPath;
      return await uploadCSVData(req, res);
    }

    return res.status(400).json({ message: 'Unsupported file type.' });

  } catch (err) {
    console.error('Unified Upload Error:', err);
    res.status(500).json({ message: 'Error processing the uploaded file' });
  }
};


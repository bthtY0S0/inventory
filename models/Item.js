const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  barcode: { type: String },
  name: { type: String, required: true },
  short_code: { type: String },
  unit_cost: { type: Number, required: true },
  reorder_threshold: { type: Number, default: 0 },
  category: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', ItemSchema);

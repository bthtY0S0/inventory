const mongoose = require('mongoose');
const InventorySchema = new mongoose.Schema({
  sku: { type: String, required: true },
  location_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  quantity: { type: Number, required: true },
  last_updated: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Inventory', InventorySchema);

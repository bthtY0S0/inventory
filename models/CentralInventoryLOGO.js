const mongoose = require('mongoose');

const CentralInventorySchema = new mongoose.Schema({
  sku: { type: String, required: true },
  quantity: { type: Number, required: true },
  logo: { type: String, required: true },
  last_updated: { type: Date, default: Date.now }
});

// ✅ This makes sku+logo unique, allowing multi-logo support
CentralInventorySchema.index({ sku: 1, logo: 1 }, { unique: true });

module.exports = mongoose.model('CentralInventory', CentralInventorySchema);


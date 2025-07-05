const mongoose = require('mongoose');
const InventoryUpdateLogSchema = new mongoose.Schema({
  sku: { type: String, required: true },
 location_id: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Location',
  required: false // <-- changed from true
},

  quantity_change: { type: Number, required: true },
  reason: { type: String, enum: ['receipt', 'manual_adjustment'], default: 'receipt' },
reason: {
  type: String,
  enum: ['restock', 'receipt', 'manual_adjustment', 'store_shipment'], // <-- add this
  required: true
},
  date: { type: Date, default: Date.now },
  receipt_event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ReceiptEvent' },
  updated_by: { type: String, default: 'OCR Processor' }
});
module.exports = mongoose.model('InventoryUpdateLog', InventoryUpdateLogSchema);

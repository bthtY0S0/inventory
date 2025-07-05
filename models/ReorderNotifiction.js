const mongoose = require('mongoose');
const ReorderNotificationSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  location_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  current_stock: { type: Number, required: true },
  threshold: { type: Number, required: true },
  triggered_on: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false },
  resolved_on: { type: Date },
  auto_triggered: { type: Boolean, default: true }
});
module.exports = mongoose.model('ReorderNotification', ReorderNotificationSchema);

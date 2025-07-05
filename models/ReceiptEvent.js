const mongoose = require('mongoose');
const ReceiptEventSchema = new mongoose.Schema({
  document_number: { type: String, required: true },
  order_number: { type: String },
  date_received: { type: Date, required: true },
  delivery_note: { type: String },
  location_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  image_url: { type: String },
  vendor_name: { type: String },
  subtotal: { type: Number },
  iva: { type: Number },
  total: { type: Number },
  currency: { type: String, default: 'MXN' },
  parsed_items: [{
    sku: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit_cost: { type: Number, required: true }
  }],
  uploaded_at: { type: Date, default: Date.now }
});
module.exports = mongoose.model('ReceiptEvent', ReceiptEventSchema);

const mongoose = require('mongoose');
const LocationSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String },
  address: { type: String },
  region: { type: String },
  created_at: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Location', LocationSchema);

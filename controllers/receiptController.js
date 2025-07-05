const ReceiptEvent = require('../models/ReceiptEvent');
const Inventory = require('../models/Inventory');
const InventoryUpdateLog = require('../models/InventoryUpdateLog');
const Item = require('../models/Item');
const Location = require('../models/Location');

async function uploadReceipt(req, res) {
  try {
    const {
      document_number,
      order_number,
      date_received,
      delivery_note,
      location_code,
      image_url,
      vendor_name,
      subtotal,
      iva,
      total,
      currency,
      parsed_items
    } = req.body;

    const location = await Location.findOne({ code: location_code });
    if (!location) {
      return res.status(400).json({ message: 'Location not found' });
    }

    const receipt = new ReceiptEvent({
      document_number,
      order_number,
      date_received,
      delivery_note,
      location_id: location._id,
      image_url,
      vendor_name,
      subtotal,
      iva,
      total,
      currency,
      parsed_items
    });
    await receipt.save();

    for (const item of parsed_items) {
      const { sku, quantity, unit_cost } = item;

      await Inventory.updateOne(
        { sku, location_id: location._id },
        { $inc: { quantity }, $set: { last_updated: new Date() } },
        { upsert: true }
      );

      await InventoryUpdateLog.create({
        sku,
        location_id: location._id,
        quantity_change: quantity,
        reason: 'receipt',
        receipt_event_id: receipt._id,
        updated_by: 'OCR Processor'
      });

      await Item.updateOne(
        { sku },
        { $set: { unit_cost, updated_at: new Date() } }
      );
    }

    res.status(201).json({ message: 'Receipt and inventory updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { uploadReceipt };

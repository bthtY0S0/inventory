const mongoose = require('mongoose');
require('dotenv').config();

const CentralInventory = require('../models/CentralInventory');

const items = [
  { sku: "2400768", quantity: 83 },  // Visera Sport
  { sku: "2400762", quantity: 61 },  // Gorra Gabardina
  { sku: "2400767", quantity: 29 },  // Visera Velcro XL
  { sku: "2400771", quantity: 40 },  // Sombrero Legionario
  { sku: "2400764", quantity: 32 },  // Sombrero Australiano
  { sku: "2400766", quantity: 0 },   // Visera Clip Grande (blank in Cancun)
  { sku: "2400761", quantity: 155 }, // Bolsa Ovalada Playa
  { sku: "2400760", quantity: 157 }  // Bolsa Cuadrada Playa
];

async function seedMainInventory() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    for (const item of items) {
      await CentralInventory.updateOne(
        { sku: item.sku },
        { $set: { quantity: item.quantity, last_updated: new Date() } },
        { upsert: true }
      );
      console.log(`✅ Seeded SKU ${item.sku} with ${item.quantity} units`);
    }

    console.log("✔ Main inventory seeded.");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding main inventory:", err);
    process.exit(1);
  }
}

seedMainInventory();

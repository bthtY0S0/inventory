const mongoose = require('mongoose');
require('dotenv').config();
const CentralInventory = require('../models/CentralInventory');

const inventoryItems = [
  // Cancun
  { sku: "2400768", quantity: 83, logo: "cancun" },  // Visera Sport
  { sku: "2400762", quantity: 61, logo: "cancun" },  // Gorra Gabardina
  { sku: "2400767", quantity: 29, logo: "cancun" },  // Visera Velcro XL
  { sku: "2400771", quantity: 40, logo: "cancun" },  // Sombrero Legionario
  { sku: "2400764", quantity: 32, logo: "cancun" },  // Sombrero Australiano

  // Riviera Maya
  { sku: "2400768", quantity: 26, logo: "riviera_maya" },
  { sku: "2400762", quantity: 35, logo: "riviera_maya" },
  { sku: "2400767", quantity: 19, logo: "riviera_maya" },
  { sku: "2400771", quantity: 33, logo: "riviera_maya" },
  { sku: "2400764", quantity: 35, logo: "riviera_maya" },
  { sku: "2400766", quantity: 20, logo: "riviera_maya" },

  // Tulum
  { sku: "2400768", quantity: 75, logo: "tulum" },
  { sku: "2400762", quantity: 73, logo: "tulum" },
  { sku: "2400767", quantity: 49, logo: "tulum" },
  { sku: "2400771", quantity: 27, logo: "tulum" },
  { sku: "2400764", quantity: 43, logo: "tulum" },
  { sku: "2400766", quantity: 54, logo: "tulum" },

  // Total-only products, treated as central count
  { sku: "2400761", quantity: 155, logo: "cancun" },  // Bolsa Ovalada de Playa
  { sku: "2400760", quantity: 157, logo: "cancun" }   // Bolsa Cuadrada de Playa
];

async function seedMainInventory() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    for (const item of inventoryItems) {
      await CentralInventory.updateOne(
        { sku: item.sku, logo: item.logo },
        { $set: { quantity: item.quantity, last_updated: new Date() } },
        { upsert: true }
      );
      console.log(`Seeded SKU ${item.sku} with quantity ${item.quantity} under logo ${item.logo}`);
    }

    console.log("✔ Multi-logo main inventory seeding complete.");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding inventory:", err);
    process.exit(1);
  }
}

seedMainInventory();

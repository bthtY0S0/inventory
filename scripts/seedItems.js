const mongoose = require('mongoose');
require('dotenv').config();

const Item = require('../models/Item');

const items = [
  { sku: "2400768", name: "Visera Sport" },
  { sku: "2400762", name: "Gorra Gabardina" },
  { sku: "2400767", name: "Visera Velcro XL" },
  { sku: "2400771", name: "Sombrero Legionario" },
  { sku: "2400764", name: "Sombrero Australiano" },
  { sku: "2400766", name: "Visera Clip Grande" },
  { sku: "2400761", name: "Bolsa Ovalada de Playa" },
  { sku: "2400760", name: "Bolsa Cuadrada de Playa" }
];

async function seedItems() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    for (const item of items) {
      await Item.updateOne(
        { sku: item.sku },
        { $set: item },
        { upsert: true }
      );
      console.log(`✅ Seeded item: ${item.sku} - ${item.name}`);
    }

    console.log("✔ Item seeding complete.");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding items:", err);
    process.exit(1);
  }
}

seedItems();


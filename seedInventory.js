require('dotenv').config();
const mongoose = require('mongoose');
const CentralInventory = require('./models/CentralInventory'); // adjust path if needed

const items = [
  // Visera Sport (2400768)
  { sku: "2400768", name: "Visera Sport", logo: "Cancun", quantity: 100 },
  { sku: "2400768", name: "Visera Sport", logo: "Riviera Maya", quantity: 100 },
  { sku: "2400768", name: "Visera Sport", logo: "Tulum", quantity: 100 },

  // Gorra Gabardina (2400762)
  { sku: "2400762", name: "Gorra Gabardina", logo: "Cancun", quantity: 100 },
  { sku: "2400762", name: "Gorra Gabardina", logo: "Riviera Maya", quantity: 100 },
  { sku: "2400762", name: "Gorra Gabardina", logo: "Tulum", quantity: 100 },

  // Visera Velcro XL (2400767)
  { sku: "2400767", name: "Visera Velcro XL", logo: "Cancun", quantity: 100 },
  { sku: "2400767", name: "Visera Velcro XL", logo: "Riviera Maya", quantity: 100 },
  { sku: "2400767", name: "Visera Velcro XL", logo: "Tulum", quantity: 100 },

  // Sombrero Legionario (2400771)
  { sku: "2400771", name: "Sombrero Legionario", logo: "Cancun", quantity: 100 },
  { sku: "2400771", name: "Sombrero Legionario", logo: "Riviera Maya", quantity: 100 },
  { sku: "2400771", name: "Sombrero Legionario", logo: "Tulum", quantity: 100 },

  // Sombrero Australiano (2400764)
  { sku: "2400764", name: "Sombrero Australiano", logo: "Cancun", quantity: 100 },
  { sku: "2400764", name: "Sombrero Australiano", logo: "Riviera Maya", quantity: 100 },
  { sku: "2400764", name: "Sombrero Australiano", logo: "Tulum", quantity: 100 },

  // Visera Clip Grande (2400766)
  { sku: "2400766", name: "Visera Clip Grande", logo: "Cancun", quantity: 100 },
  { sku: "2400766", name: "Visera Clip Grande", logo: "Riviera Maya", quantity: 100 },
  { sku: "2400766", name: "Visera Clip Grande", logo: "Tulum", quantity: 100 },

  // Bolsa Ovalada de Playa (2400761)
  { sku: "2400761", name: "Bolsa Ovalada de Playa", logo: "Universal", quantity: 100 },

  // Bolsa Cuadrada de Playa (2400760)
  { sku: "2400760", name: "Bolsa Cuadrada de Playa", logo: "Universal", quantity: 100 }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('🧹 Clearing existing inventory...');
    await CentralInventory.deleteMany({});

    console.log('🌱 Seeding new inventory...');
    await CentralInventory.insertMany(items);

    console.log('✅ Inventory seeded successfully.');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    mongoose.disconnect();
  }
}

seed();


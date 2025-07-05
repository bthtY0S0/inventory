// scripts/seedLocations.js
const mongoose = require('mongoose');
require('dotenv').config();

const Location = require('../models/Location');

const locations = [
  { code: '139PTOCANCUN', name: 'Puerto Cancun', address: 'Zona Hotelera, Cancún', region: 'CANCUN' },
  { code: '187KIKIMBE', name: 'Kikimbe', address: 'Av. Tulum, Tulum Centro', region: 'TULUM' },
  { code: '002COZUMEL', name: 'Cozumel Centro', address: 'Av. Rafael Melgar, Cozumel', region: 'COZUMEL' },
  { code: '003PLAYA', name: 'Playa Mamitas', address: '5ta Avenida, Playa del Carmen', region: 'PLAYA' },
  // ... (add 20 more, or duplicate/rename these for testing)
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Location.insertMany(locations);
    console.log('✅ Seeded GoMart locations');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding locations:', err);
    process.exit(1);
  }
}

seed();

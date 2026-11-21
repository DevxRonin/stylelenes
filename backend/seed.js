require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const seedProducts = require('./data/seedProducts');

const seedDatabase = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('❌ MONGO_URI is missing in backend/.env');
    process.exit(1);
  }

  try {
    console.log(`Connecting to MongoDB at: ${uri}...`);
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB Atlas.');

    console.log('Clearing existing products...');
    await Product.deleteMany({});

    console.log(`Inserting ${seedProducts.length} premium eyewear products...`);
    const inserted = await Product.insertMany(seedProducts);

    console.log(`🎉 Successfully seeded ${inserted.length} products into MongoDB!`);
    console.log('Sample product seeded:', inserted[0].name, 'Price:', inserted[0].price);

    await mongoose.disconnect();
    console.log('Database disconnected.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();

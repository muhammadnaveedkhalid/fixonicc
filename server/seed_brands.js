import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Brand from './models/Brand.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const brands = [
  // Mobile
  { name: 'Apple', type: 'Mobile' },
  { name: 'Samsung', type: 'Mobile' },
  { name: 'Google', type: 'Mobile' },
  { name: 'OnePlus', type: 'Mobile' },
  { name: 'Xiaomi', type: 'Mobile' },
  { name: 'Motorola', type: 'Mobile' },
  { name: 'Sony', type: 'Mobile' },
  { name: 'Oppo', type: 'Mobile' },
  { name: 'Vivo', type: 'Mobile' },
  { name: 'Realme', type: 'Mobile' },
  { name: 'Nothing', type: 'Mobile' },
  { name: 'Huawei', type: 'Mobile' },
  { name: 'Honor', type: 'Mobile' },
  { name: 'Asus', type: 'Mobile' },

  // Laptop
  { name: 'Apple', type: 'Laptop' },
  { name: 'Dell', type: 'Laptop' },
  { name: 'HP', type: 'Laptop' },
  { name: 'Lenovo', type: 'Laptop' },
  { name: 'ASUS', type: 'Laptop' },
  { name: 'Acer', type: 'Laptop' },
  { name: 'Microsoft', type: 'Laptop' },
  { name: 'MSI', type: 'Laptop' },
  { name: 'Razer', type: 'Laptop' },
  { name: 'Samsung', type: 'Laptop' },
  { name: 'LG', type: 'Laptop' },
  { name: 'Alienware', type: 'Laptop' },
  { name: 'Gigabyte', type: 'Laptop' },

  // Desktop
  { name: 'Dell', type: 'Desktop' },
  { name: 'HP', type: 'Desktop' },
  { name: 'Lenovo', type: 'Desktop' },
  { name: 'Apple', type: 'Desktop' },
  { name: 'ASUS', type: 'Desktop' },
  { name: 'Acer', type: 'Desktop' },
  { name: 'MSI', type: 'Desktop' },
  { name: 'CyberPowerPC', type: 'Desktop' },
  { name: 'iBuyPower', type: 'Desktop' },
  { name: 'Corsair', type: 'Desktop' },
  { name: 'NZXT', type: 'Desktop' },
  { name: 'Origin PC', type: 'Desktop' },
  { name: 'Maingear', type: 'Desktop' }
];

const seedBrands = async () => {
    try {
        await mongoose.connection.asPromise(); // Ensure connection is ready
        console.log("Connected to database.");

        const count = await Brand.countDocuments();
        if (count > 0) {
            console.log("Brands already exist. Skipping seed to prevent duplicates (or uncomment deleteMany to reset).");
             // Optional: await Brand.deleteMany({});
        } else {
             await Brand.insertMany(brands);
             console.log('Brands seeded successfully!');
        }
        
        process.exit();
    } catch (error) {
        console.error('Error seeding brands:', error);
        process.exit(1);
    }
};

seedBrands();

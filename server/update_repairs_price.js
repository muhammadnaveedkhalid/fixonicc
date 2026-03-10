import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Repair from './models/Repair.js';

dotenv.config();

const updatePrices = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fixonic');
        console.log('Connected to MongoDB');

        const repairs = await Repair.find({});
        console.log(`Found ${repairs.length} repairs to update.`);

        for (const repair of repairs) {
            // Assign a random price between 500 and 5000 if status is not Pending, 
            // otherwise keep it low or at 0.
            let randomPrice = 0;
            if (repair.status !== 'Pending') {
                randomPrice = Math.floor(Math.random() * (5000 - 500 + 1)) + 500;
            } else {
                randomPrice = Math.floor(Math.random() * 500);
            }

            repair.price = randomPrice;
            await repair.save();
        }

        console.log('Successfully updated prices for all repairs.');
        process.exit();
    } catch (error) {
        console.error('Error updating prices:', error);
        process.exit(1);
    }
};

updatePrices();

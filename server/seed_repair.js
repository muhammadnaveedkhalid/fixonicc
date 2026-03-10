import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Repair from './models/Repair.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const dummyRepair = {
    id: `REP-${Math.floor(Math.random() * 900) + 100}`,
    customer: "John Doe",
    device: "Mobile",
    brand: "Apple",
    model: "iPhone 14 Pro",
    issue: "Screen cracked after dropping on concrete. Touch is intermittent.",
    address: "123 Tech Avenue, Silicon Valley, CA",
    status: "Pending",
    date: new Date().toISOString().split("T")[0],
    history: ["Pending"]
};

const seedRepair = async () => {
  try {
    await mongoose.connection.asPromise();
    console.log("Connected to database.");

    const newRepair = new Repair(dummyRepair);
    await newRepair.save();
    
    console.log('Dummy repair added successfully!');
    console.log(newRepair);
    process.exit();
  } catch (error) {
    console.error('Error adding dummy repair:', error);
    process.exit(1);
  }
};

seedRepair();

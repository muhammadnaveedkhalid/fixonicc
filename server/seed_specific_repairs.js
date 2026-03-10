import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Repair from './models/Repair.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const customerId = "6967d95275ca8cb9d84564f6";
const vendorId = "6967e2205b01f9c19afa9423";
const customerName = "Client 1";

const repairs = [
    {
        id: `REP-${Math.floor(Math.random() * 900) + 100}`,
        customer: customerName,
        customerId: customerId,
        vendorId: vendorId,
        device: "Mobile",
        brand: "Apple",
        model: "iPhone 13",
        issue: "Screen cracked, touch unresponsive.",
        address: "123 Main St, Cityville",
        status: "Pending",
        date: new Date().toISOString().split("T")[0],
        history: ["Pending"]
    },
    {
        id: `REP-${Math.floor(Math.random() * 900) + 100}`,
        customer: customerName,
        customerId: customerId,
        vendorId: vendorId,
        device: "Laptop",
        brand: "Dell",
        model: "XPS 15",
        issue: "Battery not charging, overheating.",
        address: "123 Main St, Cityville",
        status: "Accepted",
        date: new Date().toISOString().split("T")[0],
        history: ["Pending", "Accepted"]
    },
    {
        id: `REP-${Math.floor(Math.random() * 900) + 100}`,
        customer: customerName,
        customerId: customerId,
        vendorId: vendorId,
        device: "Mobile",
        brand: "Samsung",
        model: "Galaxy S22",
        issue: "Camera lens cracked.",
        address: "123 Main St, Cityville",
        status: "In Process",
        date: new Date().toISOString().split("T")[0],
        history: ["Pending", "Accepted", "In Process"]
    },
    {
        id: `REP-${Math.floor(Math.random() * 900) + 100}`,
        customer: customerName,
        customerId: customerId,
        vendorId: vendorId,
        device: "Desktop",
        brand: "HP",
        model: "Pavilion",
        issue: "Power supply failure, won't turn on.",
        address: "123 Main St, Cityville",
        status: "Pending",
        date: new Date().toISOString().split("T")[0],
        history: ["Pending"]
    },
    {
        id: `REP-${Math.floor(Math.random() * 900) + 100}`,
        customer: customerName,
        customerId: customerId,
        vendorId: vendorId,
        device: "Laptop",
        brand: "Apple",
        model: "MacBook Air",
        issue: "Trackpad unresponsive.",
        address: "123 Main St, Cityville",
        status: "Ready",
        date: new Date().toISOString().split("T")[0],
        history: ["Pending", "Accepted", "In Process", "Ready"]
    }
];

const seedRepairs = async () => {
    try {
        await mongoose.connection.asPromise();
        console.log("Connected to database.");

        await Repair.insertMany(repairs);
        
        console.log('5 specific repairs added successfully!');
        process.exit();
    } catch (error) {
        console.error('Error adding repairs:', error);
        process.exit(1);
    }
};

seedRepairs();

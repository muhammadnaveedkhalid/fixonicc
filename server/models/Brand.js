import mongoose from 'mongoose';

const brandSchema = mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['Mobile', 'Laptop', 'Desktop'], required: true },
}, { timestamps: true });

export default mongoose.model('Brand', brandSchema);

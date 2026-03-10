import mongoose from 'mongoose';

const repairSchema = mongoose.Schema({
    id: { type: String, unique: true }, // Keeping custom ID for frontend compatibility
    customer: { type: String, required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    device: { type: String, enum: ['Mobile', 'Laptop', 'Desktop'], required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    issue: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: String, default: 'Pending', enum: ['Pending', 'On the Way', 'Completed', 'Rejected'] },
    date: { type: String },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    history: [{ type: String }],
    price: { type: Number, default: 0 },
    image: { type: String },
    media: [{ url: String, type: { type: String, enum: ['image', 'video'] } }],
    proofImage: { type: String }
}, { timestamps: true });

export default mongoose.model('Repair', repairSchema);

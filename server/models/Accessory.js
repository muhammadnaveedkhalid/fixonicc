import mongoose from 'mongoose';

const accessorySchema = mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['Mobile', 'Laptop', 'Tablet'], required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
  stock: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Accessory', accessorySchema);

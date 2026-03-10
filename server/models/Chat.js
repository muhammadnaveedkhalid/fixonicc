import mongoose from 'mongoose';

const chatSchema = mongoose.Schema({
  repairId: { type: String, required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Chat', chatSchema);

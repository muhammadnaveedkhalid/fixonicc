import mongoose from 'mongoose';

const contentSchema = mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      unique: true, // Prevent duplicate entries for the same page
    },
    sections: {
      type: Map, // Flexible structure to store key-value pairs for content
      of: String,
    },
  },
  {
    timestamps: true,
  }
);

const Content = mongoose.model('Content', contentSchema);

export default Content;

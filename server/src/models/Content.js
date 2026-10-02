import mongoose from 'mongoose';

// Holds the whole site's copy as one document keyed by `key` ("site").
// Editing this document in MongoDB changes the website without a redeploy.
const contentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Content', contentSchema);

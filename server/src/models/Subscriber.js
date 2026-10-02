import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 200 },
  },
  { timestamps: true }
);

export default mongoose.model('Subscriber', subscriberSchema);

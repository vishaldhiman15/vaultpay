import mongoose from 'mongoose';

export const connectMongoDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('MONGO_URI is not set. Skipping MongoDB connection.');
    return;
  }
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully for audit logs.');
  } catch (error) {
    console.error('MongoDB connection error. Audit logs will fail gracefully.', error);
  }
};

import 'dotenv/config';
import app from './app.js';
import { connectMongoDB } from './lib/mongoose.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectMongoDB();
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`VaultPay API server running on port ${PORT}`);
  });
};

startServer().catch(console.error);

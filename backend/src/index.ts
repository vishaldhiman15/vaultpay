import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { connectMongoDB } from './lib/mongoose.js';
import { standardRateLimiter } from './middleware/rateLimit.js';

import authRoutes from './routes/auth.routes.js';
import accountsRoutes from './routes/accounts.routes.js';
import transactionsRoutes from './routes/transactions.routes.js';
import upiRoutes from './routes/upi.routes.js';
import cardsRoutes from './routes/cards.routes.js';
import complianceRoutes from './routes/compliance.routes.js';
import emergencyRoutes from './routes/emergency.routes.js';
import webhookRoutes from './routes/webhooks.routes.js';
import vaultsRoutes from './routes/vaults.routes.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(morgan('dev'));

// Ensure raw body for webhook signature verification is available before body-parser
app.use('/api/webhooks', express.json({
  verify: (req: any, res, buf) => {
    req.rawBody = buf.toString();
  }
}), webhookRoutes);

app.use(express.json());
app.use(cookieParser());
app.use(standardRateLimiter);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Mount API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/accounts', accountsRoutes);
app.use('/api/v1/transactions', transactionsRoutes);
app.use('/api/v1/upi', upiRoutes);
app.use('/api/v1/cards', cardsRoutes);
app.use('/api/v1/compliance', complianceRoutes);
app.use('/api/v1/emergency', emergencyRoutes);
app.use('/api/v1/vaults', vaultsRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectMongoDB();
  app.listen(PORT, () => {
    console.log(`VaultPay API server running on port ${PORT}`);
  });
};

startServer().catch(console.error);

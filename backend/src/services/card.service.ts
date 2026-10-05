import { prisma } from '../lib/prisma.js';
import crypto from 'crypto';

export class CardService {
  static async issueVirtualCard(accountId: string, userId: string) {
    const cardNumber = '4' + Math.floor(Math.random() * 1e15).toString().padStart(15, '0');
    const cvv = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 3);

    return prisma.card.create({
      data: {
        accountId,
        userId,
        cardNumber,
        cardNumberHash: crypto.createHash('sha256').update(cardNumber).digest('hex'),
        last4: cardNumber.slice(-4),
        cvvHash: crypto.createHash('sha256').update(cvv).digest('hex'),
        expiryMonth: expiry.getMonth() + 1,
        expiryYear: expiry.getFullYear(),
        status: 'ACTIVE',
        cardType: 'VIRTUAL'
      }
    });
  }
}

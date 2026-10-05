import { generateUpiUri } from '../utils/upi-uri.js';
import { prisma } from '../lib/prisma.js';
import { PspSimulatorService } from './psp-simulator.service.js';

export class UpiService {
  static async generateIntentOrQr(vpa: string, amount: number, note: string) {
    const userVpa = await prisma.userVpa.findUniqueOrThrow({ where: { vpa } });
    
    const txnRef = `TXN${Date.now()}`;
    const uri = generateUpiUri({ vpa, name: userVpa.userId, amount, txnRef, note });
    
    return { uri, txnRef };
  }

  static async initiateCollect(requesterUserId: string, targetVpa: string, amount: number) {
    // Target is the person being asked for money
    const targetUserVpa = await prisma.userVpa.findUnique({
      where: { vpa: targetVpa },
      include: { user: { include: { accounts: true } } }
    });

    if (!targetUserVpa || targetUserVpa.user.accounts.length === 0) {
      throw new Error('Target VPA not found or has no active accounts');
    }

    const requesterUser = await prisma.user.findUnique({
      where: { id: requesterUserId },
      include: { accounts: true }
    });

    if (!requesterUser || requesterUser.accounts.length === 0) {
      throw new Error('Requester account not found');
    }

    const senderAccId = targetUserVpa.user.accounts[0].id;
    const receiverAccId = requesterUser.accounts[0].id;

    const transaction = await prisma.transaction.create({
      data: {
        referenceId: `COL${Date.now()}`,
        senderAccId,
        receiverAccId,
        amount,
        status: 'PENDING',
        type: 'UPI_COLLECT',
        channel: 'UPI',
        metadata: JSON.stringify({ vpa: targetVpa }),
        description: `Collect Request to ${targetVpa}`
      }
    });
    
    return transaction;
  }
}

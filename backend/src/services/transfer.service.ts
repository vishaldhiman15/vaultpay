import { prisma } from '../lib/prisma.js';
import { LedgerService } from './ledger.service.js';

export class TransferService {
  static async initiateInternalTransfer(fromAccountId: string, toAccountId: string, amount: number, description: string) {
    const transaction = await prisma.transaction.create({
      data: {
        senderAccId: fromAccountId,
        receiverAccId: toAccountId,
        amount,
        status: 'PENDING',
        type: 'INTERNAL',
        channel: 'INTERNAL',
        referenceId: `TRF${Date.now()}`,
        description,
      }
    });

    try {
      await LedgerService.recordTransfer(transaction.id, fromAccountId, toAccountId, amount, description);
      return prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: 'COMPLETED' }
      });
    } catch (error) {
      return prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: 'FAILED' }
      });
    }
  }
}

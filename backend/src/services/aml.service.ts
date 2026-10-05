import { prisma } from '../lib/prisma.js';

export class AmlService {
  static async monitorTransaction(transactionId: string) {
    const transaction = await prisma.transaction.findUnique({ where: { id: transactionId } });
    if (!transaction) return;

    if (transaction.amount > 100000) {
      console.warn(`AML ALERT: Large transaction detected! TxnID: ${transactionId}, Amount: ${transaction.amount}`);
      // In a real app, this would flag the transaction for manual review, freeze accounts, etc.
    }
  }
}

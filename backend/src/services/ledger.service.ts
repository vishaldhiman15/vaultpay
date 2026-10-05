import { prisma } from '../lib/prisma.js';

export class LedgerService {
  static async recordTransfer(transactionId: string, fromAccountId: string, toAccountId: string, amount: number, description: string) {
    const sortedAccountIds = [fromAccountId, toAccountId].sort();
    
    return prisma.$transaction(async (tx) => {
      // Fetch accounts to check balances
      const fromAccount = await tx.account.findUniqueOrThrow({ where: { id: fromAccountId } });
      const toAccount = await tx.account.findUniqueOrThrow({ where: { id: toAccountId } });
      
      if (fromAccount.currentBalance < amount) {
        throw new Error('Insufficient balance');
      }

      // Create Journal Entry
      const journalEntry = await tx.journalEntry.create({
        data: {
          transactionId,
          referenceType: 'INTERNAL',
          description,
          postings: {
            create: [
              { accountId: fromAccountId, direction: 'DEBIT', amount, sequenceNum: 1 },
              { accountId: toAccountId, direction: 'CREDIT', amount, sequenceNum: 2 }
            ]
          }
        }
      });

      // Update Balances
      await tx.account.update({
        where: { id: fromAccountId },
        data: { 
          currentBalance: { decrement: amount },
          availBalance: { decrement: amount }
        }
      });

      await tx.account.update({
        where: { id: toAccountId },
        data: { 
          currentBalance: { increment: amount },
          availBalance: { increment: amount }
        }
      });

      return journalEntry;
    });
  }
}

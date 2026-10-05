import { prisma } from '../lib/prisma.js';

export class RecoveryService {
  static async freezeAccount(accountId: string) {
    return prisma.account.update({
      where: { id: accountId },
      data: { status: 'FROZEN' }
    });
  }

  static async initiateRecovery(userId: string) {
    // Generate recovery codes, disable current methods, etc.
    return prisma.recoveryProfile.create({
      data: {
        userId,
        aliasUrl: 'recovery-' + Date.now(),
        hashedPin: 'dummy',
        isActive: true
      }
    });
  }
}

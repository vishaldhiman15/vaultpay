import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const vishalVpa = await prisma.userVpa.findUnique({
    where: { vpa: 'vishal@vaultpay' },
    include: { user: true }
  });

  const vishalUserId = vishalVpa ? vishalVpa.userId : null;

  let whereClause = {};
  if (vishalUserId) {
    whereClause = {
      userId: {
        not: vishalUserId
      }
    };
    console.log(`Preserving balances for user: ${vishalVpa?.user.firstName} ${vishalVpa?.user.lastName} (${vishalUserId})`);
  } else {
    console.log('Vishal user not found, resetting all accounts.');
  }

  const result = await prisma.account.updateMany({
    where: whereClause,
    data: {
      currentBalance: 0,
      availBalance: 0
    }
  });

  console.log(`Successfully reset balances to 0 for ${result.count} accounts.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

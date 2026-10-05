import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { email: true, firstName: true, vpas: true }
  });
  console.log('Users in DB:');
  console.log(JSON.stringify(users, null, 2));

  const recentLogs = await prisma.auditLog.findMany({
    orderBy: { timestamp: 'desc' },
    take: 5
  });
  console.log('Recent Audit Logs:');
  console.log(JSON.stringify(recentLogs, null, 2));
}

main().finally(() => prisma.$disconnect());

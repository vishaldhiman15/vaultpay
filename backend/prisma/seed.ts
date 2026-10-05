import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding VaultPay database...\n");

  // ─── Demo User 1: Rahul Sharma ───────────────────────────────────────────
  const user1 = await prisma.user.upsert({
    where: { email: "rahul@vaultpay.in" },
    update: {},
    create: {
      email: "rahul@vaultpay.in",
      phone: "+919876543210",
      // Password: "demo1234" (bcrypt hash)
      passwordHash: "$2a$12$LJ3m5R6FH8Mq4L5dVKjXYOqz9F6k3nG8pJ7R2sT4wX1cZ5bA0eD6i",
      firstName: "Rahul",
      lastName: "Sharma",
      role: "CUSTOMER",
      kycStatus: "VERIFIED",
      kycDocumentType: "AADHAAR",
      kycDocumentId: "XXXX-XXXX-4321",
      kycVerifiedAt: new Date("2025-06-15T10:30:00Z"),
    },
  });

  // Create VPAs for User 1
  await prisma.userVpa.upsert({
    where: { vpa: "rahul@vaultpay" },
    update: {},
    create: { userId: user1.id, vpa: "rahul@vaultpay" },
  });

  // Create Accounts for User 1
  const checkingAcc1 = await prisma.account.upsert({
    where: { accountNumber: "4019001000000001" },
    update: {},
    create: {
      userId: user1.id,
      accountNumber: "4019001000000001",
      accountType: "CHECKING",
      currency: "INR",
      currentBalance: 150000.0,
      availBalance: 150000.0,
      status: "ACTIVE",
    },
  });

  const savingsAcc1 = await prisma.account.upsert({
    where: { accountNumber: "4019002000000001" },
    update: {},
    create: {
      userId: user1.id,
      accountNumber: "4019002000000001",
      accountType: "SAVINGS",
      currency: "INR",
      currentBalance: 500000.0,
      availBalance: 500000.0,
      status: "ACTIVE",
    },
  });

  const emergencyAcc1 = await prisma.account.upsert({
    where: { accountNumber: "4019003000000001" },
    update: {},
    create: {
      userId: user1.id,
      accountNumber: "4019003000000001",
      accountType: "EMERGENCY_RESERVE",
      currency: "INR",
      currentBalance: 25000.0,
      availBalance: 25000.0,
      status: "ACTIVE",
    },
  });

  // ─── Demo User 2: Priya Patel ────────────────────────────────────────────
  const user2 = await prisma.user.upsert({
    where: { email: "priya@vaultpay.in" },
    update: {},
    create: {
      email: "priya@vaultpay.in",
      phone: "+919876543211",
      passwordHash: "$2a$12$LJ3m5R6FH8Mq4L5dVKjXYOqz9F6k3nG8pJ7R2sT4wX1cZ5bA0eD6i",
      firstName: "Priya",
      lastName: "Patel",
      role: "CUSTOMER",
      kycStatus: "VERIFIED",
      kycDocumentType: "PAN",
      kycDocumentId: "ABCDE1234F",
      kycVerifiedAt: new Date("2025-07-20T14:00:00Z"),
    },
  });

  await prisma.userVpa.upsert({
    where: { vpa: "priya@vaultpay" },
    update: {},
    create: { userId: user2.id, vpa: "priya@vaultpay" },
  });

  const checkingAcc2 = await prisma.account.upsert({
    where: { accountNumber: "4019001000000002" },
    update: {},
    create: {
      userId: user2.id,
      accountNumber: "4019001000000002",
      accountType: "CHECKING",
      currency: "INR",
      currentBalance: 75000.0,
      availBalance: 75000.0,
      status: "ACTIVE",
    },
  });

  // ─── Demo User 3: Admin ──────────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: "admin@vaultpay.in" },
    update: {},
    create: {
      email: "admin@vaultpay.in",
      phone: "+919876543200",
      passwordHash: "$2a$12$LJ3m5R6FH8Mq4L5dVKjXYOqz9F6k3nG8pJ7R2sT4wX1cZ5bA0eD6i",
      firstName: "Admin",
      lastName: "VaultPay",
      role: "ADMIN",
      kycStatus: "VERIFIED",
      kycDocumentType: "PAN",
      kycDocumentId: "ADMIN12345",
      kycVerifiedAt: new Date("2025-01-01T00:00:00Z"),
    },
  });

  // ─── Sample Transactions ─────────────────────────────────────────────────
  // Create some sample transactions for dashboard display
  const txnTypes = ["P2P", "UPI_INTENT", "NEFT", "IMPS", "UPI_QR"];
  const descriptions = [
    "Rent Payment - Aug 2026",
    "Dinner at Taj Hotel",
    "Electricity Bill",
    "Salary Credit",
    "Online Shopping - Amazon",
    "Uber Ride",
    "Grocery - BigBasket",
    "Movie Tickets - PVR",
  ];

  for (let i = 0; i < 8; i++) {
    const isSender = i % 2 === 0;
    const amount = Math.floor(Math.random() * 15000) + 500;
    const txnType = txnTypes[i % txnTypes.length];
    const daysAgo = i * 2;

    const txn = await prisma.transaction.create({
      data: {
        referenceId: `VPY-SEED-${String(i + 1).padStart(4, "0")}`,
        senderAccId: isSender ? checkingAcc1.id : checkingAcc2.id,
        receiverAccId: isSender ? checkingAcc2.id : checkingAcc1.id,
        amount: amount,
        currency: "INR",
        type: txnType,
        channel: txnType.startsWith("UPI") ? "UPI" : txnType === "NEFT" ? "NEFT" : txnType === "IMPS" ? "IMPS" : "INTERNAL",
        status: "SUCCESS",
        description: descriptions[i],
        upiTxnId: txnType.startsWith("UPI") ? `NPCI${Date.now()}${i}` : null,
        bankRrn: `RRN${String(Date.now()).slice(-8)}${i}`,
        initiatedAt: new Date(Date.now() - daysAgo * 86400000),
        completedAt: new Date(Date.now() - daysAgo * 86400000 + 5000),
      },
    });

    // Create corresponding journal entries
    await prisma.journalEntry.create({
      data: {
        transactionId: txn.id,
        referenceType: txnType.startsWith("UPI") ? "UPI_PAYMENT" : txnType,
        description: descriptions[i],
        status: "POSTED",
        postedAt: txn.completedAt!,
        postings: {
          create: [
            {
              accountId: isSender ? checkingAcc1.id : checkingAcc2.id,
              amount: amount,
              direction: "DEBIT",
              sequenceNum: 1,
            },
            {
              accountId: isSender ? checkingAcc2.id : checkingAcc1.id,
              amount: amount,
              direction: "CREDIT",
              sequenceNum: 2,
            },
          ],
        },
      },
    });
  }

  console.log("✅ Seeding complete!\n");
  console.log("   Demo Credentials:");
  console.log("   ─────────────────────────────────────────");
  console.log(`   Customer 1: rahul@vaultpay.in / demo1234`);
  console.log(`   Customer 2: priya@vaultpay.in / demo1234`);
  console.log(`   Admin:      admin@vaultpay.in / demo1234`);
  console.log("   ─────────────────────────────────────────\n");
  console.log(`   Accounts created: 4`);
  console.log(`   Transactions seeded: 8`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';
import { MOCK_PERSONAS } from './mockData';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Starting cleanup...');

  const dummyEmails = MOCK_PERSONAS.map(p => p.email);
  
  // Find dummy users to get their IDs
  const dummyUsers = await prisma.user.findMany({
    where: { email: { in: dummyEmails } }
  });
  const dummyIds = dummyUsers.map(u => u.id);

  if (dummyIds.length === 0) {
    console.log('No dummy profiles found to clean.');
    return;
  }

  console.log(`Removing data for ${dummyIds.length} dummy users...`);
  
  await prisma.$transaction([
    prisma.activityLog.deleteMany({ where: { client: { userId: { in: dummyIds } } } }),
    prisma.assessment.deleteMany({ where: { client: { userId: { in: dummyIds } } } }),
    prisma.alert.deleteMany({ where: { client: { userId: { in: dummyIds } } } }),
    prisma.clientInvitation.deleteMany({ where: { email: { in: dummyEmails } } }),
    prisma.client.deleteMany({ where: { userId: { in: dummyIds } } }),
    prisma.user.deleteMany({ where: { id: { in: dummyIds } } }),
  ]);

  console.log('✅ Cleanup complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

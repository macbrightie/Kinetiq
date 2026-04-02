import { PrismaClient, Role, RiskLevel } from '@prisma/client';
import { MOCK_PERSONAS } from './mockData';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Identify the Coach (the user logging in)
  // We'll find the first coach in the DB, or create one if none exists.
  let coach = await prisma.coach.findFirst({
    include: { user: true }
  });

  if (!coach) {
      console.log('No coach found, creating a default coach profile...');
      const coachUser = await prisma.user.upsert({
          where: { email: 'coach@kinetiq.app' },
          update: {},
          create: {
              email: 'coach@kinetiq.app',
              name: 'Demo Coach',
              role: Role.COACH,
              image: 'https://ui-avatars.com/api/?name=Demo+Coach',
          }
      });
      coach = await prisma.coach.create({
          data: {
              userId: coachUser.id,
              specialization: 'High Performance',
          },
          include: { user: true }
      });
  }

  console.log(`Linking 20 clients to coach: ${coach.user.name} (${coach.id})`);

  // 2. Clean up existing dummy data for this coach to allow re-seeding
  const dummyEmails = MOCK_PERSONAS.map(p => p.email);
  const existingDummyUsers = await prisma.user.findMany({
    where: { email: { in: dummyEmails } }
  });
  const existingDummyUserIds = existingDummyUsers.map(u => u.id);

  console.log(`Cleaning up ${existingDummyUserIds.length} existing dummy users...`);
  await prisma.$transaction([
    prisma.activityLog.deleteMany({ where: { client: { userId: { in: existingDummyUserIds } } } }),
    prisma.assessment.deleteMany({ where: { client: { userId: { in: existingDummyUserIds } } } }),
    prisma.alert.deleteMany({ where: { client: { userId: { in: existingDummyUserIds } } } }),
    prisma.clientInvitation.deleteMany({ where: { email: { in: dummyEmails } } }),
    prisma.client.deleteMany({ where: { userId: { in: existingDummyUserIds } } }),
    prisma.user.deleteMany({ where: { id: { in: existingDummyUserIds } } }),
  ]);

  // 3. Seed Realistic Personas
  for (const persona of MOCK_PERSONAS) {
    console.log(`Seeding: ${persona.name}...`);
    
    // Create User
    const user = await prisma.user.create({
      data: {
        email: persona.email,
        name: persona.name,
        image: persona.image,
        role: Role.CLIENT,
      }
    });

    // Create Client profile
    const client = await prisma.client.create({
      data: {
        userId: user.id,
        coachId: coach.id,
        healthScore: persona.score,
        riskStatus: persona.status,
        igHandle: `${persona.name.toLowerCase().replace(/\s/g, '_')}`,
        connectedChannels: ['strava', 'apple-health'],
        origin: persona.origin,
        topActivities: persona.topActivities as any,
      }
    });

    // 4. Generate Activity History (Last 30 days)
    const now = new Date();
    const logs = [];
    
    // Workout frequency logic
    const workoutChance = persona.status === RiskLevel.HEALTHY ? 0.7 : persona.status === RiskLevel.WARNING ? 0.35 : 0.1;
    const activities = persona.topActivities.length > 0 ? persona.topActivities : [{ name: 'WORKOUT' }];
    
    for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        
        if (Math.random() < workoutChance) {
            const act = activities[Math.floor(Math.random() * activities.length)];
            logs.push({
                clientId: client.id,
                type: act.name.toUpperCase(),
                completed: true,
                timestamp: date,
            });
        }
    }
    await prisma.activityLog.createMany({ data: logs });

    // 5. Generate Weekly Assessments
    const assessments = [];
    for (let i = 0; i < 4; i++) {
        const date = new Date();
        date.setDate(now.getDate() - (i * 7));
        
        assessments.push({
            clientId: client.id,
            weight: 75 + (Math.random() * 5),
            mood: persona.status === RiskLevel.HEALTHY ? 5 : (persona.status === RiskLevel.WARNING ? 3 : 1),
            notes: i === 0 ? persona.story : `Weekly check-in week ${i + 1}`,
            timestamp: date,
        });
    }
    await prisma.assessment.createMany({ data: assessments });

    // 6. Create relevant alerts for risk statuses
    if (persona.status !== RiskLevel.HEALTHY) {
        await prisma.alert.create({
            data: {
                clientId: client.id,
                type: persona.status === RiskLevel.AT_RISK ? 'INACTIVITY' : 'PERFORMANCE_DROP',
                message: persona.status === RiskLevel.AT_RISK ? `${persona.name} has missed 3 consecutive check-ins.` : `Slight drop in ${persona.name}'s recovery scores.`,
                severity: persona.status,
                resolved: false,
                createdAt: now,
            }
        });
    }
  }

  console.log('✅ Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

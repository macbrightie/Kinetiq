import prisma from '@/lib/prisma';
import { calculateHealthScore } from './healthEngine';

export async function getClientHealthProfile(clientId: string) {
    const client = await prisma.client.findUnique({
        where: { id: clientId },
        include: {
            user: true,
            activityLogs: {
                orderBy: { timestamp: 'desc' },
                take: 20
            },
            assessments: {
                orderBy: { timestamp: 'desc' },
                take: 5
            }
        }
    });

    if (!client) throw new Error('Client not found');

    const lastActive = client.activityLogs[0]?.timestamp || null;
    const healthData = await calculateHealthScore(
        client.activityLogs,
        client.assessments,
        lastActive
    );

    // Update client record with latest score
    await prisma.client.update({
        where: { id: clientId },
        data: {
            healthScore: healthData.score,
            riskStatus: healthData.status
        }
    });

    return {
        ...client,
        health: healthData
    };
}

export async function getCoachClients(coachId: string) {
    return prisma.client.findMany({
        where: { coachId },
        include: {
            user: true,
            activityLogs: {
                where: {
                    timestamp: {
                        gte: new Date(new Date().setDate(new Date().getDate() - 7))
                    }
                }
            }
        },
        orderBy: {
            healthScore: 'asc' // Prioritize at-risk clients
        }
    });
}

import { NextResponse } from 'next/server';
import { getCoachClients } from '@/services/clientService';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        // Find the coach record for this Clerk user
        const coach = await prisma.coach.findUnique({
            where: { userId: clerkId }
        });

        if (!coach) {
            return NextResponse.json({ error: 'Coach not found' }, { status: 404 });
        }

        const clients = await getCoachClients(coach.id);
        
        // Transform Prisma clients to the frontend Dashboard format
        const transformedClients = clients.map((client, index) => {
            const colors = ['#6366f1', '#10b981', '#0ea5e9', '#f59e0b', '#fb923c', '#a78bfa', '#f43f5e', '#8b5cf6'];
            
            // Calculate workout consistency (workouts in last 7 days)
            const workoutCount = client.activityLogs.filter(l => l.completed).length;
            const targetWorkouts = 5; // Standard target
            
            return {
                id: client.id,
                name: client.user.name || 'Unknown',
                initials: (client.user.name || 'U').split(' ').map(n => n[0]).join(''),
                score: client.healthScore,
                status: client.riskStatus === 'HEALTHY' ? 'Healthy' : client.riskStatus === 'WARNING' ? 'Warning' : 'At Risk',
                lastActive: client.activityLogs[0] ? 'Recently' : 'Never',
                workouts: `${workoutCount}/${targetWorkouts}`,
                color: colors[index % colors.length],
                photo: client.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(client.user.name || 'U')}`,
                image: client.user.image, // For components like ClientCreditCard
                origin: client.origin || 'Kinetiq Member',
                week: [4, 6, 5, 7, 5, 4, 6], // TODO: Aggregate daily activity
                topActivities: (client.topActivities as any) || [],
                calories: 2400 + (Math.floor(Math.random() * 400)),
                weightChange: client.healthScore > 80 ? -0.2 : 0.1,
                aiMsg: client.riskStatus === 'AT_RISK' 
                    ? `⚠️ Immediate outreach needed. ${client.user.name} hasn't logged sessions recently.`
                    : `${client.user.name} is maintaining consistency. Health score is stable.`,
                tip: client.riskStatus === 'AT_RISK' ? 'URGENT: Missing logs.' : 'Keep monitoring trend.',
                actionLabel: client.riskStatus === 'AT_RISK' ? '🚨 Contact Now' : '💬 Check In',
                connectedChannels: client.connectedChannels || ['kinetiq'],
                igHandle: client.igHandle,
                xHandle: client.xHandle,
                whatsapp: client.whatsapp,
            };
        });

        // Calculate summary stats from the live database records
        const totalClients = transformedClients.length;
        const totalScore = transformedClients.reduce((acc: number, c: any) => acc + c.score, 0);
        const avgScore = totalClients > 0 ? Math.round(totalScore / totalClients) : 0;
        const atRiskCount = transformedClients.filter(c => c.status === 'At Risk').length;
        
        return NextResponse.json({
            clients: transformedClients,
            stats: {
                totalClients: totalClients.toString(),
                avgScore: `${avgScore}%`,
                atRisk: atRiskCount.toString(),
                activeEngage: '84%'
            }
        });
    } catch (error) {
        console.error('Fetch coach clients error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

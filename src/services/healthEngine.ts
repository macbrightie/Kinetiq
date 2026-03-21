import { RiskLevel } from '@prisma/client';

export interface HealthScoreResult {
    score: number;
    status: RiskLevel;
    factors: {
        label: string;
        impact: number; // positive or negative
        description: string;
    }[];
}

/**
 * Kinetiq Health Scoring Engine (Rule-based MVP)
 * 
 * Rules:
 * 1. Base Score: 100
 * 2. Inactivity Penalty: -10 per day of inactivity after 3 days
 * 3. Missed Workout: -15 per missed workout in the last 7 days
 * 4. Weight Plateau/Drop: -5 if no assessment in 14 days
 * 5. Assessment Mood: -10 if mood is < 3
 */
export async function calculateHealthScore(
    activityLogs: { completed: boolean; timestamp: Date }[],
    assessments: { weight: number | null; mood: number | null; timestamp: Date }[],
    lastActive: Date | null
): Promise<HealthScoreResult> {
    let score = 100;
    const factors: HealthScoreResult['factors'] = [];
    const now = new Date();

    // 1. Inactivity Check
    if (lastActive) {
        const daysInactive = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
        if (daysInactive > 3) {
            const penalty = Math.min(daysInactive * 5, 40);
            score -= penalty;
            factors.push({
                label: 'Inactivity',
                impact: -penalty,
                description: `${daysInactive} days since last activity recorded.`
            });
        }
    } else {
        score -= 20;
        factors.push({ label: 'No Activity', impact: -20, description: 'No activity logs found for this client.' });
    }

    // 2. Workout Adherence (Last 7 days)
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentLogs = activityLogs.filter(log => log.timestamp >= last7Days);
    const missedWorkouts = recentLogs.filter(log => !log.completed).length;

    if (missedWorkouts > 0) {
        const penalty = Math.min(missedWorkouts * 10, 30);
        score -= penalty;
        factors.push({
            label: 'Missed Workouts',
            impact: -penalty,
            description: `${missedWorkouts} workouts missed in the last 7 days.`
        });
    }

    // 3. Assessment Consistency
    const lastAssessment = assessments[0]; // Assuming sorted by date desc
    if (!lastAssessment || (now.getTime() - lastAssessment.timestamp.getTime()) > 14 * 24 * 60 * 60 * 1000) {
        score -= 10;
        factors.push({
            label: 'Stale Data',
            impact: -10,
            description: 'No assessments or check-ins in over 2 weeks.'
        });
    }

    // 4. Mood Check
    if (lastAssessment && lastAssessment.mood !== null && lastAssessment.mood < 3) {
        score -= 15;
        factors.push({
            label: 'Low Mood',
            impact: -15,
            description: 'The client reported a low mood in their last check-in.'
        });
    }

    // Final normalization
    score = Math.max(0, Math.min(100, score));

    // Determine status
    let status: RiskLevel = 'HEALTHY';
    if (score < 40) status = 'AT_RISK';
    else if (score < 75) status = 'WARNING';

    return { score, status, factors };
}

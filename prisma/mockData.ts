import { RiskLevel } from '@prisma/client';

export interface MockPersona {
    name: string;
    email: string;
    image: string;
    status: RiskLevel;
    score: number;
    specialization: string;
    story: string;
    workouts: string;
    origin: string;
    topActivities: { name: string; icon: string; pct: number; color: string; }[];
}

export const MOCK_PERSONAS: MockPersona[] = [
    {
        name: "Ayo Balogun",
        email: "ayo.balogun@example.com",
        image: "/ayo-balogun.png",
        status: RiskLevel.HEALTHY,
        score: 94,
        specialization: "Sprinting",
        story: "Elite national sprinter. Highly consistent, follows plan 100%.",
        workouts: "6/6",
        origin: "Lagos, Nigeria",
        topActivities: [
            { name: "Running", icon: "🏃", pct: 95, color: "#0ea5e9" },
            { name: "Strength", icon: "💪", pct: 85, color: "#f59e0b" },
        ]
    },
    {
        name: "Brenda Diogo",
        email: "brenda.diogo@example.com",
        image: "/Brenda-Diogo.png",
        status: RiskLevel.HEALTHY,
        score: 88,
        specialization: "Crossfit",
        story: "Crossfit enthusiast. Strong performance but sleep quality varies.",
        workouts: "5/5",
        origin: "Lisbon, Portugal",
        topActivities: [
            { name: "Crossfit", icon: "🏋️", pct: 90, color: "#ef4444" },
            { name: "HIIT", icon: "💥", pct: 82, color: "#10b981" },
        ]
    },
    {
        name: "Chloe van dyke",
        email: "chloe.vandyke@example.com",
        image: "/Chloe-van-dyke.png",
        status: RiskLevel.WARNING,
        score: 62,
        specialization: "Triathlon",
        story: "Warning: Signs of overtraining. Heart rate variability is dropping.",
        workouts: "7/7",
        origin: "Amsterdam, Netherlands",
        topActivities: [
            { name: "Cycling", icon: "🚴", pct: 95, color: "#f97316" },
            { name: "Swimming", icon: "🏊", pct: 88, color: "#0ea5e9" },
        ]
    },
    {
        name: "Dammie bush",
        email: "dammie.bush@example.com",
        image: "/Dammie-bush.png",
        status: RiskLevel.HEALTHY,
        score: 81,
        specialization: "Bodyweight",
        story: "Steady progress in calisthenics. Improving mobility.",
        workouts: "4/5",
        origin: "London, UK",
        topActivities: [
            { name: "Calisthenics", icon: "🤸", pct: 85, color: "#a78bfa" },
            { name: "Yoga", icon: "🧘", pct: 60, color: "#10b981" },
        ]
    },
    {
        name: "Elena Rodriguez",
        email: "elena.rodriguez@example.com",
        image: "/elena-rodriguez.png",
        status: RiskLevel.HEALTHY,
        score: 90,
        specialization: "Marathon",
        story: "Marathon runner. Exceptional endurance but needs to watch iron levels.",
        workouts: "5/5",
        origin: "Madrid, Spain",
        topActivities: [
            { name: "Running", icon: "🏃", pct: 98, color: "#0ea5e9" },
            { name: "Pilates", icon: "🤸", pct: 40, color: "#f43f5e" },
        ]
    },
    {
        name: "Elena Mensah",
        email: "elena.mensah@example.com",
        image: "/Elena-mensah.png",
        status: RiskLevel.AT_RISK,
        score: 34,
        specialization: "General Fitness",
        story: "At Risk: Hasn't logged a workout in 5 days. Low motivation reported.",
        workouts: "1/5",
        origin: "Accra, Ghana",
        topActivities: [
            { name: "Walking", icon: "🚶", pct: 30, color: "#6366f1" },
            { name: "HIIT", icon: "💥", pct: 20, color: "#10b981" },
        ]
    },
    {
        name: "Ene Bishop",
        email: "ene.bishop@example.com",
        image: "/Ene-Bishop.png",
        status: RiskLevel.HEALTHY,
        score: 78,
        specialization: "Strength",
        story: "Powerlifting focus. Consistent but nutrition needs a tweak.",
        workouts: "4/4",
        origin: "Atlanta, USA",
        topActivities: [
            { name: "Powerlifting", icon: "🏋️", pct: 95, color: "#8b5cf6" },
            { name: "Strength", icon: "💪", pct: 88, color: "#f59e0b" },
        ]
    },
    {
        name: "Faith Emma",
        email: "faith.emma@example.com",
        image: "/Faith-emma.png",
        status: RiskLevel.WARNING,
        score: 55,
        specialization: "HIIT",
        story: "Warning: High intensity workouts with poor recovery scores.",
        workouts: "3/5",
        origin: "Cape Town, SA",
        topActivities: [
            { name: "HIIT", icon: "💥", pct: 90, color: "#ef4444" },
            { name: "Boxing", icon: "🥊", pct: 50, color: "#f59e0b" },
        ]
    },
    {
        name: "John Valette",
        email: "john.valette@example.com",
        image: "/John-valette.png",
        status: RiskLevel.HEALTHY,
        score: 85,
        specialization: "Cycling",
        story: "Road cyclist. Solid foundation, prep for upcoming race.",
        workouts: "5/6",
        origin: "Paris, France",
        topActivities: [
            { name: "Cycling", icon: "🚴", pct: 92, color: "#f97316" },
            { name: "Swimming", icon: "🏊", pct: 60, color: "#0ea5e9" },
        ]
    },
    {
        name: "Kofi Mensah",
        email: "kofi.mensah@example.com",
        image: "/kofi-mensah.png",
        status: RiskLevel.WARNING,
        score: 68,
        specialization: "Rugby",
        story: "Post-match recovery is slow. Monitoring knee soreness.",
        workouts: "3/5",
        origin: "Kumasi, Ghana",
        topActivities: [
            { name: "Running", icon: "🏃", pct: 75, color: "#0ea5e9" },
            { name: "Strength", icon: "💪", pct: 80, color: "#f59e0b" },
        ]
    },
    {
        name: "Maccing Diallo",
        email: "maccing.diallo@example.com",
        image: "/Maccing-diallo.png",
        status: RiskLevel.HEALTHY,
        score: 100,
        specialization: "Swimming",
        story: "Consistent swimmer. Energy levels are exceptional.",
        workouts: "6/6",
        origin: "Dakar, Senegal",
        topActivities: [
            { name: "Swimming", icon: "🏊", pct: 100, color: "#0ea5e9" },
            { name: "Yoga", icon: "🧘", pct: 50, color: "#10b981" },
        ]
    },
    {
        name: "Marcus Johnson",
        email: "marcus.johnson@example.com",
        image: "/Marcus-johnson.png",
        status: RiskLevel.HEALTHY,
        score: 84,
        specialization: "Boxing",
        story: "Boxing conditioning. Improving speed and reaction time.",
        workouts: "5/5",
        origin: "Chicago, USA",
        topActivities: [
            { name: "Boxing", icon: "🥊", pct: 90, color: "#ef4444" },
            { name: "HIIT", icon: "💥", pct: 70, color: "#10b981" },
        ]
    },
    {
        name: "Michelle Stone",
        email: "michelle.stone@example.com",
        image: "/Michelle-Stone.png",
        status: RiskLevel.HEALTHY,
        score: 89,
        specialization: "Yoga",
        story: "Yoga and Pilates focus. Excellent mindfulness scores.",
        workouts: "5/5",
        origin: "Sydney, Australia",
        topActivities: [
            { name: "Yoga", icon: "🧘", pct: 95, color: "#10b981" },
            { name: "Pilates", icon: "🤸", pct: 85, color: "#f43f5e" },
        ]
    },
    {
        name: "Mikhail Milov",
        email: "mikhail.milov@example.com",
        image: "/Mikhail-Milov.png",
        status: RiskLevel.AT_RISK,
        score: 28,
        specialization: "Weight Loss",
        story: "At Risk: Weight plateau and high stress logs.",
        workouts: "0/5",
        origin: "Moscow, Russia",
        topActivities: [
            { name: "Walking", icon: "🚶", pct: 30, color: "#6366f1" },
            { name: "Swimming", icon: "🏊", pct: 10, color: "#0ea5e9" },
        ]
    },
    {
        name: "Nia Asante",
        email: "nia.asante@example.com",
        image: "/Nia-asante.png",
        status: RiskLevel.HEALTHY,
        score: 95,
        specialization: "Gymnastics",
        story: "Top performer. Exceptional mobility and core strength.",
        workouts: "6/6",
        origin: "Kumasi, Ghana",
        topActivities: [
            { name: "Calisthenics", icon: "🤸", pct: 98, color: "#a78bfa" },
            { name: "Dance", icon: "💃", pct: 70, color: "#f43f5e" },
        ]
    },
    {
        name: "Sarah Chen",
        email: "sarah.chen@example.com",
        image: "/Sarah-chen.png",
        status: RiskLevel.HEALTHY,
        score: 82,
        specialization: "Dancing",
        story: "Dance-based cardio. High engagement, loves the leaderboard.",
        workouts: "4/4",
        origin: "Shanghai, China",
        topActivities: [
            { name: "Dance", icon: "💃", pct: 92, color: "#f43f5e" },
            { name: "Yoga", icon: "🧘", pct: 50, color: "#10b981" },
        ]
    },
    {
        name: "Smith Gorge",
        email: "smith.gorge@example.com",
        image: "/Smith-Gorge.png",
        status: RiskLevel.WARNING,
        score: 65,
        specialization: "Hiking",
        story: "Warning: High volume of hiking but low hydration logs.",
        workouts: "2/4",
        origin: "Vancouver, Canada",
        topActivities: [
            { name: "Hiking", icon: "🥾", pct: 90, color: "#f97316" },
            { name: "Walking", icon: "🚶", pct: 70, color: "#6366f1" },
        ]
    },
    {
        name: "Sylvia Ferguson",
        email: "sylvia.ferguson@example.com",
        image: "/Sylvia-Ferguson.png",
        status: RiskLevel.HEALTHY,
        score: 86,
        specialization: "Tennis",
        story: "Tennis player. Consistent but needs more specific stretching.",
        workouts: "4/5",
        origin: "Melbourne, Australia",
        topActivities: [
            { name: "Tennis", icon: "🎾", pct: 90, color: "#10b981" },
            { name: "Running", icon: "🏃", pct: 65, color: "#0ea5e9" },
        ]
    },
    {
        name: "Zola Abara",
        email: "zola.abara@example.com",
        image: "/Zola-abara.png",
        status: RiskLevel.AT_RISK,
        score: 31,
        specialization: "Football",
        story: "At Risk: Recurring injury. Needs urgent physical therapy check.",
        workouts: "1/6",
        origin: "Nairobi, Kenya",
        topActivities: [
            { name: "Football", icon: "⚽", pct: 40, color: "#ef4444" },
            { name: "Walking", icon: "🚶", pct: 30, color: "#6366f1" },
        ]
    },
    {
        name: "David Alade",
        email: "david.alade@example.com",
        image: "/david-alade.png",
        status: RiskLevel.HEALTHY,
        score: 75,
        specialization: "Weightlifting",
        story: "New to weightlifting. Focused on form and basic strength.",
        workouts: "3/4",
        origin: "Lagos, Nigeria",
        topActivities: [
            { name: "Strength", icon: "💪", pct: 70, color: "#f59e0b" },
            { name: "Walking", icon: "🚶", pct: 50, color: "#6366f1" },
        ]
    },
];

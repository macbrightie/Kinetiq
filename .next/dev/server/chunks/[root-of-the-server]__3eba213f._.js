module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
const prismaClientSingleton = ()=>{
    return new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]();
};
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
const __TURBOPACK__default__export__ = prisma;
if ("TURBOPACK compile-time truthy", 1) globalThis.prismaGlobal = prisma;
}),
"[project]/src/services/healthEngine.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculateHealthScore",
    ()=>calculateHealthScore
]);
async function calculateHealthScore(activityLogs, assessments, lastActive) {
    let score = 100;
    const factors = [];
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
        factors.push({
            label: 'No Activity',
            impact: -20,
            description: 'No activity logs found for this client.'
        });
    }
    // 2. Workout Adherence (Last 7 days)
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentLogs = activityLogs.filter((log)=>log.timestamp >= last7Days);
    const missedWorkouts = recentLogs.filter((log)=>!log.completed).length;
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
    if (!lastAssessment || now.getTime() - lastAssessment.timestamp.getTime() > 14 * 24 * 60 * 60 * 1000) {
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
    let status = 'HEALTHY';
    if (score < 40) status = 'AT_RISK';
    else if (score < 75) status = 'WARNING';
    return {
        score,
        status,
        factors
    };
}
}),
"[project]/src/services/clientService.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getClientHealthProfile",
    ()=>getClientHealthProfile,
    "getCoachClients",
    ()=>getCoachClients
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$healthEngine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/healthEngine.ts [app-route] (ecmascript)");
;
;
async function getClientHealthProfile(clientId) {
    const client = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].client.findUnique({
        where: {
            id: clientId
        },
        include: {
            user: true,
            activityLogs: {
                orderBy: {
                    timestamp: 'desc'
                },
                take: 20
            },
            assessments: {
                orderBy: {
                    timestamp: 'desc'
                },
                take: 5
            }
        }
    });
    if (!client) throw new Error('Client not found');
    const lastActive = client.activityLogs[0]?.timestamp || null;
    const healthData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$healthEngine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["calculateHealthScore"])(client.activityLogs, client.assessments, lastActive);
    // Update client record with latest score
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].client.update({
        where: {
            id: clientId
        },
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
async function getCoachClients(coachId) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].client.findMany({
        where: {
            coachId
        },
        include: {
            user: true
        },
        orderBy: {
            healthScore: 'asc' // Prioritize at-risk clients
        }
    });
}
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/app/api/coach/clients/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$clientService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/clientService.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/nextjs/dist/esm/app-router/server/auth.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
;
;
;
;
const MOCK_CLIENTS = [
    {
        id: "mock-2",
        name: "Kofi Mensah",
        initials: "KM",
        score: 88,
        status: "Healthy",
        lastActive: "2h ago",
        workouts: "5/5",
        color: "#10b981",
        photo: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150&h=150&fit=crop",
        origin: "Accra, Ghana",
        week: [
            7,
            8,
            7,
            9,
            8,
            9,
            8
        ],
        topActivities: [
            {
                name: "Cycling",
                icon: "🚴",
                pct: 88,
                color: "#f97316"
            },
            {
                name: "HIIT",
                icon: "💥",
                pct: 80,
                color: "#10b981"
            },
            {
                name: "Running",
                icon: "🏃",
                pct: 75,
                color: "#0ea5e9"
            }
        ],
        calories: 2650,
        weightChange: -0.2,
        aiMsg: "Kofi is staying consistent but steps are slightly down from last week. A quick nudge might help.",
        tip: "Consistency is good. Focus on increasing daily step count.",
        actionLabel: "💬 Check In",
        connectedChannels: [
            "instagram",
            "x",
            "kinetiq"
        ]
    },
    {
        id: "mock-3",
        name: "Zola Abara",
        initials: "ZA",
        score: 34,
        status: "At Risk",
        lastActive: "4 days ago",
        workouts: "1/5",
        color: "#ef4444",
        photo: "https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=150&h=150&fit=crop",
        origin: "Nairobi, Kenya",
        week: [
            2,
            0,
            0,
            0,
            3,
            0,
            0
        ],
        topActivities: [
            {
                name: "Yoga",
                icon: "🧘",
                pct: 15,
                color: "#10b981"
            },
            {
                name: "—",
                icon: "💤",
                pct: 0,
                color: "#374151"
            },
            {
                name: "—",
                icon: "💤",
                pct: 0,
                color: "#374151"
            }
        ],
        calories: 1600,
        weightChange: 0.9,
        aiMsg: "⚠️ Zola has been inactive 4 days. Immediate outreach needed to prevent dropout.",
        tip: "URGENT: 4 days inactive. Contact today.",
        actionLabel: "🚨 Contact Now",
        connectedChannels: [
            "whatsapp",
            "kinetiq"
        ]
    },
    {
        id: "mock-4",
        name: "Maccing Diallo",
        initials: "MD",
        score: 79,
        status: "Warning",
        lastActive: "Yesterday",
        workouts: "3/5",
        color: "#f59e0b",
        photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
        origin: "Dakar, Senegal",
        week: [
            5,
            6,
            4,
            5,
            6,
            4,
            5
        ],
        topActivities: [
            {
                name: "Running",
                icon: "🏃",
                pct: 72,
                color: "#0ea5e9"
            },
            {
                name: "Strength",
                icon: "💪",
                pct: 65,
                color: "#f59e0b"
            }
        ],
        calories: 2300,
        weightChange: 0.1,
        aiMsg: "Maccing's form on leg days has improved. However, missed 2 sessions this week.",
        tip: "Send a mid-week check-in to stay on track.",
        actionLabel: "💬 Check In",
        connectedChannels: [
            "whatsapp",
            "kinetiq"
        ]
    },
    {
        id: "mock-5",
        name: "Chidi Eze",
        initials: "CE",
        score: 61,
        status: "Warning",
        lastActive: "2 days ago",
        workouts: "2/5",
        color: "#f59e0b",
        photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
        origin: "Enugu, Nigeria",
        week: [
            4,
            3,
            5,
            0,
            4,
            3,
            0
        ],
        topActivities: [
            {
                name: "Swimming",
                icon: "🏊",
                pct: 58,
                color: "#0ea5e9"
            },
            {
                name: "Walking",
                icon: "🚶",
                pct: 50,
                color: "#6366f1"
            }
        ],
        calories: 2100,
        weightChange: 0.3,
        aiMsg: "Sleep quality is a concern for Chidi. Recommend adding a wind-down routine.",
        tip: "Sleep quality consistently below 6 hours.",
        actionLabel: "💬 Check In",
        connectedChannels: [
            "kinetiq"
        ]
    },
    {
        id: "mock-6",
        name: "Nia Asante",
        initials: "NA",
        score: 95,
        status: "Healthy",
        lastActive: "30m ago",
        workouts: "5/5",
        color: "#10b981",
        photo: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop",
        origin: "Kumasi, Ghana",
        week: [
            9,
            10,
            9,
            10,
            10,
            9,
            10
        ],
        topActivities: [
            {
                name: "HIIT",
                icon: "💥",
                pct: 95,
                color: "#ef4444"
            },
            {
                name: "Yoga",
                icon: "🧘",
                pct: 90,
                color: "#a78bfa"
            }
        ],
        calories: 2900,
        weightChange: -0.6,
        aiMsg: "Nia is on an impressive streak. Consider adding a deload week to avoid burnout.",
        tip: "Outstanding performance. Schedule a progress review.",
        actionLabel: "⭐ Praise",
        connectedChannels: [
            "whatsapp",
            "instagram",
            "kinetiq"
        ]
    },
    {
        id: "mock-7",
        name: "Seun Balogun",
        initials: "SB",
        score: 73,
        status: "Warning",
        lastActive: "Yesterday",
        workouts: "3/5",
        color: "#f97316",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
        origin: "Ibadan, Nigeria",
        week: [
            6,
            5,
            7,
            5,
            6,
            4,
            5
        ],
        topActivities: [
            {
                name: "Football",
                icon: "⚽",
                pct: 78,
                color: "#f97316"
            },
            {
                name: "Running",
                icon: "🏃",
                pct: 65,
                color: "#0ea5e9"
            }
        ],
        calories: 2500,
        weightChange: -0.1,
        aiMsg: "Seun's agility training is strong. Recommend integrating plyometrics for sport-specific gains.",
        tip: "Great sport-specific base. Add power training.",
        actionLabel: "💬 Check In",
        connectedChannels: [
            "instagram",
            "kinetiq"
        ]
    },
    {
        id: "mock-8",
        name: "Fatou Diop",
        initials: "FD",
        score: 84,
        status: "Healthy",
        lastActive: "3h ago",
        workouts: "4/5",
        color: "#a78bfa",
        photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
        origin: "Thiès, Senegal",
        week: [
            8,
            8,
            7,
            9,
            8,
            9,
            7
        ],
        topActivities: [
            {
                name: "Dance",
                icon: "💃",
                pct: 88,
                color: "#a78bfa"
            },
            {
                name: "Running",
                icon: "🏃",
                pct: 75,
                color: "#0ea5e9"
            }
        ],
        calories: 2400,
        weightChange: -0.3,
        aiMsg: "Fatou's aerobic base is excellent. Her consistency with cardio is a strong foundation.",
        tip: "Add strength training to complement cardio.",
        actionLabel: "💬 Check In",
        connectedChannels: [
            "whatsapp",
            "kinetiq"
        ]
    },
    {
        id: "mock-9",
        name: "Kwame Osei",
        initials: "KO",
        score: 45,
        status: "At Risk",
        lastActive: "6 days ago",
        workouts: "1/5",
        color: "#ef4444",
        photo: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop",
        origin: "Tamale, Ghana",
        week: [
            0,
            0,
            1,
            0,
            0,
            0,
            2
        ],
        topActivities: [
            {
                name: "Walking",
                icon: "🚶",
                pct: 30,
                color: "#6366f1"
            },
            {
                name: "—",
                icon: "💤",
                pct: 0,
                color: "#374151"
            }
        ],
        calories: 1800,
        weightChange: 1.1,
        aiMsg: "⚠️ Kwame hasn't logged in nearly a week. Risk of dropout is high.",
        tip: "URGENT: 6 days inactive. Reach out immediately.",
        actionLabel: "🚨 Contact Now",
        connectedChannels: [
            "whatsapp",
            "kinetiq"
        ]
    },
    {
        id: "mock-10",
        name: "Temi Adeyemi",
        initials: "TA",
        score: 89,
        status: "Healthy",
        lastActive: "45m ago",
        workouts: "5/5",
        color: "#0ea5e9",
        photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop",
        origin: "Abuja, Nigeria",
        week: [
            9,
            8,
            10,
            9,
            9,
            8,
            10
        ],
        topActivities: [
            {
                name: "Pilates",
                icon: "🤸",
                pct: 90,
                color: "#0ea5e9"
            },
            {
                name: "Cycling",
                icon: "🚴",
                pct: 82,
                color: "#f97316"
            }
        ],
        calories: 2750,
        weightChange: -0.5,
        aiMsg: "Temi is performing excellently. Focus on monitoring recovery metrics between sessions.",
        tip: "Top performer. Consider featuring in client success stories.",
        actionLabel: "⭐ Praise",
        connectedChannels: [
            "instagram",
            "x",
            "kinetiq"
        ]
    }
];
async function GET() {
    try {
        const { userId: clerkId } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"])();
        if (!clerkId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        // Find the coach record for this Clerk user
        const coach = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].coach.findUnique({
            where: {
                userId: clerkId
            }
        });
        if (!coach) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Coach not found'
            }, {
                status: 404
            });
        }
        const clients = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$clientService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCoachClients"])(coach.id);
        // Transform Prisma clients to the frontend Dashboard format if needed
        const transformedClients = clients.map((client, index)=>{
            const colors = [
                '#6366f1',
                '#10b981',
                '#0ea5e9',
                '#f59e0b',
                '#fb923c',
                '#a78bfa',
                '#f43f5e',
                '#8b5cf6'
            ];
            return {
                id: client.id,
                name: client.user.name || 'Unknown',
                initials: (client.user.name || 'U').split(' ').map((n)=>n[0]).join(''),
                score: client.healthScore,
                status: client.riskStatus === 'HEALTHY' ? 'Healthy' : client.riskStatus === 'WARNING' ? 'Warning' : 'At Risk',
                lastActive: 'Just now',
                workouts: '0/5',
                color: colors[index % colors.length],
                photo: client.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(client.user.name || 'U')}`,
                origin: 'Member',
                week: [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                topActivities: [],
                calories: 0,
                weightChange: 0,
                aiMsg: `${client.user.name} is all set up and ready to go!`,
                tip: 'New client joined.',
                actionLabel: '💬 Check In',
                connectedChannels: client.connectedChannels
            };
        });
        // Calculate summary stats
        const totalClients = clients.length;
        const avgScore = totalClients > 0 ? Math.round(clients.reduce((acc, c)=>acc + c.healthScore, 0) / totalClients) : 0;
        const atRiskCount = clients.filter((c)=>c.riskStatus === 'AT_RISK').length;
        const finalClients = [
            ...transformedClients,
            ...MOCK_CLIENTS
        ];
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            clients: finalClients,
            stats: {
                totalClients: finalClients.length.toString(),
                avgScore: finalClients.length > 0 ? `${Math.round(finalClients.reduce((acc, c)=>acc + c.score, 0) / finalClients.length)}%` : "0%",
                atRisk: finalClients.filter((c)=>c.status === 'At Risk').length.toString(),
                activeEngage: '84%'
            }
        });
    } catch (error) {
        console.error('Fetch coach clients error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3eba213f._.js.map
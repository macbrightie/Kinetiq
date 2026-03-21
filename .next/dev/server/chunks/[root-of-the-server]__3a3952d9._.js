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
"[project]/src/lib/terra.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateTerraWidgetUrl",
    ()=>generateTerraWidgetUrl
]);
const generateTerraWidgetUrl = async (referenceId, providers)=>{
    const TERRA_API_KEY = process.env.TERRA_API_KEY;
    const TERRA_DEV_ID = process.env.TERRA_DEV_ID;
    if (!TERRA_API_KEY || !TERRA_DEV_ID) {
        console.error('Terra Error: TERRA_API_KEY or TERRA_DEV_ID is missing from environment variables');
        return undefined;
    }
    try {
        const response = await fetch('https://api.tryterra.co/v2/auth/generateWidgetSession', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'dev-id': TERRA_DEV_ID,
                'x-api-key': TERRA_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                reference_id: referenceId,
                providers: providers || 'APPLE,STRAVA',
                language: 'en',
                auth_success_redirect_url: `${("TURBOPACK compile-time value", "http://localhost:3000")}/dashboard`,
                auth_failure_redirect_url: `${("TURBOPACK compile-time value", "http://localhost:3000")}/onboarding?error=terra`
            })
        });
        const data = await response.json();
        return data.url;
    } catch (error) {
        console.error('Terra widget generation failed:', error);
        return null;
    }
};
}),
"[project]/src/app/api/terra/session/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$terra$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/terra.ts [app-route] (ecmascript)");
;
;
async function POST(request) {
    // Note: During onboarding, the client might not be logged in yet via Clerk
    // We can use a session token or invitation token for security.
    // For this flow, we'll allow referenceId to be passed.
    try {
        const { referenceId, providers } = await request.json();
        if (!referenceId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Reference ID is required'
            }, {
                status: 400
            });
        }
        // Map frontend provider names to Terra-specific names if needed
        let terraProviders = providers;
        if (providers === 'apple_health') terraProviders = 'APPLE';
        if (providers === 'strava') terraProviders = 'STRAVA';
        const url = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$terra$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateTerraWidgetUrl"])(referenceId, terraProviders);
        if (!url) {
            // Check if it's a configuration issue
            if (!process.env.TERRA_API_KEY || !process.env.TERRA_DEV_ID) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Terra is not configured. Please add TERRA_API_KEY and TERRA_DEV_ID to your .env file.'
                }, {
                    status: 403
                });
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Failed to generate Terra session'
            }, {
                status: 500
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            url
        });
    } catch (error) {
        console.error('Terra session error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3a3952d9._.js.map
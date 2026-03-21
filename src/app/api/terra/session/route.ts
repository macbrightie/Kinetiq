import { NextResponse } from 'next/server';
import { generateTerraWidgetUrl } from '@/lib/terra';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
    // Note: During onboarding, the client might not be logged in yet via Clerk
    // We can use a session token or invitation token for security.
    // For this flow, we'll allow referenceId to be passed.

    try {
        const { referenceId, providers } = await request.json();

        if (!referenceId) {
            return NextResponse.json({ error: 'Reference ID is required' }, { status: 400 });
        }

        // Map frontend provider names to Terra-specific names if needed
        let terraProviders = providers;
        if (providers === 'apple_health') terraProviders = 'APPLE';
        if (providers === 'strava') terraProviders = 'STRAVA';

        const url = await generateTerraWidgetUrl(referenceId, terraProviders);

        if (!url) {
            // Check if it's a configuration issue
            if (!process.env.TERRA_API_KEY || !process.env.TERRA_DEV_ID) {
                return NextResponse.json({ error: 'Terra is not configured. Please add TERRA_API_KEY and TERRA_DEV_ID to your .env file.' }, { status: 403 });
            }
            return NextResponse.json({ error: 'Failed to generate Terra session' }, { status: 500 });
        }

        return NextResponse.json({ url });
    } catch (error) {
        console.error('Terra session error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

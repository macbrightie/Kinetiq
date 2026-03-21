import { NextResponse } from 'next/server';
import { getStravaAuthUrl } from '@/lib/strava';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const referenceId = searchParams.get('referenceId');

    if (!referenceId) {
        return NextResponse.json({ error: 'Reference ID is required' }, { status: 400 });
    }

    if (!process.env.STRAVA_CLIENT_ID) {
        return NextResponse.json({ error: 'Strava is not configured. Please add STRAVA_CLIENT_ID to your .env file.' }, { status: 403 });
    }

    const authUrl = getStravaAuthUrl(referenceId);
    return NextResponse.redirect(authUrl);
}

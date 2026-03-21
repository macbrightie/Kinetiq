import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { exchangeStravaCode } from '@/lib/strava';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const token = searchParams.get('state'); // invitation token

    if (!code || !token) {
        return NextResponse.json({ error: 'Missing code or state' }, { status: 400 });
    }

    try {
        // 1. Exchange code for tokens
        const stravaResponse = await exchangeStravaCode(code);
        
        if (stravaResponse.errors) {
            console.error('Strava token exchange error:', stravaResponse.errors);
            return NextResponse.json({ error: 'Failed to connect with Strava' }, { status: 500 });
        }

        const { access_token, refresh_token, expires_at, athlete } = stravaResponse;

        // 2. Get invitation
        const invitation = await prisma.clientInvitation.findUnique({
            where: { token },
            include: { coach: true }
        });

        if (!invitation) {
            return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
        }

        // 3. Create or update user/client
        await prisma.$transaction(async (tx) => {
            let user = await tx.user.findUnique({ where: { email: invitation.email } });

            if (!user) {
                user = await tx.user.create({
                    data: {
                        email: invitation.email,
                        name: invitation.name,
                        role: 'CLIENT',
                    }
                });
            }

            const client = await tx.client.upsert({
                where: { userId: user.id },
                update: {
                    stravaUserId: athlete.id.toString(),
                    stravaAccessToken: access_token,
                    stravaRefreshToken: refresh_token,
                    stravaExpiresAt: new Date(expires_at * 1000),
                },
                create: {
                    userId: user.id,
                    coachId: invitation.coachId,
                    stravaUserId: athlete.id.toString(),
                    stravaAccessToken: access_token,
                    stravaRefreshToken: refresh_token,
                    stravaExpiresAt: new Date(expires_at * 1000),
                    connectedChannels: ['email', ...(invitation.whatsapp ? ['whatsapp'] : [])],
                }
            });

            // We keep the invitation PENDING so the user can finish the rest of the profile setup
            // Or we can mark it ACCEPTED if we want the callback to be the final step.
            // But the user still needs to click "Finish Onboarding" to update their name/photo.
            // So we'll just save the tokens and keep the invitation active.
        });

        // 4. Redirect back to the setup page with a success flag
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/client-setup/${token}?success=strava`);
    } catch (error) {
        console.error('Strava callback error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

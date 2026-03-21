import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ token: string }> }
) {
    const { token } = await params;

    try {
        const invitation = await prisma.clientInvitation.findUnique({
            where: { token },
            include: {
                coach: {
                    include: { user: true }
                }
            }
        });

        if (!invitation) {
            return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
        }

        if (invitation.status !== 'PENDING') {
            return NextResponse.json({ error: 'Invitation already accepted' }, { status: 400 });
        }

        if (new Date() > invitation.expiresAt) {
            return NextResponse.json({ error: 'Invitation expired' }, { status: 400 });
        }

        return NextResponse.json({
            name: invitation.name,
            email: invitation.email,
            coachName: invitation.coach.user.name,
            coachAvatar: invitation.coach.user.image, 
        });
    } catch (error) {
        console.error('Fetch invitation error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ token: string }> }
) {
    const { token } = await params;

    try {
        const { name, photoUrl, terraUserId, stravaUserId } = await request.json();

        // 1. Get invitation
        const invitation = await prisma.clientInvitation.findUnique({
            where: { token },
            include: { coach: true }
        });

        if (!invitation || invitation.status !== 'PENDING') {
            return NextResponse.json({ error: 'Invalid invitation' }, { status: 400 });
        }

        // 2. Transact: Create User (Client), Client record, and update invitation
        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // Check if user already exists
            let user = await tx.user.findUnique({ where: { email: invitation.email } });

            if (!user) {
                user = await tx.user.create({
                    data: {
                        email: invitation.email,
                        name: name || invitation.name,
                        role: 'CLIENT',
                        image: photoUrl || null,
                    }
                });
            } else {
                // Update existing user image if provided
                user = await tx.user.update({
                    where: { id: user.id },
                    data: { 
                        name: name || user.name,
                        image: photoUrl || user.image 
                    }
                });
            }

            const client = await tx.client.upsert({
                where: { userId: user.id },
                update: {
                    coachId: invitation.coachId,
                    photoUrl: photoUrl || null,
                    terraUserId: terraUserId || null,
                    stravaUserId: stravaUserId || null,
                },
                create: {
                    userId: user.id,
                    coachId: invitation.coachId,
                    photoUrl: photoUrl || null,
                    terraUserId: terraUserId || null,
                    stravaUserId: stravaUserId || null,
                    igHandle: invitation.igHandle,
                    xHandle: invitation.xHandle,
                    whatsapp: invitation.whatsapp,
                    connectedChannels: ['email', ...(invitation.whatsapp ? ['whatsapp'] : [])],
                }
            });

            await tx.clientInvitation.update({
                where: { id: invitation.id },
                data: {
                    status: 'ACCEPTED',
                    clientId: client.id,
                }
            });
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Accept invitation error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

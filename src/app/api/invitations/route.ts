import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';
import { sendClientInvitation } from '@/lib/email';
import { addDays } from 'date-fns';
import { Role } from '@prisma/client';

export async function POST(request: Request) {
    console.log('--- POST /api/invitations started ---');
    try {
        console.log('Attempting auth()...');
        const { userId } = await auth();
        console.log('Auth result userId:', userId);
        
        if (!userId) {
            console.log('No userId, returning 401');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await currentUser();
        if (!user) return NextResponse.json({ error: 'User not found in Clerk' }, { status: 404 });

        const body = await request.json();
        console.log('Request body:', body);
        const { name, email, ig, x, whatsapp } = body;

        // Derived latest values from Clerk
        const emailAddress = user.emailAddresses[0]?.emailAddress;
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Coach';

        // 1. Resolve Coach idempotently via Clerk userId
        let coach = await prisma.coach.upsert({
            where: { userId },
            include: { user: true },
            update: {
                user: {
                    update: { name: fullName, image: user.imageUrl }
                }
            },
            create: {
                user: {
                    connectOrCreate: {
                        where: { id: userId },
                        create: {
                            id: userId,
                            email: emailAddress,
                            name: fullName,
                            role: Role.COACH,
                            image: user.imageUrl,
                        }
                    }
                },
                specialization: 'Fitness Coach',
            }
        });

        if (!coach || !coach.user) {
            return NextResponse.json({ error: 'Failed to establish coach profile' }, { status: 500 });
        }
        console.log('Coach profile verified/synced:', coach.id);

        // 2. Check if this client already exists for this coach (User-Friendly Check)
        const existingClient = await prisma.client.findFirst({
            where: { 
                coachId: coach.id,
                user: { email: email.trim().toLowerCase() }
            }
        });

        if (existingClient) {
            return NextResponse.json({ 
                error: 'Already Registered', 
                details: 'This client is already in your dashboard.' 
            }, { status: 400 });
        }

        const existingInvite = await prisma.clientInvitation.findFirst({
            where: {
                coachId: coach.id,
                email: email.trim().toLowerCase(),
                status: 'PENDING',
                expiresAt: { gt: new Date() }
            }
        });

        if (existingInvite) {
            return NextResponse.json({ 
                error: 'Invitation Pending', 
                details: 'An invitation has already been sent to this email.' 
            }, { status: 400 });
        }

        // 1. Create a unique invitation record
        const invitation = await prisma.clientInvitation.create({
            data: {
                name,
                email,
                coachId: coach.id,
                igHandle: ig || null,
                xHandle: x || null,
                whatsapp: whatsapp || null,
                expiresAt: addDays(new Date(), 7),
            }
        });

        // 2. Send the invitation email using Resend
        const emailResult = await sendClientInvitation({
            email,
            name,
            coachName: coach.user.name || 'Your Coach',
            token: invitation.token,
        });

        if (!emailResult.success) {
            console.error('Invitation email failed:', emailResult.error);
            // We still return 200 perhaps, or 500 depending on how much we trust the invitation was created
        }

        return NextResponse.json({
            success: true,
            inviteId: invitation.id,
            token: invitation.token // In dev, we might want to return this to skip email check
        });
    } catch (error: any) {
        console.error('Invitation API error:', error);
        
        // Return more specific Prisma error info if available
        let errorMessage = 'Failed to create invitation';
        if (error.code) {
            errorMessage += ` (${error.code})`;
            if (error.message) {
                console.error('Specific Prisma Error:', error.message);
            }
        }
        
        return NextResponse.json({ 
            error: errorMessage,
            details: error.message || 'Unknown error'
        }, { status: 500 });
    }
}

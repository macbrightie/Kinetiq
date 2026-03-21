import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { senderId, receiverId, content } = await request.json();

        if (!senderId || !receiverId || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const message = await prisma.message.create({
            data: {
                senderId,
                receiverId,
                content
            }
        });

        return NextResponse.json(message);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}

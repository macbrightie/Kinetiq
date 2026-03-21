import { NextResponse } from 'next/server';
import { getCoachClients } from '@/services/clientService';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ coachId: string }> }
) {
    try {
        const { coachId } = await params;
        const clients = await getCoachClients(coachId);
        return NextResponse.json(clients);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
    }
}

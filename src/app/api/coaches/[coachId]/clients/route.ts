import { NextResponse } from 'next/server';
import { getCoachClients } from '@/services/clientService';

export async function GET(
    request: Request,
    { params }: { params: { coachId: string } }
) {
    try {
        const clients = await getCoachClients(params.coachId);
        return NextResponse.json(clients);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
    }
}

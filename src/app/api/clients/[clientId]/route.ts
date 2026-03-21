import { NextResponse } from 'next/server';
import { getClientHealthProfile } from '@/services/clientService';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ clientId: string }> }
) {
    try {
        const { clientId } = await params;
        const profile = await getClientHealthProfile(clientId);
        return NextResponse.json(profile);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch client profile' }, { status: 500 });
    }
}

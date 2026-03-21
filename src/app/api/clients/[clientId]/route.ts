import { NextResponse } from 'next/server';
import { getClientHealthProfile } from '@/services/clientService';

export async function GET(
    request: Request,
    { params }: { params: { clientId: string } }
) {
    try {
        const profile = await getClientHealthProfile(params.clientId);
        return NextResponse.json(profile);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch client profile' }, { status: 500 });
    }
}

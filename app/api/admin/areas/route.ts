import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth.authenticated || auth.user?.type !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const areas = await prisma.area.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        credits: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(areas, { status: 200 });
  } catch (error) {
    console.error('Error fetching areas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch areas' },
      { status: 500 }
    );
  }
}

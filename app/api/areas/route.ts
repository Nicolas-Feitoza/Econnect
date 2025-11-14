import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';
import { areaSchema, AreaInput } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Filtrar por usuário se não for admin
    const where = auth.user?.type === 'ADMIN' ? {} : { userId: auth.user?.userId };

    const areas = await prisma.area.findMany({
      where,
      include: { credits: true },
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

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = areaSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validation.error.errors },
        { status: 400 }
      );
    }

    const data: AreaInput = validation.data;

    const area = await prisma.area.create({
      data: {
        userId: auth.user!.userId,
        name: data.name,
        description: data.description,
        hectares: data.hectares,
        location: data.location,
        documentUrl: data.documentUrl,
        imageUrl: data.imageUrl,
        status: 'PENDING',
      },
      include: { credits: true },
    });

    return NextResponse.json(area, { status: 201 });
  } catch (error) {
    console.error('Error creating area:', error);
    return NextResponse.json(
      { error: 'Failed to create area' },
      { status: 500 }
    );
  }
}

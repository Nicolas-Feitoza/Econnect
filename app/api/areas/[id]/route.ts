import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const area = await prisma.area.findUnique({
      where: { id },
      include: { credits: true, user: { select: { id: true, name: true, email: true } } },
    });

    if (!area) {
      return NextResponse.json({ error: 'Area not found' }, { status: 404 });
    }

    return NextResponse.json(area, { status: 200 });
  } catch (error) {
    console.error('Error fetching area:', error);
    return NextResponse.json(
      { error: 'Failed to fetch area' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Verificar permissão
    const area = await prisma.area.findUnique({
      where: { id },
    });

    if (!area) {
      return NextResponse.json({ error: 'Area not found' }, { status: 404 });
    }

    if (area.userId !== auth.user!.userId && auth.user?.type !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedArea = await prisma.area.update({
      where: { id },
      data: body,
      include: { credits: true },
    });

    return NextResponse.json(updatedArea, { status: 200 });
  } catch (error) {
    console.error('Error updating area:', error);
    return NextResponse.json(
      { error: 'Failed to update area' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verificar permissão
    const area = await prisma.area.findUnique({
      where: { id },
    });

    if (!area) {
      return NextResponse.json({ error: 'Area not found' }, { status: 404 });
    }

    if (area.userId !== auth.user!.userId && auth.user?.type !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.area.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Area deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting area:', error);
    return NextResponse.json(
      { error: 'Failed to delete area' },
      { status: 500 }
    );
  }
}

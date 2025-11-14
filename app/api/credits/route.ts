import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';
import { creditSchema, CreditInput } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');

    const where: any = {};
    if (status) where.status = status;
    if (userId) where.area = { userId };

    const credits = await prisma.credit.findMany({
      where,
      include: {
        area: {
          include: { user: { select: { id: true, name: true } } },
        },
        transactions: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(credits, { status: 200 });
  } catch (error) {
    console.error('Error fetching credits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch credits' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth.authenticated || auth.user?.type !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = creditSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validation.error.errors },
        { status: 400 }
      );
    }

    const data: CreditInput = validation.data;

    // Verificar se área existe
    const area = await prisma.area.findUnique({
      where: { id: data.areaId },
    });

    if (!area) {
      return NextResponse.json({ error: 'Area not found' }, { status: 404 });
    }

    // Gerar tokenId único
    const tokenId = `ECON-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const credit = await prisma.credit.create({
      data: {
        areaId: data.areaId,
        tokenId,
        quantity: data.quantity,
        price: data.price,
        status: 'AVAILABLE',
      },
      include: {
        area: {
          include: { user: { select: { id: true, name: true } } },
        },
      },
    });

    return NextResponse.json(credit, { status: 201 });
  } catch (error) {
    console.error('Error creating credit:', error);
    return NextResponse.json(
      { error: 'Failed to create credit' },
      { status: 500 }
    );
  }
}

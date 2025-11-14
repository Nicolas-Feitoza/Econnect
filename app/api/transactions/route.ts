import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';
import { transactionSchema, TransactionInput } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = transactionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validation.error.errors },
        { status: 400 }
      );
    }

    const data: TransactionInput = validation.data;

    // Verificar se crédito existe
    const credit = await prisma.credit.findUnique({
      where: { id: data.creditId },
      include: { area: true },
    });

    if (!credit) {
      return NextResponse.json({ error: 'Credit not found' }, { status: 404 });
    }

    if (credit.status !== 'AVAILABLE') {
      return NextResponse.json(
        { error: 'Credit is not available for purchase' },
        { status: 409 }
      );
    }

    // Criar transação
    const transaction = await prisma.transaction.create({
      data: {
        creditId: data.creditId,
        buyerId: auth.user!.userId,
        sellerId: credit.area.userId,
        quantity: data.quantity,
        price: data.price,
        status: 'COMPLETED',
      },
      include: {
        credit: true,
        buyer: { select: { id: true, name: true, email: true } },
        seller: { select: { id: true, name: true, email: true } },
      },
    });

    // Atualizar status do crédito
    await prisma.credit.update({
      where: { id: data.creditId },
      data: { status: 'SOLD' },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { buyerId: auth.user!.userId },
          { sellerId: auth.user!.userId },
        ],
      },
      include: {
        credit: { include: { area: true } },
        buyer: { select: { id: true, name: true } },
        seller: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

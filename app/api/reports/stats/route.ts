import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth.authenticated || auth.user?.type !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const totalUsers = await prisma.user.count();
    const totalAreas = await prisma.area.count();
    const validatedAreas = await prisma.area.count({ where: { status: 'VALIDATED' } });
    const totalCredits = await prisma.credit.aggregate({
      _sum: { quantity: true },
    });
    const totalTransactions = await prisma.transaction.count();
    const completedTransactions = await prisma.transaction.count({
      where: { status: 'COMPLETED' },
    });

    const stats = {
      platform: {
        totalUsers,
        totalAreas,
        validatedAreas,
        pendingAreas: totalAreas - validatedAreas,
      },
      credits: {
        total: totalCredits._sum.quantity || 0,
        unit: 'ton CO2',
      },
      marketplace: {
        totalTransactions,
        completedTransactions,
        pendingTransactions: totalTransactions - completedTransactions,
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

// @ts-ignore: next/server types not available in this environment
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth.authenticated || auth.user?.type !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await request.json();

    if (!['VALIDATED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const area = await prisma.area.update({
      where: { id },
      data: { status },
      include: { credits: true },
    });

    // Se validado, gerar créditos automaticamente
    if (status === 'VALIDATED' && area.credits.length === 0) {
      const quantity = area.hectares * 10; // 10 ton CO2 por hectare (exemplo)
      const tokenId = `ECON-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      await prisma.credit.create({
        data: {
          areaId: area.id,
          tokenId,
          quantity,
          price: 50, // R$ 50 por ton CO2
          status: 'AVAILABLE',
        },
      });
    }

    return NextResponse.json(area, { status: 200 });
  } catch (error) {
    console.error('Error updating area:', error);
    return NextResponse.json(
      { error: 'Failed to update area' },
      { status: 500 }
    );
  }
}

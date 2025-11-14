import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; format: string }> }
) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, format } = await params;

    // Verificar permissão
    if (userId !== auth.user!.userId && auth.user?.type !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Coletar dados
    const areas = await prisma.area.findMany({
      where: { userId },
      include: { credits: true },
    });

    const transactions = await prisma.transaction.findMany({
      where: { buyerId: userId },
      include: { credit: { include: { area: true } } },
    });

    // Calcular métricas
      const totalHectares = areas.reduce((acc: number, area: any) => acc + area.hectares, 0);
    const totalCredits = areas.reduce(
        (acc: number, area: any) => acc + area.credits.reduce((acc: number, c: any) => acc + c.quantity, 0),
      0
    );
      const totalSpent = transactions.reduce((acc: number, tx: any) => acc + tx.price, 0);

    const reportData = {
      user: {
        id: userId,
        name: auth.user?.userId,
      },
      generatedAt: new Date().toISOString(),
      metrics: {
        totalHectares,
        totalCredits,
        totalSpent,
        areas: areas.length,
        transactions: transactions.length,
      },
      areas: areas.map((a: any) => ({
        name: a.name,
        hectares: a.hectares,
        status: a.status,
        credits: a.credits.reduce((acc: number, c: any) => acc + c.quantity, 0),
      })),
      transactions: transactions.map((t: any) => ({
        date: t.createdAt,
        credits: t.quantity,
        price: t.price,
        status: t.status,
      })),
    };

    if (format === 'csv') {
      return generateCSV(reportData);
    } else {
      return generatePDF(reportData);
    }
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}

function generateCSV(data: any) {
  const rows: string[] = [];

  rows.push('RELATÓRIO ESG ECONNECT');
  rows.push(`Gerado em: ${data.generatedAt}`);
  rows.push('');

  rows.push('MÉTRICAS DE IMPACTO');
  rows.push(`Total de Hectares,${data.metrics.totalHectares}`);
  rows.push(`Créditos de Carbono,${data.metrics.totalCredits} ton CO2`);
  rows.push(`Total Gasto,R$ ${data.metrics.totalSpent.toFixed(2)}`);
  rows.push(`Áreas Registradas,${data.metrics.areas}`);
  rows.push(`Transações,${data.metrics.transactions}`);
  rows.push('');

  rows.push('ÁREAS PRESERVADAS');
  rows.push('Nome,Hectares,Status,Créditos');
  data.areas.forEach((a: any) => {
    rows.push(`${a.name},${a.hectares},${a.status},${a.credits}`);
  });

  const csv = rows.join('\n');
  const buffer = Buffer.from(csv, 'utf-8');

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename=relatorio-esg.csv',
    },
  });
}

function generatePDF(data: any) {
  // Simulado - em produção usar jsPDF
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Relatório ESG</title>
      <style>
        body { font-family: Arial; margin: 40px; }
        h1 { color: #2d5016; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #2d5016; color: white; }
      </style>
    </head>
    <body>
      <h1>Relatório ESG - Econnect</h1>
      <p>Gerado em: ${data.generatedAt}</p>
      
      <h2>Métricas de Impacto</h2>
      <ul>
        <li>Total de Hectares: ${data.metrics.totalHectares}</li>
        <li>Créditos de Carbono: ${data.metrics.totalCredits} ton CO2</li>
        <li>Total Gasto: R$ ${data.metrics.totalSpent.toFixed(2)}</li>
      </ul>

      <h2>Áreas Preservadas</h2>
      <table>
        <tr>
          <th>Nome</th>
          <th>Hectares</th>
          <th>Status</th>
          <th>Créditos</th>
        </tr>
        ${data.areas.map((a: any) => `
          <tr>
            <td>${a.name}</td>
            <td>${a.hectares}</td>
            <td>${a.status}</td>
            <td>${a.credits}</td>
          </tr>
        `).join('')}
      </table>
    </body>
    </html>
  `;

  const buffer = Buffer.from(html, 'utf-8');

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': 'attachment; filename=relatorio-esg.html',
    },
  });
}

import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/password';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Criar usuários de exemplo
  const adminPassword = await hashPassword('admin123456');
  const producerPassword = await hashPassword('producer123456');
  const companyPassword = await hashPassword('company123456');

  await prisma.user.upsert({
    where: { email: 'admin@econnect.com' },
    update: {},
    create: {
      email: 'admin@econnect.com',
      password: adminPassword,
      name: 'Admin Econnect',
      type: 'ADMIN',
    },
  });

  const producer = await prisma.user.upsert({
    where: { email: 'produtor@example.com' },
    update: {},
    create: {
      email: 'produtor@example.com',
      password: producerPassword,
      name: 'João Silva - Produtor',
      type: 'PRODUCER',
    },
  });

  await prisma.user.upsert({
    where: { email: 'empresa@example.com' },
    update: {},
    create: {
      email: 'empresa@example.com',
      password: companyPassword,
      name: 'Tech Green Company',
      type: 'COMPANY',
    },
  });

  // Criar áreas de exemplo
  const area1 = await prisma.area.create({
    data: {
      userId: producer.id,
      name: 'Reserva Mata Atlântica',
      description: 'Área preservada de 100 hectares na região de Iguazu',
      hectares: 100,
      location: JSON.stringify({ lat: -25.5, lng: -54.5 }),
      status: 'VALIDATED',
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500',
    },
  });

  const area2 = await prisma.area.create({
    data: {
      userId: producer.id,
      name: 'Floresta Amazônica',
      description: 'Proteção de floresta amazônica em parceria com comunidades locais',
      hectares: 250,
      location: JSON.stringify({ lat: -3.5, lng: -62.5 }),
      status: 'VALIDATED',
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500',
    },
  });

  // Criar créditos de exemplo
  await prisma.credit.create({
    data: {
      areaId: area1.id,
      tokenId: `ECON-${Date.now()}-001`,
      quantity: 1000, // 1000 ton CO2
      price: 50, // R$ 50 por ton
      status: 'AVAILABLE',
    },
  });

  await prisma.credit.create({
    data: {
      areaId: area2.id,
      tokenId: `ECON-${Date.now()}-002`,
      quantity: 2500, // 2500 ton CO2
      price: 45, // R$ 45 por ton
      status: 'AVAILABLE',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('\n📊 Created:');
  console.log(`- 1 Admin user: admin@econnect.com / admin123456`);
  console.log(`- 1 Producer user: produtor@example.com / producer123456`);
  console.log(`- 1 Company user: empresa@example.com / company123456`);
  console.log(`- 2 Areas (VALIDATED)`);
  console.log(`- 2 Credits (AVAILABLE)`);
  console.log('\n🔐 IMPORTANT: Change these credentials in production!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

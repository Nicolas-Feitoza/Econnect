import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/password';
import { generateToken } from '@/lib/jwt';
import { registerSchema, loginSchema, RegisterInput, LoginInput } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const action = url.pathname.split('/').pop();

    if (action === 'register') {
      return handleRegister(request);
    } else if (action === 'login') {
      return handleLogin(request);
    }

    return NextResponse.json({ error: 'Action not found' }, { status: 404 });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleRegister(request: NextRequest) {
  const body = await request.json();

  // Validar entrada
  const validation = registerSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Dados inválidos', details: validation.error.errors },
      { status: 400 }
    );
  }

  const data: RegisterInput = validation.data;

  // Verificar se usuário já existe
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: 'Email já registrado' },
      { status: 409 }
    );
  }

  // Hash da senha
  const hashedPassword = await hashPassword(data.password);

  // Criar usuário
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      type: data.type,
    },
    select: {
      id: true,
      email: true,
      name: true,
      type: true,
      createdAt: true,
    },
  });

  // Gerar token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    type: user.type,
  });

  return NextResponse.json(
    {
      user,
      token,
      message: 'Usuário registrado com sucesso',
    },
    { status: 201 }
  );
}

async function handleLogin(request: NextRequest) {
  const body = await request.json();

  // Validar entrada
  const validation = loginSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Dados inválidos', details: validation.error.errors },
      { status: 400 }
    );
  }

  const data: LoginInput = validation.data;

  // Encontrar usuário
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    return NextResponse.json(
      { error: 'Email ou senha incorretos' },
      { status: 401 }
    );
  }

  // Verificar senha
  const passwordMatch = await verifyPassword(data.password, user.password);
  if (!passwordMatch) {
    return NextResponse.json(
      { error: 'Email ou senha incorretos' },
      { status: 401 }
    );
  }

  // Gerar token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    type: user.type,
  });

  return NextResponse.json(
    {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.type,
      },
      token,
      message: 'Login realizado com sucesso',
    },
    { status: 200 }
  );
}

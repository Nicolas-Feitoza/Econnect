import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  type: z.enum(['PRODUCER', 'COMPANY', 'ADMIN']),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
});

export const areaSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  description: z.string().optional(),
  hectares: z.number().positive('Hectares deve ser maior que 0'),
  location: z.string().optional(), // JSON string {lat, lng}
  documentUrl: z.string().url('URL de documento inválida').optional(),
  imageUrl: z.string().url('URL de imagem inválida').optional(),
});

export const creditSchema = z.object({
  areaId: z.string().min(1),
  quantity: z.number().positive('Quantidade deve ser maior que 0'),
  price: z.number().positive('Preço deve ser maior que 0').optional(),
});

export const transactionSchema = z.object({
  creditId: z.string().min(1),
  quantity: z.number().positive('Quantidade deve ser maior que 0'),
  price: z.number().positive('Preço deve ser maior que 0'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AreaInput = z.infer<typeof areaSchema>;
export type CreditInput = z.infer<typeof creditSchema>;
export type TransactionInput = z.infer<typeof transactionSchema>;

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao fazer login');
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      
      // Redirect based on user type
      if (data.user.type === 'PRODUCER') {
        router.push('/dashboard/producer');
      } else if (data.user.type === 'COMPANY') {
        router.push('/dashboard/company');
      } else if (data.user.type === 'ADMIN') {
        router.push('/dashboard/admin');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-900">Fazer Login</h2>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-300 rounded text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded px-3 py-2"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded px-3 py-2"
              placeholder="Sua senha"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white py-2 rounded font-semibold hover:bg-green-800 disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Fazer Login'}
          </button>
        </form>

        <p className="mt-4 text-center text-slate-700">
          Não tem conta?{' '}
          <a href="/auth/register" className="text-green-700 hover:underline">
            Registrar
          </a>
        </p>
      </div>
    </div>
  );
}

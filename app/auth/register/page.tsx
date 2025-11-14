'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    type: 'PRODUCER',
  });

  useEffect(() => {
    // Ler parâmetro "type" do query string apenas no cliente
    try {
      const params = new URLSearchParams(window.location.search);
      const t = params.get('type');
      if (t) setFormData(prev => ({ ...prev, type: t }));
    } catch (e) {
      // noop
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao registrar');
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      
      // Redirect based on user type
      if (formData.type === 'PRODUCER') {
        router.push('/dashboard/producer');
      } else if (formData.type === 'COMPANY') {
        router.push('/dashboard/company');
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
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-900">Registrar</h2>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-300 rounded text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tipo de Conta
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded px-3 py-2"
            >
              <option value="PRODUCER">Produtor/Comunidade</option>
              <option value="COMPANY">Empresa</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nome
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded px-3 py-2"
              placeholder="Seu nome"
            />
          </div>

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
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white py-2 rounded font-semibold hover:bg-green-800 disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>

        <p className="mt-4 text-center text-slate-700">
          Já tem conta?{' '}
          <a href="/auth/login" className="text-green-700 hover:underline">
            Fazer login
          </a>
        </p>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Area {
  id: string;
  name: string;
  hectares: number;
  status: string;
  credits: any[];
  createdAt: string;
}

export default function ProducerDashboard() {
  const router = useRouter();
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    hectares: '',
    documentUrl: '',
    imageUrl: '',
  });

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/areas', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/auth/login');
          return;
        }
        throw new Error('Erro ao carregar áreas');
      }

      const data = await res.json();
      setAreas(data);
    } catch (error) {
      console.error('Error fetching areas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/areas', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          hectares: parseFloat(formData.hectares),
        }),
      });

      if (!res.ok) throw new Error('Erro ao criar área');

      setFormData({
        name: '',
        description: '',
        hectares: '',
        documentUrl: '',
        imageUrl: '',
      });
      setShowForm(false);
      fetchAreas();
    } catch (error) {
      console.error('Error creating area:', error);
    }
  };

  if (loading) return <div className="p-4">Carregando...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-700">🌱 Econnect - Produtor</h1>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              router.push('/');
            }}
            className="text-slate-700 hover:text-red-700"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Minhas Áreas Preservadas</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800"
          >
            {showForm ? 'Cancelar' : '+ Nova Área'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h3 className="text-2xl font-bold mb-6 text-slate-900">Registrar Nova Área</h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nome da Área
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="w-full border border-slate-300 rounded px-3 py-2"
                    placeholder="Ex: Reserva da Mata Atlântica"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Hectares
                  </label>
                  <input
                    type="number"
                    name="hectares"
                    value={formData.hectares}
                    onChange={handleFormChange}
                    required
                    min="0.1"
                    step="0.1"
                    className="w-full border border-slate-300 rounded px-3 py-2"
                    placeholder="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Descrição
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  className="w-full border border-slate-300 rounded px-3 py-2 h-24"
                  placeholder="Descreva sua área preservada..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    URL do Documento (opcional)
                  </label>
                  <input
                    type="url"
                    name="documentUrl"
                    value={formData.documentUrl}
                    onChange={handleFormChange}
                    className="w-full border border-slate-300 rounded px-3 py-2"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    URL da Imagem (opcional)
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleFormChange}
                    className="w-full border border-slate-300 rounded px-3 py-2"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-700 text-white py-2 rounded font-semibold hover:bg-green-800"
              >
                Registrar Área
              </button>
            </form>
          </div>
        )}

        {/* Areas List */}
        {areas.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center text-slate-700">
            <p>Nenhuma área registrada ainda. Comece criando uma nova área!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {areas.map(area => (
              <div key={area.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{area.name}</h3>
                <div className="space-y-2 text-sm text-slate-700 mb-4">
                  <p><strong>Hectares:</strong> {area.hectares}</p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      area.status === 'VALIDATED' ? 'bg-green-100 text-green-800' :
                      area.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {area.status}
                    </span>
                  </p>
                  <p><strong>Créditos:</strong> {area.credits.reduce((acc, c) => acc + c.quantity, 0)} ton CO2</p>
                </div>
                <a
                  href={`/dashboard/producer/area/${area.id}`}
                  className="inline-block text-green-700 hover:underline font-semibold"
                >
                  Ver Detalhes →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

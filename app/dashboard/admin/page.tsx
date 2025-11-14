'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Area {
  id: string;
  name: string;
  hectares: number;
  status: string;
  credits: any[];
  user: { name: string };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [areas, setAreas] = useState<Area[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch areas
      const areasRes = await fetch('/api/admin/areas', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (areasRes.ok) {
        const data = await areasRes.json();
        setAreas(data);
      }

      // Fetch stats
      const statsRes = await fetch('/api/reports/stats', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const handleValidateArea = async (areaId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/areas/${areaId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        alert('Área atualizada com sucesso!');
        fetchData();
      }
    } catch (error) {
      console.error('Error updating area:', error);
    }
  };

  if (loading) return <div className="p-4">Carregando...</div>;

  const filteredAreas = areas.filter(a => a.status === filter);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700">🛡️ Econnect - Admin</h1>
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
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm text-slate-700 font-semibold">Usuários</p>
              <p className="text-3xl font-bold text-blue-700">{stats.platform.totalUsers}</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
              <p className="text-sm text-slate-700 font-semibold">Áreas Validadas</p>
              <p className="text-3xl font-bold text-green-700">{stats.platform.validatedAreas}</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
              <p className="text-sm text-slate-700 font-semibold">Áreas Pendentes</p>
              <p className="text-3xl font-bold text-yellow-700">{stats.platform.pendingAreas}</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
              <p className="text-sm text-slate-700 font-semibold">Total CO2 (ton)</p>
              <p className="text-3xl font-bold text-purple-700">{Math.round(stats.credits.total)}</p>
            </div>
          </div>
        )}

        {/* Areas Management */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Validar Áreas</h2>
            <div className="flex gap-2">
              {['PENDING', 'VALIDATED', 'REJECTED'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded font-semibold ${
                    filter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {filteredAreas.length === 0 ? (
            <p className="text-center text-slate-700 py-8">Nenhuma área com este status</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 border-b-2 border-slate-300">
                  <tr>
                    <th className="text-left p-4">Nome</th>
                    <th className="text-left p-4">Produtor</th>
                    <th className="text-left p-4">Hectares</th>
                    <th className="text-left p-4">Créditos (ton)</th>
                    <th className="text-left p-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAreas.map(area => (
                    <tr key={area.id} className="border-b hover:bg-slate-50">
                      <td className="p-4 font-semibold text-slate-900">{area.name}</td>
                      <td className="p-4 text-slate-700">{area.user.name}</td>
                      <td className="p-4 text-slate-700">{area.hectares}</td>
                      <td className="p-4 text-slate-700">
                        {area.credits.reduce((acc, c) => acc + c.quantity, 0)}
                      </td>
                      <td className="p-4 space-x-2">
                        {area.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleValidateArea(area.id, 'VALIDATED')}
                              className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                            >
                              ✓ Validar
                            </button>
                            <button
                              onClick={() => handleValidateArea(area.id, 'REJECTED')}
                              className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                            >
                              ✗ Rejeitar
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

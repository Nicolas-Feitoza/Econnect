'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Credit {
  id: string;
  tokenId: string;
  quantity: number;
  price: number | null;
  status: string;
}

export default function CompanyDashboard() {
  const router = useRouter();
  const [credits, setCredits] = useState<Credit[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    try {
      const res = await fetch('/api/credits?status=AVAILABLE');
      if (!res.ok) throw new Error('Erro ao carregar créditos');

      const data = await res.json();
      setCredits(data);
    } catch (error) {
      console.error('Error fetching credits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (creditId: string, price: number) => {
    setCart(prev => ({
      ...prev,
      [creditId]: (prev[creditId] || 0) + 1,
    }));
    setTotalPrice(prev => prev + price);
  };

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('token');
      for (const [creditId, quantity] of Object.entries(cart)) {
        const credit = credits.find(c => c.id === creditId);
        if (!credit) continue;

        await fetch('/api/transactions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            creditId,
            quantity,
            price: (credit.price || 0) * quantity,
          }),
        });
      }

      alert('Compra realizada com sucesso!');
      setCart({});
      setTotalPrice(0);
      fetchCredits();
    } catch (error) {
      console.error('Error completing purchase:', error);
      alert('Erro ao completar compra');
    }
  };

  if (loading) return <div className="p-4">Carregando...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-700">🌱 Econnect - Empresa</h1>
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
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Marketplace - Créditos de Carbono</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Credits List */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {credits.length === 0 ? (
                <div className="text-center text-slate-700">
                  <p>Nenhum crédito disponível no momento</p>
                </div>
              ) : (
                credits.map(credit => (
                  <div
                    key={credit.id}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition border-l-4 border-green-500"
                  >
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{credit.tokenId}</h3>
                    <div className="space-y-2 text-sm text-slate-700 mb-4">
                      <p><strong>Quantidade:</strong> {credit.quantity} ton CO2</p>
                      <p><strong>Preço:</strong> R$ {(credit.price || 0).toFixed(2)}/ton</p>
                      <p className="text-sm text-slate-500">Total: R$ {((credit.price || 0) * credit.quantity).toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => handleAddToCart(credit.id, (credit.price || 0) * credit.quantity)}
                      className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 font-semibold"
                    >
                      Adicionar ao Carrinho
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Cart */}
          <div className="bg-white p-6 rounded-lg shadow-md h-fit sticky top-4">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">🛒 Carrinho</h3>

            {Object.keys(cart).length === 0 ? (
              <p className="text-slate-700 text-center py-8">Carrinho vazio</p>
            ) : (
              <>
                <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
                  {Object.entries(cart).map(([creditId, quantity]) => {
                    const credit = credits.find(c => c.id === creditId);
                    return (
                      <div key={creditId} className="bg-slate-50 p-3 rounded">
                        <p className="text-sm font-semibold text-slate-900">{credit?.tokenId}</p>
                        <p className="text-xs text-slate-700">Quantidade: {quantity}</p>
                        <p className="text-sm font-bold text-green-700 mt-1">
                          R$ {(((credit?.price || 0) * credit!.quantity) * quantity).toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-lg font-bold text-slate-900">
                    <span>Total:</span>
                    <span>R$ {totalPrice.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 font-bold"
                  >
                    Finalizar Compra (Simular Pix)
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

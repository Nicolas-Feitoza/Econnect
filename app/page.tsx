'use client';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-700">🌱 Econnect</h1>
          <div className="flex gap-4">
            <a href="/auth/login" className="text-slate-700 hover:text-green-700">
              Login
            </a>
            <a href="/auth/register" className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">
              Registrar
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-700 to-green-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-4">Marketplace Sustentável</h2>
          <p className="text-xl mb-8 opacity-90">
            Conectando produtores e empresas para um futuro com transparência em créditos de carbono
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href="/auth/register?type=PRODUCER"
              className="bg-white text-green-700 font-bold px-8 py-3 rounded hover:bg-slate-100"
            >
              Iniciar como Produtor
            </a>
            <a 
              href="/auth/register?type=COMPANY"
              className="border-2 border-white text-white font-bold px-8 py-3 rounded hover:bg-green-800"
            >
              Iniciar como Empresa
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-4xl font-bold text-center mb-16 text-slate-900">Nossos Diferenciais</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 p-8 rounded-lg border-2 border-green-100">
              <div className="text-4xl mb-4">🌍</div>
              <h4 className="text-xl font-bold mb-3 text-slate-900">Validação Transparente</h4>
              <p className="text-slate-700">
                Áreas preservadas validadas automaticamente com dados geográficos e documentos
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 p-8 rounded-lg border-2 border-green-100">
              <div className="text-4xl mb-4">📊</div>
              <h4 className="text-xl font-bold mb-3 text-slate-900">Rastreabilidade Total</h4>
              <p className="text-slate-700">
                Tokens digitais únicos para cada crédito de carbono gerado garantindo autenticidade
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 p-8 rounded-lg border-2 border-green-100">
              <div className="text-4xl mb-4">💰</div>
              <h4 className="text-xl font-bold mb-3 text-slate-900">Marketplace Dinâmico</h4>
              <p className="text-slate-700">
                Negociação de créditos entre produtores e empresas interessadas em compensação ESG
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-slate-900">Para Produtores & Comunidades</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <span className="text-slate-700">Monetizar áreas preservadas</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <span className="text-slate-700">Gerar renda sustentável</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <span className="text-slate-700">Relatórios de impacto auditáveis</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-3xl font-bold mb-6 text-slate-900">Para Empresas</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <span className="text-slate-700">Cumprir metas ESG</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <span className="text-slate-700">Comprar créditos verificados</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <span className="text-slate-700">Gerar relatórios de compensação</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-700 text-white text-center">
        <h3 className="text-4xl font-bold mb-8">Comece Agora</h3>
        <p className="text-xl mb-8">Junte-se a milhares de produtores e empresas comprometidas com a sustentabilidade</p>
        <a 
          href="/auth/register"
          className="inline-block bg-white text-green-700 font-bold px-8 py-3 rounded hover:bg-slate-100"
        >
          Criar Conta Grátis
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2024 Econnect. Todos os direitos reservados.</p>
          <p className="text-slate-400 mt-2">Desenvolvido com ❤️ para a sustentabilidade</p>
        </div>
      </footer>
    </div>
  );
}

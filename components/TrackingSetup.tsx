
import React, { useState, useEffect } from 'react';
import { UserConfig, Plan } from '../types';
import { DEFAULT_PLANS } from '../utils';

interface TrackingSetupProps {
  config: UserConfig | null;
  onSave: (config: UserConfig) => void;
}

const TrackingSetup: React.FC<TrackingSetupProps> = ({ config, onSave }) => {
  const [pixelId, setPixelId] = useState(config?.pixelId || '');
  const [accessToken, setAccessToken] = useState(config?.accessToken || '');
  const [userName, setUserName] = useState(config?.userName || '');
  const [plans, setPlans] = useState<Plan[]>(config?.plans || DEFAULT_PLANS);

  const handlePlanChange = (index: number, newPrice: string) => {
    const updated = [...plans];
    updated[index].price = parseFloat(newPrice) || 0;
    setPlans(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ 
      pixelId, 
      accessToken, 
      userName, 
      plans,
      sellerId: config?.sellerId || ''
    });
    alert('Configurações e Planos salvos com sucesso!');
  };

  const formUrl = `${window.location.origin}/#/form/${config?.sellerId || 'demo'}`;

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-10">
      <div className="bg-indigo-600 rounded-[2rem] p-8 text-white flex items-center gap-6 shadow-xl shadow-indigo-100">
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl">
          <i className="fa-solid fa-gear"></i>
        </div>
        <div>
          <h2 className="text-2xl font-black">Central de Configuração</h2>
          <p className="text-indigo-100 font-medium">Configure sua Meta API e personalize seus planos de assinatura.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Meta CAPI Config */}
        <section className="bg-white border rounded-[2.5rem] p-10 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <i className="fa-brands fa-facebook text-indigo-600"></i> Meta Conversion API
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome da Operação</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-3.5 outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold"
                placeholder="Ex: TechView IPTV"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pixel ID</label>
              <input
                type="text"
                value={pixelId}
                onChange={(e) => setPixelId(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-3.5 outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold"
                placeholder="1234567890..."
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">CAPI Access Token</label>
              <textarea
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-3.5 outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold h-32 resize-none"
                placeholder="EAAB..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 mt-2"
            >
              SALVAR CONFIGURAÇÕES
            </button>
          </form>
        </section>

        {/* Plan Editor */}
        <section className="bg-white border rounded-[2.5rem] p-10 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <i className="fa-solid fa-list-check text-indigo-600"></i> Gestão de Planos
          </h3>
          
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {plans.map((plan, idx) => (
              <div key={plan.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center group hover:border-indigo-200 transition-all">
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">
                    {plan.screens} Tela{plan.screens > 1 ? 's' : ''}
                  </p>
                  <p className="font-bold text-slate-800">{plan.name.split(' (')[0]}</p>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border group-hover:border-indigo-500 transition-all">
                  <span className="text-slate-400 font-bold text-sm">R$</span>
                  <input 
                    type="number" 
                    step="0.01"
                    className="w-20 outline-none font-black text-slate-800 text-right"
                    value={plan.price}
                    onChange={(e) => handlePlanChange(idx, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-[10px] text-gray-400 font-medium italic">
            * Alterar os preços aqui afetará instantaneamente o seu formulário de vendas.
          </p>
        </section>
      </div>

      {config && (
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-4xl shadow-2xl shadow-indigo-600/50">
              <i className="fa-solid fa-rocket"></i>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-xl font-black mb-1">Seu Link de Vendas Está Pronto!</h4>
              <p className="text-slate-400 font-medium text-sm mb-4">Divulgue este link para capturar leads e disparar eventos CAPI.</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={formUrl}
                  className="flex-1 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-sm font-mono text-indigo-300 outline-none"
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(formUrl);
                    alert('Link copiado!');
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-lg"
                >
                  COPIAR
                </button>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <i className="fa-solid fa-link text-[150px]"></i>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackingSetup;

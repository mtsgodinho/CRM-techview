
import React, { useState } from 'react';
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
    onSave({ pixelId, accessToken, userName, plans, sellerId: config?.sellerId || '' });
    alert('PROTOCOLOS_SALVOS: Rede sincronizada.');
  };

  const formUrl = `${window.location.origin}/#/form/${config?.sellerId || 'demo'}`;

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-12">
      <div className="bg-[#00BFFF] rounded-[3rem] p-10 text-black flex items-center gap-10 shadow-[0_0_50px_rgba(0,191,255,0.3)]">
        <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center text-4xl text-[#00BFFF] shadow-2xl">
          <i className="fa-solid fa-satellite-dish"></i>
        </div>
        <div>
          <h2 className="text-3xl font-sci-fi font-black uppercase tracking-tighter">Terminal_De_Configuração</h2>
          <p className="font-black uppercase tracking-widest text-[10px] opacity-70 mt-1">Configure sua ponte de dados com a Meta API e personalize pautas de venda.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-[3rem] p-12 shadow-2xl space-y-8">
          <h3 className="text-[11px] font-sci-fi font-black text-white flex items-center gap-4 uppercase tracking-[0.2em]">
            <i className="fa-brands fa-facebook-f text-[#00BFFF]"></i> META_CONVERSION_LINK
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] ml-2">ID_DA_OPERAÇÃO</label>
              <input type="text" value={userName} onChange={e => setUserName(e.target.value)} className="w-full bg-black border-2 border-[#1A1A1A] rounded-2xl px-6 py-4 outline-none focus:border-[#00BFFF] transition-all font-black text-white text-xs uppercase" placeholder="EX: TECHVIEW_ALPHA" required />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] ml-2">PIXEL_ID_META</label>
              <input type="text" value={pixelId} onChange={e => setPixelId(e.target.value)} className="w-full bg-black border-2 border-[#1A1A1A] rounded-2xl px-6 py-4 outline-none focus:border-[#00BFFF] transition-all font-black text-white text-xs uppercase" placeholder="123456789..." required />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] ml-2">CAPI_ACCESS_TOKEN_HEX</label>
              <textarea value={accessToken} onChange={e => setAccessToken(e.target.value)} className="w-full bg-black border-2 border-[#1A1A1A] rounded-2xl px-6 py-4 outline-none focus:border-[#00BFFF] transition-all font-black text-white text-xs uppercase h-40 resize-none custom-scrollbar" placeholder="EAAB..." required />
            </div>
            <button type="submit" className="w-full bg-[#00BFFF] text-black font-sci-fi font-black py-5 rounded-2xl hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(0,191,255,0.3)] uppercase tracking-widest text-[11px]">SINCRONIZAR_PROTOCOLO</button>
          </form>
        </section>

        <section className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-[3rem] p-12 shadow-2xl space-y-8">
          <h3 className="text-[11px] font-sci-fi font-black text-white flex items-center gap-4 uppercase tracking-[0.2em]">
            <i className="fa-solid fa-layer-group text-[#00BFFF]"></i> GESTÃO_DE_TARIFAS
          </h3>
          <div className="space-y-4 max-h-[550px] overflow-y-auto pr-4 custom-scrollbar">
            {plans.map((plan, idx) => (
              <div key={plan.id} className="p-6 bg-black rounded-2xl border border-[#1A1A1A] flex justify-between items-center hover:border-[#00BFFF]/30 transition-all">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="bg-[#00BFFF]/10 text-[#00BFFF] px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">{plan.screens} TELA(S)</span>
                  </div>
                  <p className="font-black text-white uppercase tracking-tighter text-sm">{plan.name.split(' (')[0]}</p>
                </div>
                <div className="bg-[#050505] border border-[#1A1A1A] px-5 py-3 rounded-xl flex items-center gap-3">
                  <span className="text-slate-700 font-black text-[10px]">BRL</span>
                  <input type="number" step="0.01" className="bg-transparent w-24 outline-none font-sci-fi font-black text-[#00BFFF] text-right text-sm" value={plan.price} onChange={e => handlePlanChange(idx, e.target.value)} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.2em] italic text-center">* ATUALIZAÇÕES DE TARIFA SÃO INSTANTÂNEAS NO LINK DE COMANDO.</p>
        </section>
      </div>

      {config && (
        <div className="bg-[#0A0A0A] border-2 border-[#00BFFF]/20 rounded-[4rem] p-12 text-white shadow-[0_0_60px_rgba(0,191,255,0.1)] relative overflow-hidden group">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="w-24 h-24 bg-[#00BFFF] rounded-[2rem] flex items-center justify-center text-5xl text-black shadow-[0_0_30px_rgba(0,191,255,0.4)] group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-link"></i>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-2xl font-sci-fi font-black mb-3 neon-glow uppercase tracking-tighter">LINK_DE_COMANDO_ESTABELECIDO</h4>
              <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] mb-8">Ponto de entrada público para captura de leads e ativação de protocolos Meta CAPI.</p>
              <div className="flex flex-col md:flex-row gap-4">
                <input type="text" readOnly value={formUrl} className="flex-1 bg-black border border-[#1A1A1A] px-8 py-5 rounded-2xl text-[11px] font-mono text-[#00BFFF] outline-none shadow-inner" />
                <button onClick={() => { navigator.clipboard.writeText(formUrl); alert('URL_COPIADA'); }} className="bg-white text-black hover:bg-[#00BFFF] hover:text-white px-10 py-5 rounded-2xl font-sci-fi font-black text-[11px] transition-all shadow-xl uppercase tracking-widest">COPIAR_LINK</button>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <i className="fa-solid fa-user-astronaut text-[200px] text-[#00BFFF]"></i>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackingSetup;

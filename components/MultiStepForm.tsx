
import React, { useState, useEffect } from 'react';
import { UserConfig, Plan } from '../types';
import { generateEventId, DEFAULT_PLANS } from '../utils';
import { trackPixelEvent, prepareCapiPayload, sendToCapi } from '../services/capiService';

interface MultiStepFormProps {
  config: UserConfig | null;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({ config }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cep: '',
    planId: '',
    source: '',
  });

  const plansToUse = config?.plans || DEFAULT_PLANS;

  const nextStep = async () => {
    const eventId = generateEventId();
    
    if (step === 1) {
      const [firstName, ...lastNameParts] = formData.name.split(' ');
      const lastName = lastNameParts.join(' ') || 'N/A';
      const params = { content_name: 'Lead Capture', value: 0, currency: 'BRL' };
      trackPixelEvent('Lead', params, eventId);
      
      if (config) {
        const payload = await prepareCapiPayload('Lead', eventId, {
          email: formData.email,
          phone: formData.phone,
          firstName,
          lastName,
          cep: formData.cep
        }, params);
        await sendToCapi(payload, config.accessToken, config.pixelId);
      }
    } else if (step === 2) {
      const selectedPlan = plansToUse.find(p => p.id === formData.planId);
      const params = { 
        content_name: selectedPlan?.name || 'Plan Selection', 
        content_ids: [formData.planId],
        content_type: 'product',
        value: selectedPlan?.price || 0 
      };
      trackPixelEvent('ViewContent', params, eventId);
      
      if (config) {
        const [firstName, ...lastNameParts] = formData.name.split(' ');
        const payload = await prepareCapiPayload('ViewContent', eventId, {
          email: formData.email, phone: formData.phone, firstName, lastName: lastNameParts.join(' '), cep: formData.cep
        }, params);
        await sendToCapi(payload, config.accessToken, config.pixelId);
      }
    } else if (step === 3) {
      const params = { content_name: 'Source Selection', value: 0 };
      trackPixelEvent('AddToCart', params, eventId);
    }

    setStep(step + 1);
  };

  const finish = async () => {
    const eventId = generateEventId();
    const selectedPlan = plansToUse.find(p => p.id === formData.planId);
    const params = {
      content_name: 'Purchase Confirmation',
      value: selectedPlan?.price || 0,
      currency: 'BRL',
      content_ids: [formData.planId]
    };

    trackPixelEvent('Purchase', params, eventId);
    
    if (config) {
        const [firstName, ...lastNameParts] = formData.name.split(' ');
        const payload = await prepareCapiPayload('Purchase', eventId, {
          email: formData.email, phone: formData.phone, firstName, lastName: lastNameParts.join(' '), cep: formData.cep
        }, params);
        await sendToCapi(payload, config.accessToken, config.pixelId);
    }

    const newLead = {
      id: `lead_${Math.random().toString(36).substr(2, 9)}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      plan: selectedPlan?.name,
      val: selectedPlan?.price,
      date: new Date().toISOString().split('T')[0],
      status: 'Pendente',
      sellerId: config?.sellerId || 'demo_operation'
    };
    const savedLeads = JSON.parse(localStorage.getItem('cp_leads_multi') || '[]');
    localStorage.setItem('cp_leads_multi', JSON.stringify([newLead, ...savedLeads]));

    alert('ACESSO_LIBERADO: Sincronizando com Central de Suporte...');
    window.location.href = `https://wa.me/55${formData.phone.replace(/\D/g,'')}?text=Olá, acabei de assinar o plano ${selectedPlan?.name}. TECHVIEW Protocolo: ${eventId}`;
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,191,255,0.08)_0%,_transparent_70%)] pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-[#0A0A0A] border-2 border-[#1A1A1A] rounded-[3rem] shadow-[0_0_50px_rgba(0,191,255,0.1)] overflow-hidden">
          <div className="bg-black p-10 border-b border-[#1A1A1A] text-center">
            <div className="w-20 h-20 bg-black border border-[#00BFFF]/30 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(0,191,255,0.2)] overflow-hidden">
              <img src="https://i.imgur.com/gMYZa1W.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-3xl font-sci-fi font-black tracking-tighter text-white neon-glow">{config?.userName || 'TECHVIEW'}</h2>
            <p className="text-[#00BFFF] mt-2 font-black uppercase tracking-[0.3em] text-[9px]">Interface de Assinatura de Elite</p>
          </div>

          {/* Stepper HUD */}
          <div className="flex justify-between px-10 py-8 bg-[#050505] border-b border-[#1A1A1A]">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all border-2 ${
                  step >= s ? 'border-[#00BFFF] bg-[#00BFFF] text-black shadow-[0_0_15px_#00BFFF]' : 'border-[#1A1A1A] bg-black text-slate-700'
                }`}>
                  {s === 1 && <i className="fa-solid fa-id-badge"></i>}
                  {s === 2 && <i className="fa-solid fa-bolt"></i>}
                  {s === 3 && <i className="fa-solid fa-satellite-dish"></i>}
                  {s === 4 && <i className="fa-solid fa-lock-open"></i>}
                </div>
              </div>
            ))}
          </div>

          <div className="p-10">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] ml-1">Protocolo_Nome</label>
                    <input 
                      className="w-full bg-black border-2 border-[#1A1A1A] rounded-2xl px-6 py-4 outline-none focus:border-[#00BFFF] transition-all font-black text-white text-xs uppercase" 
                      placeholder="Nome completo"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] ml-1">Terminal_WhatsApp</label>
                        <input 
                          className="w-full bg-black border-2 border-[#1A1A1A] rounded-2xl px-6 py-4 outline-none focus:border-[#00BFFF] transition-all font-black text-white text-xs" 
                          placeholder="(00) 00000-0000"
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] ml-1">Local_CEP</label>
                        <input 
                          className="w-full bg-black border-2 border-[#1A1A1A] rounded-2xl px-6 py-4 outline-none focus:border-[#00BFFF] transition-all font-black text-white text-xs" 
                          placeholder="00000-000"
                          value={formData.cep}
                          onChange={e => setFormData({...formData, cep: e.target.value})}
                        />
                     </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] ml-1">Neural_Email</label>
                    <input 
                      className="w-full bg-black border-2 border-[#1A1A1A] rounded-2xl px-6 py-4 outline-none focus:border-[#00BFFF] transition-all font-black text-white text-xs" 
                      placeholder="email@operacao.com"
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                <button 
                  onClick={nextStep}
                  disabled={!formData.name || !formData.email || !formData.phone}
                  className="w-full bg-[#00BFFF] text-black font-sci-fi font-black py-5 rounded-2xl mt-4 hover:scale-[1.02] disabled:opacity-30 shadow-[0_0_20px_rgba(0,191,255,0.3)] transition-all uppercase tracking-widest text-[11px]"
                >
                  SINCRONIZAR_PLANOS
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="max-h-[350px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
                  {plansToUse.map(plan => (
                    <div 
                      key={plan.id}
                      onClick={() => setFormData({...formData, planId: plan.id})}
                      className={`p-6 border-2 rounded-[1.5rem] cursor-pointer transition-all flex justify-between items-center ${
                        formData.planId === plan.id ? 'border-[#00BFFF] bg-[#00BFFF]/10 shadow-[0_0_15px_rgba(0,191,255,0.1)]' : 'border-[#1A1A1A] bg-black hover:border-[#333]'
                      }`}
                    >
                      <div>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${plan.screens > 1 ? 'bg-amber-900/20 text-amber-500' : 'bg-[#00BFFF]/20 text-[#00BFFF]'}`}>
                          {plan.screens} TELA(S)
                        </span>
                        <p className="font-black text-white uppercase tracking-tighter mt-1">{plan.name.split(' (')[0]}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-sci-fi font-black text-[#00BFFF] text-lg">R$ {plan.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 mt-8">
                  <button onClick={() => setStep(1)} className="flex-1 font-black text-slate-600 hover:text-white py-4 transition-colors text-[10px] uppercase tracking-widest">BACK</button>
                  <button 
                    onClick={nextStep} 
                    disabled={!formData.planId}
                    className="flex-[2] bg-[#00BFFF] text-black font-sci-fi font-black py-5 rounded-2xl shadow-[0_0_15px_rgba(0,191,255,0.2)] uppercase tracking-widest text-[11px]"
                  >
                    CONFIRMAR
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-[10px] font-black text-center text-slate-400 uppercase tracking-[0.4em] mb-6">ORIGEM_DE_SINAL</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['Google', 'Facebook', 'Instagram', 'Indicação', 'Network', 'Outros'].map(source => (
                    <button 
                      key={source}
                      onClick={() => setFormData({...formData, source})}
                      className={`py-4 border-2 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest ${
                        formData.source === source ? 'bg-[#00BFFF] text-black border-[#00BFFF] shadow-[0_0_15px_#00BFFF]' : 'bg-black border-[#1A1A1A] text-slate-700'
                      }`}
                    >
                      {source}
                    </button>
                  ))}
                </div>
                <div className="flex gap-4 mt-8">
                  <button onClick={() => setStep(2)} className="flex-1 font-black text-slate-600 py-4 text-[10px] uppercase tracking-widest">BACK</button>
                  <button 
                    onClick={nextStep} 
                    disabled={!formData.source}
                    className="flex-[2] bg-[#00BFFF] text-black font-sci-fi font-black py-5 rounded-2xl shadow-[0_0_15px_rgba(0,191,255,0.2)] uppercase tracking-widest text-[11px]"
                  >
                    REVISAR
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="bg-black border border-[#00BFFF]/20 rounded-[2rem] p-8 text-white space-y-6 shadow-2xl relative overflow-hidden">
                  <div className="relative z-10 flex justify-between items-start">
                    <div>
                      <p className="text-[#00BFFF] text-[8px] font-black uppercase tracking-[0.3em] mb-1">PROTOCOLO_SELECIONADO</p>
                      <h4 className="text-2xl font-sci-fi font-black uppercase tracking-tighter">
                        {plansToUse.find(p => p.id === formData.planId)?.name.split(' (')[0]}
                      </h4>
                    </div>
                    <div className="w-12 h-12 bg-[#00BFFF]/10 border border-[#00BFFF]/20 rounded-2xl flex items-center justify-center text-[#00BFFF]">
                      <i className="fa-solid fa-crown"></i>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-[#1A1A1A] flex justify-between items-end">
                    <div>
                      <p className="text-slate-600 text-[8px] font-black uppercase tracking-[0.3em] mb-1">TARIFA_FINAL</p>
                      <p className="text-3xl font-sci-fi font-black text-[#00BFFF] neon-glow">R$ {plansToUse.find(p => p.id === formData.planId)?.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="absolute right-0 top-0 p-4 opacity-5 pointer-events-none">
                    <i className="fa-solid fa-receipt text-[120px]"></i>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button onClick={() => setStep(3)} className="flex-1 font-black text-slate-600 py-4 text-[10px] uppercase tracking-widest">EDIT</button>
                  <button 
                    onClick={finish} 
                    className="flex-[3] bg-[#00BFFF] text-black font-sci-fi font-black py-5 rounded-2xl shadow-[0_0_20px_#00BFFF] flex items-center justify-center gap-3 transform active:scale-95 transition-all uppercase tracking-widest text-[11px]"
                  >
                    <i className="fa-solid fa-shield-halved"></i>
                    ATIVAR_AGORA
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-10 flex flex-col items-center gap-6 animate-in fade-in duration-1000">
           <div className="flex items-center gap-10">
              <div className="flex flex-col items-center opacity-30">
                 <i className="fa-solid fa-shield-check text-slate-500 mb-1"></i>
                 <span className="text-[7px] font-black uppercase tracking-[0.3em] text-slate-500">ENCRYPTED</span>
              </div>
              <div className="flex flex-col items-center opacity-30">
                 <i className="fa-solid fa-wave-square text-slate-500 mb-1"></i>
                 <span className="text-[7px] font-black uppercase tracking-[0.3em] text-slate-500">STABLE</span>
              </div>
              <div className="flex flex-col items-center opacity-30">
                 <i className="fa-solid fa-user-astronaut text-slate-500 mb-1"></i>
                 <span className="text-[7px] font-black uppercase tracking-[0.3em] text-slate-500">ELITE</span>
              </div>
           </div>
           <p className="text-slate-800 text-[8px] font-black uppercase tracking-[0.5em] flex items-center gap-3">
             <span className="w-1.5 h-1.5 rounded-full bg-[#00BFFF] animate-pulse"></span>
             META_NETWORK_LINK_ACTIVE_V3.1
           </p>
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;

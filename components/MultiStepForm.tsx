
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

    // Save lead to system locally (simulating database write)
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

    alert('Assinatura confirmada! Redirecionando para o suporte...');
    window.location.href = `https://wa.me/55${formData.phone.replace(/\D/g,'')}?text=Olá, acabei de assinar o plano ${selectedPlan?.name}`;
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white">
        <div className="bg-indigo-600 p-10 text-white text-center">
          <h2 className="text-3xl font-black tracking-tight">{config?.userName || 'TechView IPTV'}</h2>
          <p className="text-indigo-100 mt-2 font-medium opacity-80">Qualidade 4K & Estabilidade Premium</p>
        </div>

        {/* Progress Tracker */}
        <div className="flex justify-between px-10 py-8 bg-slate-50 border-b border-dashed">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all ${
                step >= s ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'bg-white border text-gray-300'
              }`}>
                {s === 1 && <i className="fa-solid fa-user"></i>}
                {s === 2 && <i className="fa-solid fa-tv"></i>}
                {s === 3 && <i className="fa-solid fa-compass"></i>}
                {s === 4 && <i className="fa-solid fa-check-double"></i>}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${step >= s ? 'text-indigo-600' : 'text-gray-300'}`}>
                {s === 1 && 'Dados'}
                {s === 2 && 'Planos'}
                {s === 3 && 'Origem'}
                {s === 4 && 'Fim'}
              </span>
            </div>
          ))}
        </div>

        <div className="p-10">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome Completo</label>
                  <input 
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold" 
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp</label>
                      <input 
                        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold" 
                        placeholder="(00) 00000-0000"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">CEP</label>
                      <input 
                        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold" 
                        placeholder="00000-000"
                        value={formData.cep}
                        onChange={e => setFormData({...formData, cep: e.target.value})}
                      />
                   </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">E-mail</label>
                  <input 
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold" 
                    placeholder="email@exemplo.com"
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              <button 
                onClick={nextStep}
                disabled={!formData.name || !formData.email || !formData.phone}
                className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl mt-4 hover:bg-indigo-700 disabled:opacity-50 shadow-xl shadow-indigo-100 transform active:scale-95 transition-all uppercase tracking-widest"
              >
                ESCOLHER PLANO
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
                    className={`p-5 border-2 rounded-[1.5rem] cursor-pointer transition-all flex justify-between items-center group ${
                      formData.planId === plan.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-50 bg-gray-50 hover:border-indigo-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${plan.screens > 1 ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
                          {plan.screens} Tela{plan.screens > 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="font-black text-slate-800 leading-none">{plan.name.split(' (')[0]}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-indigo-600 text-lg leading-none">R$ {plan.price.toFixed(2)}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Plano Ativo</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-6">
                <button onClick={() => setStep(1)} className="flex-1 font-black text-gray-400 hover:text-slate-600 py-4 transition-colors">VOLTAR</button>
                <button 
                  onClick={nextStep} 
                  disabled={!formData.planId}
                  className="flex-[2] bg-indigo-600 text-white font-black py-5 rounded-2xl disabled:opacity-50 shadow-xl shadow-indigo-100 uppercase tracking-widest"
                >
                  CONTINUAR
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-lg font-black text-center text-slate-800 mb-6 uppercase tracking-widest">Como nos conheceu?</h3>
              <div className="grid grid-cols-2 gap-3">
                {['Google', 'Facebook', 'Instagram', 'Indicação', 'WhatsApp', 'Outros'].map(source => (
                  <button 
                    key={source}
                    onClick={() => setFormData({...formData, source})}
                    className={`py-4 px-4 border-2 rounded-2xl text-xs font-black transition-all uppercase tracking-widest ${
                      formData.source === source ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white border-gray-50 hover:border-indigo-100 text-gray-400'
                    }`}
                  >
                    {source}
                  </button>
                ))}
              </div>
              <div className="flex gap-4 mt-8 pt-4">
                <button onClick={() => setStep(2)} className="flex-1 font-black text-gray-400 py-4">VOLTAR</button>
                <button 
                  onClick={nextStep} 
                  disabled={!formData.source}
                  className="flex-[2] bg-indigo-600 text-white font-black py-5 rounded-2xl disabled:opacity-50 shadow-xl shadow-indigo-100 uppercase tracking-widest"
                >
                  REVISAR PEDIDO
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="bg-slate-900 rounded-[2rem] p-8 text-white space-y-6 shadow-2xl relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <p className="text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-1">Assinatura Selecionada</p>
                    <h4 className="text-2xl font-black">
                      {plansToUse.find(p => p.id === formData.planId)?.name}
                    </h4>
                  </div>
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <i className="fa-solid fa-crown text-amber-400"></i>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                  <div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total à Pagar</p>
                    <p className="text-3xl font-black text-white">R$ {plansToUse.find(p => p.id === formData.planId)?.price.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 text-xs font-black uppercase tracking-widest">Ativação Instantânea</p>
                  </div>
                </div>
                <div className="absolute right-0 top-0 p-4 opacity-5 pointer-events-none">
                  <i className="fa-solid fa-receipt text-[100px]"></i>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button onClick={() => setStep(3)} className="flex-1 font-black text-gray-400 hover:text-slate-600 py-4">EDITAR</button>
                <button 
                  onClick={finish} 
                  className="flex-[3] bg-emerald-500 text-white font-black py-5 rounded-2xl hover:bg-emerald-600 shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 transition-all transform active:scale-95 uppercase tracking-widest"
                >
                  <i className="fa-solid fa-shield-check"></i>
                  CONFIRMAR AGORA
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-10 flex flex-col items-center gap-4 animate-in fade-in duration-1000">
         <div className="flex items-center gap-6">
            <div className="flex flex-col items-center opacity-40">
               <i className="fa-solid fa-lock text-sm mb-1 text-slate-500"></i>
               <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">Secure</span>
            </div>
            <div className="flex flex-col items-center opacity-40">
               <i className="fa-solid fa-clock text-sm mb-1 text-slate-500"></i>
               <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">Instant</span>
            </div>
            <div className="flex flex-col items-center opacity-40">
               <i className="fa-solid fa-shield-halved text-sm mb-1 text-slate-500"></i>
               <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">Private</span>
            </div>
         </div>
         <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
           Rastreamento Meta CAPI v3.0 Ativo
         </p>
      </div>
    </div>
  );
};

export default MultiStepForm;

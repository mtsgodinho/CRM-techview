
import React, { useState, useMemo, useEffect } from 'react';
import { UserRole, Plan } from '../types';
import { DEFAULT_PLANS } from '../utils';

interface LeadManagerProps {
  sellerId: string;
  userRole: UserRole;
}

const LeadManager: React.FC<LeadManagerProps> = ({ sellerId, userRole }) => {
  const isAdmin = userRole === 'ADMIN';

  const [allLeads, setAllLeads] = useState(() => {
    const saved = localStorage.getItem('cp_leads_multi');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', email: '', phone: '', planId: DEFAULT_PLANS[0].id });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load current seller plans
  const sellerPlans = useMemo(() => {
    const allConfigs = JSON.parse(localStorage.getItem('cp_configs') || '{}');
    return allConfigs[sellerId]?.plans || DEFAULT_PLANS;
  }, [sellerId]);

  useEffect(() => {
    localStorage.setItem('cp_leads_multi', JSON.stringify(allLeads));
  }, [allLeads]);

  const leadsToView = useMemo(() => {
    return isAdmin ? allLeads : allLeads.filter((l: any) => l.sellerId === sellerId);
  }, [allLeads, sellerId, isAdmin]);

  const filteredLeads = useMemo(() => {
    return leadsToView.filter((l: any) => 
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone.includes(searchTerm)
    );
  }, [leadsToView, searchTerm]);

  const handleExportCSV = () => {
    const headers = ['Nome', 'Email', 'Telefone', 'Plano', 'Data', 'Status', 'Valor', 'ID Vendedor'];
    const rows = filteredLeads.map((l: any) => [
      `"${l.name}"`, `"${l.email}"`, `"${l.phone}"`, `"${l.plan}"`, `"${l.date}"`, `"${l.status}"`, l.val, `"${l.sellerId}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads_${isAdmin ? 'admin_global' : sellerId}_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPlan = sellerPlans.find((p: Plan) => p.id === newLead.planId);
    const lead = {
      name: newLead.name,
      email: newLead.email,
      phone: newLead.phone,
      id: `lead_${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Novo',
      plan: selectedPlan?.name || 'Manual',
      val: selectedPlan?.price || 0,
      sellerId: isAdmin ? 'ADMIN_DIRECT' : sellerId
    };

    const updatedLeads = [lead, ...allLeads];
    setAllLeads(updatedLeads);
    setShowModal(false);
    setNewLead({ name: '', email: '', phone: '', planId: DEFAULT_PLANS[0].id });
  };

  const executeDelete = () => {
    if (deletingId) {
      const updatedLeads = allLeads.filter((l: any) => l.id !== deletingId);
      setAllLeads(updatedLeads);
      setDeletingId(null);
    }
  };

  return (
    <div className="relative animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="relative w-full md:w-96">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input 
            type="text" 
            placeholder="Buscar por nome, email ou whatsapp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all font-medium"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
           <button 
             onClick={handleExportCSV} 
             className="flex-1 md:flex-none px-6 py-3 border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-all"
           >
              <i className="fa-solid fa-file-csv text-indigo-600"></i> Exportar
           </button>
           <button 
             onClick={() => setShowModal(true)} 
             className="flex-1 md:flex-none px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-black hover:bg-indigo-700 flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 transition-all transform active:scale-95"
           >
              <i className="fa-solid fa-plus"></i> NOVO LEAD
           </button>
        </div>
      </div>

      <div className="overflow-hidden border rounded-[2.5rem] shadow-sm bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b">
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cliente</th>
              {isAdmin && <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Origem</th>}
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Plano</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Valor</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredLeads.map((lead: any) => (
              <tr key={lead.id} className="hover:bg-indigo-50/20 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-sm transition-transform group-hover:scale-110">
                      {lead.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black text-gray-800 leading-tight mb-1">{lead.name}</p>
                      <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">{lead.email}</p>
                    </div>
                  </div>
                </td>
                {isAdmin && (
                  <td className="px-8 py-6">
                    <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                      {lead.sellerId.includes('ADMIN') ? 'Interno' : 'Vendedor'}
                    </span>
                  </td>
                )}
                <td className="px-8 py-6 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    lead.plan?.includes('Ouro') || lead.plan?.includes('Gold') || lead.plan?.includes('Anual') ? 'bg-amber-100 text-amber-700 border border-amber-200' : 
                    lead.plan?.includes('Prata') || lead.plan?.includes('Silver') || lead.plan?.includes('Semestral') ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-orange-100 text-orange-700 border border-orange-200'
                  }`}>
                    {lead.plan}
                  </span>
                </td>
                <td className="px-8 py-6">
                   <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${lead.status === 'Converted' ? 'bg-green-500' : lead.status === 'Pending' ? 'bg-amber-500' : 'bg-indigo-500 animate-pulse'}`}></div>
                      <span className="text-xs font-black text-gray-600 uppercase tracking-wider">{lead.status}</span>
                   </div>
                </td>
                <td className="px-8 py-6 text-sm font-black text-gray-900 text-center">
                  R$ {lead.val.toFixed(2)}
                </td>
                <td className="px-8 py-6 text-right">
                   <div className="flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        title="Chamar no WhatsApp"
                        className="w-10 h-10 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm border border-emerald-100" 
                        onClick={() => window.open(`https://wa.me/${lead.phone.replace(/\D/g, '')}`, '_blank')}
                      >
                        <i className="fa-brands fa-whatsapp text-lg"></i>
                      </button>
                      <button 
                        title="Excluir Lead"
                        onClick={() => setDeletingId(lead.id)} 
                        className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-rose-100"
                      >
                        <i className="fa-solid fa-trash-can text-sm"></i>
                      </button>
                   </div>
                </td>
              </tr>
            ))}
            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 6 : 5} className="px-8 py-32 text-center">
                   <div className="flex flex-col items-center gap-4 text-gray-300">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center border-2 border-dashed border-gray-200">
                        <i className="fa-solid fa-folder-open text-4xl"></i>
                      </div>
                      <div>
                        <p className="text-xl font-black text-gray-400">Nenhum lead registrado</p>
                      </div>
                      <button onClick={() => setShowModal(true)} className="text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline mt-2">Adicionar Primeiro Lead</button>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {deletingId && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-sm overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fa-solid fa-trash-can text-3xl"></i>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Tem certeza?</h3>
              <p className="text-gray-500 text-sm font-medium px-4">Esta ação removerá permanentemente o cliente da base de dados.</p>
            </div>
            <div className="flex gap-4 p-8 bg-gray-50 border-t">
              <button onClick={() => setDeletingId(null)} className="flex-1 py-4 font-black text-gray-400 hover:text-gray-600 uppercase tracking-widest text-xs">Voltar</button>
              <button onClick={executeDelete} className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-black shadow-lg shadow-rose-100 hover:bg-rose-600 transform active:scale-95 transition-all uppercase tracking-widest text-xs">Excluir</button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500">
            <div className="bg-indigo-600 p-10 text-white relative">
              <h3 className="text-3xl font-black leading-tight tracking-tight">Novo Registro<br/>de Cliente</h3>
              <button onClick={() => setShowModal(false)} className="absolute top-10 right-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleAddLead} className="p-10 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Nome do Cliente</label>
                <input required type="text" placeholder="Ex: João Silva" className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold" value={newLead.name} onChange={e => setNewLead({...newLead, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">WhatsApp</label>
                  <input required type="text" placeholder="(00) 00000-0000" className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold" value={newLead.phone} onChange={e => setNewLead({...newLead, phone: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Plano</label>
                  <select className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-indigo-500 transition-all font-black appearance-none" value={newLead.planId} onChange={e => setNewLead({...newLead, planId: e.target.value})}>
                    {sellerPlans.map((p: Plan) => (
                      <option key={p.id} value={p.id}>{p.name} - R${p.price.toFixed(2)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">E-mail</label>
                <input required type="email" placeholder="joao@email.com" className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold" value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transform active:scale-95 transition-all uppercase tracking-widest text-sm mt-4">
                CRIAR LEAD AGORA
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadManager;

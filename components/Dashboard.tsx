
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { UserRole } from '../types';

interface DashboardProps {
  userRole?: UserRole;
  sellerId?: string;
}

const data = [
  { name: 'Seg', leads: 400, conv: 240 },
  { name: 'Ter', leads: 300, conv: 139 },
  { name: 'Qua', leads: 200, conv: 980 },
  { name: 'Qui', leads: 278, conv: 390 },
  { name: 'Sex', leads: 189, conv: 480 },
  { name: 'Sáb', leads: 239, conv: 380 },
  { name: 'Dom', leads: 349, conv: 430 },
];

const Dashboard: React.FC<DashboardProps> = ({ userRole = 'SELLER', sellerId }) => {
  const isAdmin = userRole === 'ADMIN';

  const stats = useMemo(() => {
    // In a real app, these would be calculated from real data
    const allLeads = JSON.parse(localStorage.getItem('cp_leads_multi') || '[]');
    const myLeads = isAdmin ? allLeads : allLeads.filter((l: any) => l.sellerId === sellerId);
    
    return [
      { label: isAdmin ? 'Leads Globais' : 'Meus Leads', val: myLeads.length.toLocaleString(), icon: 'fa-users', color: 'indigo' },
      { label: 'Conversões', val: Math.floor(myLeads.length * 0.32).toString(), icon: 'fa-cart-shopping', color: 'emerald' },
      { label: 'Event Match Quality', val: isAdmin ? '9.9/10' : '9.8/10', icon: 'fa-star', color: 'amber' },
      { label: isAdmin ? 'ROAS Médio Rede' : 'Meu ROAS', val: '4.2x', icon: 'fa-money-bill-trend-up', color: 'indigo' },
    ];
  }, [isAdmin, sellerId]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {isAdmin && (
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-2">Visão Global da Operação</h2>
            <p className="text-indigo-200 text-sm max-w-lg">Você está visualizando métricas agregadas de todos os vendedores ativos na plataforma.</p>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <i className="fa-solid fa-earth-americas text-[180px] translate-y-10 translate-x-10"></i>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
               <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 flex items-center justify-center`}>
                  <i className={`fa-solid ${stat.icon} text-${stat.color}-600 text-lg`}></i>
               </div>
               <span className="text-[10px] font-black text-green-500 bg-green-50 px-2.5 py-1 rounded-full">+12%</span>
            </div>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-black mt-1 text-gray-800">{stat.val}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
          <h3 className="text-lg font-black mb-6 flex items-center gap-3 text-gray-800">
            <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
            Fluxo de Performance {isAdmin ? 'Agregada' : 'Individual'}
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700, fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700, fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="leads" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={24} />
                <Bar dataKey="conv" fill="#10b981" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
          <h3 className="text-lg font-black mb-6 flex items-center gap-3 text-gray-800">
             <div className="w-2 h-6 bg-amber-500 rounded-full"></div>
             Integridade Meta CAPI (Qualidade)
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700, fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700, fontSize: 12}} />
                <Tooltip 
                   contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Line type="monotone" dataKey="leads" stroke="#6366f1" strokeWidth={4} dot={{ r: 6, fill: '#6366f1', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-black flex items-center gap-3 text-gray-800">
            <div className="w-2 h-6 bg-slate-900 rounded-full"></div>
            Relatórios Integrados (Looker Studio)
          </h3>
          <button className="text-xs text-indigo-600 font-black hover:underline tracking-widest uppercase">Full Screen</button>
        </div>
        <div className="aspect-video w-full bg-slate-50 rounded-3xl border-2 border-dashed border-gray-100 flex items-center justify-center relative overflow-hidden group">
          <iframe 
            width="100%" 
            height="100%" 
            src="https://lookerstudio.google.com/embed/reporting/00000000-0000-0000-0000-000000000000/page/1M" 
            frameBorder="0" 
            style={{ border: 0 }} 
            allowFullScreen
            title="Google Looker Studio Report"
            className="group-hover:opacity-50 transition-opacity"
          ></iframe>
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
             <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-2xl shadow-xl text-xs font-black uppercase tracking-widest text-indigo-600 border border-indigo-100">
               Relatório Corporativo Protegido
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

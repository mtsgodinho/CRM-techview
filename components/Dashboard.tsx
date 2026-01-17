
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { UserRole } from '../types';

interface DashboardProps {
  userRole?: UserRole;
  sellerId?: string;
}

const data = [
  { name: 'SEC_01', leads: 400, conv: 240 },
  { name: 'SEC_02', leads: 300, conv: 139 },
  { name: 'SEC_03', leads: 200, conv: 980 },
  { name: 'SEC_04', leads: 278, conv: 390 },
  { name: 'SEC_05', leads: 189, conv: 480 },
  { name: 'SEC_06', leads: 239, conv: 380 },
  { name: 'SEC_07', leads: 349, conv: 430 },
];

const Dashboard: React.FC<DashboardProps> = ({ userRole = 'SELLER', sellerId }) => {
  const isAdmin = userRole === 'ADMIN';

  const stats = useMemo(() => {
    const allLeads = JSON.parse(localStorage.getItem('cp_leads_multi') || '[]');
    const myLeads = isAdmin ? allLeads : allLeads.filter((l: any) => l.sellerId === sellerId);
    return [
      { label: 'Unidades Lead', val: myLeads.length.toLocaleString(), icon: 'fa-crosshairs', color: 'blue' },
      { label: 'Conversões Ativas', val: Math.floor(myLeads.length * 0.32).toString(), icon: 'fa-satellite-dish', color: 'blue' },
      { label: 'Match Score', val: '9.9/10', icon: 'fa-shield-virus', color: 'blue' },
      { label: 'Network ROAS', val: '4.2x', icon: 'fa-bolt-lightning', color: 'blue' },
    ];
  }, [isAdmin, sellerId]);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#0A0A0A] border border-[#1A1A1A] p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group hover:border-[#00BFFF]/40 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#00BFFF]/5 blur-3xl rounded-full -translate-y-12 translate-x-12"></div>
            <div className="flex justify-between items-start mb-6">
               <div className="w-12 h-12 rounded-2xl bg-black border border-[#1A1A1A] flex items-center justify-center shadow-inner group-hover:shadow-[0_0_15px_rgba(0,191,255,0.2)] transition-all">
                  <i className={`fa-solid ${stat.icon} text-[#00BFFF] text-lg`}></i>
               </div>
               <span className="text-[9px] font-black text-[#00BFFF] uppercase tracking-widest">+12%_VAR</span>
            </div>
            <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.3em] mb-1">{stat.label}</p>
            <h3 className="text-3xl font-sci-fi font-black text-white neon-glow">{stat.val}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-10 rounded-[3rem] shadow-2xl">
          <h3 className="text-[11px] font-sci-fi font-black mb-10 flex items-center gap-4 text-white uppercase tracking-widest">
            <span className="w-4 h-1 bg-[#00BFFF] rounded-full"></span>
            Performance_Data_Grid
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1A1A1A" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#444', fontWeight: 900, fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#444', fontWeight: 900, fontSize: 10}} />
                <Tooltip 
                  cursor={{fill: '#111'}}
                  contentStyle={{backgroundColor: '#000', borderRadius: '20px', border: '1px solid #1A1A1A', color: '#fff', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase'}}
                />
                <Bar dataKey="leads" fill="#00BFFF" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="conv" fill="#005f7a" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-10 rounded-[3rem] shadow-2xl">
          <h3 className="text-[11px] font-sci-fi font-black mb-10 flex items-center gap-4 text-white uppercase tracking-widest">
             <span className="w-4 h-1 bg-white rounded-full"></span>
             Neural_Sync_Integrity
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1A1A1A" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#444', fontWeight: 900, fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#444', fontWeight: 900, fontSize: 10}} />
                <Tooltip 
                   contentStyle={{backgroundColor: '#000', borderRadius: '20px', border: '1px solid #1A1A1A', color: '#fff', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase'}}
                />
                <Line type="monotone" dataKey="leads" stroke="#00BFFF" strokeWidth={5} dot={{ r: 6, fill: '#00BFFF', strokeWidth: 4, stroke: '#000' }} activeDot={{ r: 9, shadow: '0 0 20px #00BFFF' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-10 relative z-10">
          <h3 className="text-[11px] font-sci-fi font-black flex items-center gap-4 text-white uppercase tracking-widest">
            <span className="w-4 h-1 bg-[#00BFFF] rounded-full"></span>
            Telemetry_Visualizer_Looker
          </h3>
          <button className="text-[9px] text-[#00BFFF] font-black uppercase tracking-[0.3em] hover:neon-glow transition-all">Expand_Module</button>
        </div>
        <div className="aspect-video w-full bg-black rounded-[2.5rem] border-2 border-[#1A1A1A] border-dashed flex items-center justify-center relative group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
          <div className="flex flex-col items-center gap-6 opacity-40 group-hover:opacity-100 transition-opacity">
             <i className="fa-solid fa-satellite text-6xl text-[#00BFFF] animate-pulse"></i>
             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Módulo de Telemetria Criptografado</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

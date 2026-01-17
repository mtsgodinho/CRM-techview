
import React from 'react';
import { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  userName: string;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, userRole, userName, onLogout }) => {
  const isAdmin = userRole === 'ADMIN';

  const menuItems = [
    { id: 'dashboard', label: isAdmin ? 'Painel Global' : 'Dashboard', icon: 'fa-gauge-high' },
    { id: 'leads', label: 'Lista de Leads', icon: 'fa-user-secret' },
    { id: 'tracking', label: 'CAPI Network', icon: 'fa-satellite' },
    { id: 'ai', label: 'IA Creative', icon: 'fa-brain' },
  ];

  return (
    <aside className="w-64 bg-black text-white fixed h-full flex flex-col border-r border-[#1A1A1A] z-40">
      <div className="p-10 flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-[#00BFFF] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(0,191,255,0.4)]">
           <i className="fa-solid fa-user-astronaut text-2xl text-black"></i>
        </div>
        <span className="text-2xl font-black tracking-tighter font-sci-fi text-[#00BFFF] neon-glow">TECHVIEW</span>
      </div>

      <nav className="flex-1 mt-4 px-6 space-y-2">
        {isAdmin && (
          <div className="mb-8">
            <p className="px-4 text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] mb-3">Protocolos Admin</p>
            <button
              onClick={() => setActiveTab('accounts')}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all border ${
                activeTab === 'accounts' 
                  ? 'bg-[#00BFFF] text-black border-[#00BFFF] shadow-[0_0_15px_rgba(0,191,255,0.2)]' 
                  : 'text-slate-500 hover:text-white border-transparent hover:border-[#1A1A1A] hover:bg-[#0A0A0A]'
              }`}
            >
              <i className="fa-solid fa-shield-halved w-5 text-sm"></i>
              <span className="font-black text-[11px] uppercase tracking-widest">Gestão Rede</span>
            </button>
          </div>
        )}

        <p className="px-4 text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] mb-3">Operação de Campo</p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all border ${
              activeTab === item.id 
                ? 'bg-[#1A1A1A] text-[#00BFFF] border-[#00BFFF]/20 shadow-[0_0_10px_rgba(0,191,255,0.1)]' 
                : 'text-slate-500 hover:text-white border-transparent hover:border-[#1A1A1A] hover:bg-[#0A0A0A]'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-5 text-sm ${activeTab === item.id ? 'text-[#00BFFF]' : ''}`}></i>
            <span className="font-black text-[11px] uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-8 space-y-4">
        <div className="bg-[#0A0A0A] p-4 rounded-2xl flex items-center gap-3 border border-[#1A1A1A]">
          <div className="w-10 h-10 rounded-xl bg-[#00BFFF] flex items-center justify-center text-black font-black text-xs">
            {userName[0].toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] font-black text-white truncate uppercase tracking-tighter">{userName}</p>
            <p className="text-[8px] text-[#00BFFF] font-black uppercase tracking-[0.2em]">{userRole}</p>
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-600 hover:text-rose-500 hover:bg-rose-500/5 transition-all font-black text-[10px] uppercase tracking-widest"
        >
          <i className="fa-solid fa-power-off w-5"></i>
          Encerrar
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

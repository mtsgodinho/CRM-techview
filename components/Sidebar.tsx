
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
    { id: 'dashboard', label: isAdmin ? 'Visão Global' : 'Dashboard', icon: 'fa-chart-line' },
    { id: 'leads', label: 'Clientes & Leads', icon: 'fa-users' },
    { id: 'tracking', label: 'Rastreamento', icon: 'fa-crosshairs' },
    { id: 'ai', label: 'IA Creative Hub', icon: 'fa-wand-magic-sparkles' },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-white fixed h-full flex flex-col border-r border-slate-800/50 z-40">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
          <i className="fa-solid fa-rocket text-xl text-white"></i>
        </div>
        <span className="text-xl font-black tracking-tight">ConversionPro</span>
      </div>

      <nav className="flex-1 mt-4 px-4 space-y-1.5">
        {/* Admin Exclusive Section */}
        {isAdmin && (
          <div className="mb-6">
            <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Administração</p>
            <button
              onClick={() => setActiveTab('accounts')}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
                activeTab === 'accounts' 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <i className="fa-solid fa-user-gear w-5 text-sm"></i>
              <span className="font-bold text-sm">Gerenciar Vendedores</span>
            </button>
          </div>
        )}

        <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Operação</p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
              activeTab === item.id 
                ? 'bg-white/10 text-white border border-white/10' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-5 text-sm`}></i>
            <span className="font-bold text-sm tracking-wide">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 space-y-3">
        <div className="bg-slate-900/50 p-4 rounded-2xl flex items-center gap-3 border border-slate-800/50">
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-indigo-600/20">
            {userName[0]}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate leading-none mb-1">{userName}</p>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{userRole}</p>
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all font-bold text-sm"
        >
          <i className="fa-solid fa-right-from-bracket w-5"></i>
          Sair do Sistema
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;


import React, { useState, useEffect, useRef } from 'react';
import Dashboard from './components/Dashboard';
import TrackingSetup from './components/TrackingSetup';
import LeadManager from './components/LeadManager';
import AICreativeStudio from './components/AICreativeStudio';
import MultiStepForm from './components/MultiStepForm';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import { UserConfig, UserAccount } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<UserAccount | null>(null);
  const [config, setConfig] = useState<UserConfig | null>(null);
  const [isFormView, setIsFormView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Lead Identificado', message: 'Assinatura Ouro detectada via API.', time: 'há 2 min', icon: 'fa-user-shield', color: 'blue', read: false },
    { id: 2, title: 'Network Online', message: 'Sincronização CAPI concluída com sucesso.', time: 'há 1 hora', icon: 'fa-check-double', color: 'blue', read: false },
    { id: 3, title: 'Alerta IA', message: 'Análise de ROAS sugere aumento de pauta.', time: 'há 3 horas', icon: 'fa-brain', color: 'blue', read: true },
  ]);

  useEffect(() => {
    const savedUser = localStorage.getItem('cp_session');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      const allConfigs = JSON.parse(localStorage.getItem('cp_configs') || '{}');
      if (allConfigs[parsedUser.id]) {
        setConfig(allConfigs[parsedUser.id]);
      }
    }

    if (window.location.hash.startsWith('#/form/')) {
      setIsFormView(true);
    }
    setIsLoaded(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = (u: UserAccount) => {
    setUser(u);
    localStorage.setItem('cp_session', JSON.stringify(u));
    setActiveTab(u.role === 'ADMIN' ? 'accounts' : 'dashboard');
    const allConfigs = JSON.parse(localStorage.getItem('cp_configs') || '{}');
    setConfig(allConfigs[u.id] || null);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('cp_session');
    setConfig(null);
    setActiveTab('dashboard');
  };

  const handleSaveConfig = (newConfig: UserConfig) => {
    if (!user) return;
    const configWithId = { ...newConfig, sellerId: user.id };
    setConfig(configWithId);
    const allConfigs = JSON.parse(localStorage.getItem('cp_configs') || '{}');
    allConfigs[user.id] = configWithId;
    localStorage.setItem('cp_configs', JSON.stringify(allConfigs));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isLoaded) return null;
  if (isFormView) return <MultiStepForm config={config} />;
  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <div className="flex min-h-screen bg-black text-slate-100">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userRole={user.role} 
        userName={user.name}
        onLogout={handleLogout}
      />
      <main className="flex-1 p-12 ml-64 overflow-y-auto">
        <header className="flex justify-between items-center mb-16">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter font-sci-fi neon-glow">
              {activeTab === 'dashboard' && 'CENTRAL_COMMAND'}
              {activeTab === 'tracking' && 'NETWORK_PROTOCOLS'}
              {activeTab === 'leads' && 'TARGET_DATABASE'}
              {activeTab === 'ai' && 'NEURAL_CREATIVE_HUB'}
              {activeTab === 'accounts' && 'ACCESS_MANAGEMENT'}
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px] mt-2">
              Status: <span className="text-[#00BFFF]">OPERACIONAL_NORMAL</span> // Nível de Acesso: {user.role}
            </p>
          </div>
          <div className="flex items-center gap-6 relative" ref={notificationRef}>
             {user.role === 'SELLER' && (
               <div className="px-6 py-3 bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl shadow-sm flex items-center gap-3">
                  <div className={`w-2 h-2 ${config ? 'bg-[#00BFFF] shadow-[0_0_10px_#00BFFF]' : 'bg-amber-500'} rounded-full animate-pulse`}></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">SYNC: {config ? 'ONLINE' : 'OFFLINE'}</span>
               </div>
             )}
             <button 
               onClick={() => setShowNotifications(!showNotifications)}
               className={`w-14 h-14 flex items-center justify-center bg-black border-2 rounded-2xl transition-all relative ${showNotifications ? 'border-[#00BFFF] shadow-[0_0_20px_rgba(0,191,255,0.2)]' : 'border-[#1A1A1A] hover:border-[#333]'}`}
             >
                <i className={`fa-solid fa-bolt-lightning text-lg ${showNotifications ? 'text-[#00BFFF]' : 'text-slate-600'}`}></i>
                {unreadCount > 0 && (
                  <div className="absolute top-4 right-4 w-2 h-2 bg-[#00BFFF] rounded-full shadow-[0_0_10px_#00BFFF]"></div>
                )}
             </button>

             {showNotifications && (
               <div className="absolute top-full right-0 mt-6 w-96 bg-[#0A0A0A] border border-[#1A1A1A] rounded-[2rem] shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-4 duration-300">
                 <div className="p-8 border-b border-[#1A1A1A] flex justify-between items-center bg-[#050505]">
                    <h4 className="font-sci-fi text-[10px] text-white uppercase tracking-widest">SINALIZADORES_SISTEMA</h4>
                    <span className="text-[9px] font-black text-[#00BFFF] uppercase tracking-tighter">{unreadCount} NOVOS EVENTOS</span>
                 </div>
                 <div className="max-h-[500px] overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className={`p-6 flex gap-5 hover:bg-[#111] transition-colors border-b border-[#1A1A1A] last:border-0 ${!n.read ? 'bg-[#00BFFF]/5' : ''}`}>
                        <div className="w-12 h-12 rounded-xl bg-black border border-[#1A1A1A] flex items-center justify-center text-[#00BFFF] shrink-0">
                          <i className={`fa-solid ${n.icon} text-sm`}></i>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <p className="font-black text-[11px] text-white uppercase tracking-widest">{n.title}</p>
                            <span className="text-[8px] font-bold text-slate-600 uppercase">{n.time}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-medium leading-relaxed uppercase">{n.message}</p>
                        </div>
                      </div>
                    ))}
                 </div>
                 <div className="p-6 bg-[#050505] text-center">
                    <button onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))} className="text-[10px] font-black text-[#00BFFF] uppercase tracking-[0.2em] hover:neon-glow">RESET_PROTOCOL</button>
                 </div>
               </div>
             )}
          </div>
        </header>

        <div className="max-w-[1500px] mx-auto">
          {activeTab === 'dashboard' && <Dashboard userRole={user.role} sellerId={user.id} />}
          {activeTab === 'tracking' && <TrackingSetup config={config} onSave={handleSaveConfig} />}
          {activeTab === 'leads' && <LeadManager sellerId={user.id} userRole={user.role} />}
          {activeTab === 'ai' && <AICreativeStudio />}
          {activeTab === 'accounts' && user.role === 'ADMIN' && <AdminPanel />}
        </div>
      </main>
    </div>
  );
};

export default App;

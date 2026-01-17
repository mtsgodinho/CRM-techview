
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
    { id: 1, title: 'Novo Lead', message: 'João Silva acabou de se cadastrar.', time: 'há 2 min', icon: 'fa-user-plus', color: 'indigo', read: false },
    { id: 2, title: 'Configuração Ativa', message: 'Seu Pixel ID foi verificado com sucesso.', time: 'há 1 hora', icon: 'fa-check-circle', color: 'emerald', read: false },
    { id: 3, title: 'Sistema', message: 'API Meta CAPI operando com 9.9/10 de qualidade.', time: 'há 3 horas', icon: 'fa-rocket', color: 'amber', read: true },
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
    
    if (u.role === 'ADMIN') {
      setActiveTab('accounts');
    } else {
      setActiveTab('dashboard');
    }

    const allConfigs = JSON.parse(localStorage.getItem('cp_configs') || '{}');
    if (allConfigs[u.id]) {
      setConfig(allConfigs[u.id]);
    } else {
      setConfig(null);
    }
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

  if (isFormView) {
    return <MultiStepForm config={config} />;
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userRole={user.role} 
        userName={user.name}
        onLogout={handleLogout}
      />
      <main className="flex-1 p-8 ml-64 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {activeTab === 'dashboard' && (user.role === 'ADMIN' ? 'Visão Global' : 'Dashboard de Performance')}
              {activeTab === 'tracking' && 'Configuração de Rastreamento'}
              {activeTab === 'leads' && 'Gestão de Clientes'}
              {activeTab === 'ai' && 'Estúdio de IA & Criativos'}
              {activeTab === 'accounts' && 'Gestão de Usuários'}
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              {user.role === 'ADMIN' 
                ? 'Painel de controle central para administração da rede.' 
                : `Operação ativa para ${user.name}.`}
            </p>
          </div>
          <div className="flex items-center gap-4 relative" ref={notificationRef}>
             {user.role === 'SELLER' && (
               <div className="px-5 py-2.5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 ${config ? 'bg-green-500 animate-pulse' : 'bg-amber-400'} rounded-full`}></div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-700">CAPI: {config ? 'Ativo' : 'Pendente'}</span>
               </div>
             )}
             <button 
               onClick={() => setShowNotifications(!showNotifications)}
               className={`w-12 h-12 flex items-center justify-center bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all relative ${showNotifications ? 'border-indigo-500 ring-4 ring-indigo-50' : ''}`}
             >
                <i className={`fa-solid fa-bell ${showNotifications ? 'text-indigo-600' : 'text-slate-400'}`}></i>
                {unreadCount > 0 && (
                  <div className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-indigo-600 rounded-full border-2 border-white"></div>
                )}
             </button>

             {/* Notifications Dropdown */}
             {showNotifications && (
               <div className="absolute top-full right-0 mt-4 w-80 bg-white border border-gray-100 rounded-[2rem] shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                 <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-slate-50/50">
                    <h4 className="font-black text-sm text-slate-800 uppercase tracking-widest">Notificações</h4>
                    <span className="bg-indigo-600 text-[10px] font-black text-white px-2 py-0.5 rounded-full">{unreadCount} Novas</span>
                 </div>
                 <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(n => (
                        <div key={n.id} className={`p-5 flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer group border-b border-gray-50 last:border-0 ${!n.read ? 'bg-indigo-50/20' : ''}`}>
                          <div className={`w-10 h-10 rounded-xl bg-${n.color}-100 flex items-center justify-center text-${n.color}-600 shrink-0 shadow-sm`}>
                            <i className={`fa-solid ${n.icon} text-sm`}></i>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-0.5">
                              <p className="font-black text-xs text-slate-800 uppercase tracking-tight">{n.title}</p>
                              <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap">{n.time}</span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">{n.message}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-10 text-center text-slate-300">
                        <i className="fa-solid fa-bell-slash text-4xl mb-3"></i>
                        <p className="text-sm font-bold">Sem notificações no momento.</p>
                      </div>
                    )}
                 </div>
                 <div className="p-4 bg-gray-50/50 text-center">
                    <button 
                      onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))}
                      className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
                    >
                      Marcar todas como lidas
                    </button>
                 </div>
               </div>
             )}
          </div>
        </header>

        <div className="max-w-[1400px] mx-auto">
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


import React, { useState, useEffect, useMemo } from 'react';
import { UserAccount } from '../types';

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', login: '', password: '' });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cp_users') || '[]');
    setUsers(saved);
  }, []);

  const filteredSellers = useMemo(() => {
    return users.filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const account: UserAccount = {
      id: `sell_${Math.random().toString(36).substr(2, 9)}`,
      email: newUser.login, // Repurposing email field as login for compatibility
      name: newUser.name,
      role: 'SELLER',
      password: newUser.password,
      createdAt: Date.now()
    };

    const updated = [...users, account];
    setUsers(updated);
    localStorage.setItem('cp_users', JSON.stringify(updated));
    setShowAddModal(false);
    setNewUser({ name: '', login: '', password: '' });
  };

  const deleteUser = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este vendedor? Todos os dados vinculados serão perdidos.')) {
      const updated = users.filter(u => u.id !== id);
      setUsers(updated);
      localStorage.setItem('cp_users', JSON.stringify(updated));
      
      const allConfigs = JSON.parse(localStorage.getItem('cp_configs') || '{}');
      delete allConfigs[id];
      localStorage.setItem('cp_configs', JSON.stringify(allConfigs));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200">
          <p className="text-indigo-100 text-xs font-black uppercase tracking-widest mb-1">Total de Vendedores</p>
          <h3 className="text-4xl font-black">{users.length}</h3>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold bg-white/10 w-fit px-3 py-1 rounded-full">
            <i className="fa-solid fa-users"></i> Operações Ativas
          </div>
        </div>
        <div className="bg-white border rounded-3xl p-6 shadow-sm">
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Leads Totais (Rede)</p>
          <h3 className="text-4xl font-black text-gray-800">
            {JSON.parse(localStorage.getItem('cp_leads_multi') || '[]').length}
          </h3>
          <p className="text-green-500 text-xs font-bold mt-2"><i className="fa-solid fa-arrow-up"></i> +5.4% este mês</p>
        </div>
        <div className="bg-white border rounded-3xl p-6 shadow-sm">
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Status do Sistema</p>
          <h3 className="text-2xl font-black text-gray-800 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            Operacional
          </h3>
          <p className="text-gray-400 text-xs font-medium mt-3">API Meta CAPI: 100% Online</p>
        </div>
      </div>

      <div className="bg-white border rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="p-8 border-b flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <div>
            <h2 className="text-xl font-black text-gray-800">Controle de Acessos</h2>
            <p className="text-sm text-gray-500 font-medium">Gerencie quem pode utilizar a plataforma.</p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="text" 
                placeholder="Filtrar vendedor..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-transparent focus:border-indigo-500 outline-none bg-white shadow-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2 whitespace-nowrap"
            >
              <i className="fa-solid fa-user-plus"></i> NOVO VENDEDOR
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b">
                <th className="px-8 py-5">Nome / Login</th>
                <th className="px-8 py-5">Identificador</th>
                <th className="px-8 py-5">Criado em</th>
                <th className="px-8 py-5">Configuração</th>
                <th className="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredSellers.map(user => {
                const hasConfig = !!JSON.parse(localStorage.getItem('cp_configs') || '{}')[user.id];
                return (
                  <tr key={user.id} className="hover:bg-indigo-50/20 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-inner">
                          {user.name[0]}
                        </div>
                        <div>
                          <p className="font-black text-gray-800 leading-none mb-1">{user.name}</p>
                          <p className="text-xs text-gray-400 font-bold">Login: {user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <code className="text-[10px] bg-gray-100 px-2 py-1 rounded-md text-gray-500 font-mono">
                        {user.id}
                      </code>
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-500 font-bold">
                      {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-8 py-6">
                      <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${hasConfig ? 'text-green-500' : 'text-amber-500'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${hasConfig ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                        {hasConfig ? 'Configurado' : 'Pendente'}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100">
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button 
                          onClick={() => deleteUser(user.id)}
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500">
            <div className="bg-indigo-600 p-10 text-white relative">
              <h3 className="text-3xl font-black leading-tight">Nova Conta<br/>de Vendedor</h3>
              <p className="text-indigo-100 text-sm mt-2 font-medium opacity-80">Defina o nome de exibição, o login de acesso e a senha.</p>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="absolute top-10 right-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Nome do Vendedor</label>
                <input 
                  required
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold"
                  placeholder="Ex: Pedro Alvares"
                  value={newUser.name}
                  onChange={e => setNewUser({...newUser, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Usuário / Login</label>
                <input 
                  required
                  type="text"
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold"
                  placeholder="vendedor_premium"
                  value={newUser.login}
                  onChange={e => setNewUser({...newUser, login: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Senha de Acesso</label>
                <input 
                  required
                  type="password"
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold"
                  placeholder="••••••••"
                  value={newUser.password}
                  onChange={e => setNewUser({...newUser, password: e.target.value})}
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)} 
                  className="flex-1 font-black text-gray-400 hover:text-gray-600 uppercase tracking-widest text-xs"
                >
                  CANCELAR
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] bg-indigo-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transform active:scale-95 transition-all uppercase tracking-widest text-xs"
                >
                  CRIAR VENDEDOR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

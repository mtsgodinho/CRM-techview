
import React, { useState } from 'react';
import { UserAccount } from '../types';

interface LoginProps {
  onLogin: (user: UserAccount) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Hardcoded Admin for simulation
    if (login === 'admin' || login === 'admin@conversionpro.com') {
      if (password === 'admin123') {
        onLogin({
          id: 'admin-001',
          email: 'admin@conversionpro.com',
          name: 'Super Admin',
          role: 'ADMIN',
          createdAt: Date.now()
        });
        return;
      }
    }

    // Check sellers in localStorage
    const savedSellers = JSON.parse(localStorage.getItem('cp_users') || '[]');
    const user = savedSellers.find((u: any) => u.email === login && u.password === password);

    if (user) {
      onLogin(user);
    } else {
      setError('Credenciais inválidas. Verifique seu login e senha.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-500/20">
            <i className="fa-solid fa-rocket text-2xl text-white"></i>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">ConversionPro</h1>
          <p className="text-slate-400 mt-2">Acesse sua central de conversão avançada</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-[2.5rem] p-10 shadow-2xl space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium flex gap-3 items-center border border-red-100">
              <i className="fa-solid fa-circle-exclamation"></i>
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Usuário / Login</label>
            <div className="relative">
              <i className="fa-solid fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
              <input 
                required
                type="text"
                value={login}
                onChange={e => setLogin(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
                placeholder="Seu login"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Senha</label>
            <div className="relative">
              <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
              <input 
                required
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all transform active:scale-[0.98] mt-4 uppercase tracking-widest text-sm"
          >
            ENTRAR NA PLATAFORMA
          </button>

          <div className="pt-4 text-center">
            <p className="text-xs text-slate-400 font-medium">
              Não tem acesso? <span className="text-indigo-600 font-bold hover:underline cursor-pointer">Fale com seu administrador.</span>
            </p>
          </div>
        </form>

        <div className="mt-10 text-center text-slate-500 text-xs font-medium">
          &copy; 2024 ConversionPro SaaS. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
};

export default Login;

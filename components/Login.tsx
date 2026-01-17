
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
    
    // Check Admin
    if (login === 'admin' || login === 'admin@techview.com') {
      if (password === 'admin123') {
        onLogin({
          id: 'admin-001',
          email: 'admin@techview.com',
          name: 'Super Admin',
          role: 'ADMIN',
          createdAt: Date.now()
        });
        return;
      }
    }

    try {
      const savedSellersStr = localStorage.getItem('cp_users') || '[]';
      const savedSellers = JSON.parse(savedSellersStr);
      const user = savedSellers.find((u: any) => u.email === login && u.password === password);
      
      if (user) {
        onLogin(user);
      } else {
        setError('ACESSO NEGADO: Credenciais não encontradas na base de dados.');
      }
    } catch (e) {
      console.error("Login crash:", e);
      setError('ERRO_SISTEMA: Falha ao acessar banco local.');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,191,255,0.05)_0%,_transparent_70%)]"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-1 h-1 bg-[#00BFFF] rounded-full animate-pulse"></div>
        <div className="absolute top-[40%] right-[15%] w-1.5 h-1.5 bg-[#00BFFF] rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-[20%] left-[40%] w-1 h-1 bg-[#00BFFF] rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <div className="w-32 h-32 bg-black border-2 border-[#00BFFF] rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(0,191,255,0.4)] animate-pulse-neon overflow-hidden">
            <img src="https://i.imgur.com/gMYZa1W.png" alt="TECHVIEW Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter font-sci-fi neon-glow">TECHVIEW</h1>
          <p className="text-slate-500 mt-2 font-bold uppercase tracking-[0.3em] text-[10px]">Elite Conversion Interface</p>
        </div>

        <form onSubmit={handleLogin} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-[2.5rem] p-10 shadow-2xl space-y-6">
          {error && (
            <div className="bg-rose-950/30 text-rose-500 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex gap-3 items-center border border-rose-900/50">
              <i className="fa-solid fa-triangle-exclamation"></i>
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#00BFFF] uppercase tracking-widest ml-1">Comandante / Login</label>
            <div className="relative">
              <i className="fa-solid fa-terminal absolute left-4 top-1/2 -translate-y-1/2 text-slate-700"></i>
              <input 
                required
                type="text"
                value={login}
                onChange={e => setLogin(e.target.value)}
                className="w-full bg-black border-2 border-[#1A1A1A] rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-[#00BFFF] focus:shadow-[0_0_15px_rgba(0,191,255,0.1)] transition-all font-bold text-white placeholder:text-slate-800"
                placeholder="USER_ID"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#00BFFF] uppercase tracking-widest ml-1">Senha de Acesso</label>
            <div className="relative">
              <i className="fa-solid fa-fingerprint absolute left-4 top-1/2 -translate-y-1/2 text-slate-700"></i>
              <input 
                required
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-black border-2 border-[#1A1A1A] rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-[#00BFFF] focus:shadow-[0_0_15px_rgba(0,191,255,0.1)] transition-all font-bold text-white placeholder:text-slate-800"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#00BFFF] text-black font-black py-5 rounded-2xl hover:bg-[#33ccff] shadow-[0_0_25px_rgba(0,191,255,0.3)] transition-all transform active:scale-[0.98] mt-4 uppercase tracking-widest text-sm font-sci-fi"
          >
            INICIAR OPERAÇÃO
          </button>

          <div className="pt-4 text-center">
            <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">
              Acesso restrito. <span className="text-[#00BFFF] hover:underline cursor-pointer">Protocolo de Emergência.</span>
            </p>
          </div>
        </form>

        <div className="mt-12 text-center text-slate-800 text-[10px] font-black uppercase tracking-[0.5em]">
          &copy; TECHVIEW SYS. MILITARY GRADE ENCRYPTION
        </div>
      </div>
    </div>
  );
};

export default Login;

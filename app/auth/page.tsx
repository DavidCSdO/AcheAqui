"use client";

import React, { useState } from "react";
import Crosshair from "@/components/Crosshair";
import { ArrowRight, Globe, Mail } from "lucide-react";

import { login, signup } from "./actions";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    if (!isLogin) {
      formData.append("full_name", fullName);
    }

    try {
      if (isLogin) {
        await login(formData);
      } else {
        await signup(formData);
      }
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro durante a autenticação");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-primary)] text-white flex items-center justify-center relative overflow-hidden p-6">
      
      {/* Background aesthetics */}
      <div className="absolute inset-0 bg-noise pointer-events-none opacity-20" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--color-secondary)] opacity-[0.03] pointer-events-none">
        <Crosshair size={800} strokeWidth={0.5} className="animate-slow-spin" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Logo */}
        <a href="/" className="flex flex-col items-center gap-3 mb-10 group">
          <div className="w-12 h-12 rounded-[14px] bg-[var(--color-secondary)] flex items-center justify-center text-white transition-transform group-hover:scale-105 shadow-[0_0_40px_rgba(167,139,250,0.3)]">
            <Crosshair size={24} strokeWidth={2.5} />
          </div>
          <span className="text-[1.25rem] font-bold tracking-[-0.02em] text-white">AcheAqui</span>
        </a>

        {/* Card */}
        <div className="bg-[#1C1C1E]/80 backdrop-blur-xl border border-white/10 rounded-[24px] p-8 sm:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-[1.5rem] font-bold text-white mb-2">
              {isLogin ? "Bem-vindo de volta" : "Crie sua conta"}
            </h1>
            <p className="text-[0.875rem] text-white/50">
              {isLogin ? "Acesse seu painel de prospecção" : "Comece a prospectar com inteligência"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-[0.875rem] rounded-[12px] text-center">
                {error}
              </div>
            )}
            
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-[0.8125rem] font-medium text-white/70 pl-1">Nome completo da empresa</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Sua Empresa Ltda."
                  className="w-full bg-black/40 border border-white/10 rounded-[12px] px-4 py-3 text-[0.9375rem] text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-secondary)] transition-colors"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[0.8125rem] font-medium text-white/70 pl-1">E-mail corporativo</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@empresa.com"
                className="w-full bg-black/40 border border-white/10 rounded-[12px] px-4 py-3 text-[0.9375rem] text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-secondary)] transition-colors"
              />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between pl-1">
                <label className="text-[0.8125rem] font-medium text-white/70">Senha</label>
                {isLogin && <a href="#" className="text-[0.75rem] text-[var(--color-secondary)] hover:underline">Esqueci a senha</a>}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/40 border border-white/10 rounded-[12px] px-4 py-3 text-[0.9375rem] text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-secondary)] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-semibold text-[0.9375rem] py-3.5 rounded-[12px] hover:bg-white/90 transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-70"
            >
              {loading ? (
                <Crosshair size={18} className="animate-spin text-black" />
              ) : (
                <>
                  {isLogin ? "Entrar" : "Criar conta grátis"}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-[0.6875rem] text-white/30 uppercase tracking-widest font-semibold">ou</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-3 rounded-[12px] bg-white/5 border border-white/10 text-[0.875rem] font-medium text-white hover:bg-white/10 transition-colors">
              <Mail size={16} /> Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 rounded-[12px] bg-white/5 border border-white/10 text-[0.875rem] font-medium text-white hover:bg-white/10 transition-colors">
              <Globe size={16} /> Web
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-[0.875rem] text-white/50">
            {isLogin ? "Ainda não tem conta?" : "Já possui conta?"}{" "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-white font-medium hover:underline"
            >
              {isLogin ? "Crie uma agora" : "Fazer login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

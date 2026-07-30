"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Terminal, Copy, Key, Webhook, Code2 } from "lucide-react";

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-primary)] text-white font-sans selection:bg-[var(--color-secondary)] flex flex-col">
      {/* We use a specific light-style navbar by tricking it with a wrapper or simply keeping it transparent, but since the background is dark, we can just use the standard Navbar (it handles scroll state) */}
      <Navbar />

      <main className="flex-1 pt-[120px] pb-24">
        <div className="container-wide px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 hidden lg:block border-r border-white/10 pr-8">
            <div className="sticky top-[120px] space-y-8">
              <div>
                <h4 className="text-[0.75rem] uppercase tracking-widest text-white/40 font-semibold mb-3">Introdução</h4>
                <ul className="space-y-2 text-[0.875rem]">
                  <li><a href="#" className="text-[var(--color-secondary)] font-medium">Autenticação</a></li>
                  <li><a href="#" className="text-white/60 hover:text-white transition">Rate Limits</a></li>
                  <li><a href="#" className="text-white/60 hover:text-white transition">Paginação</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-[0.75rem] uppercase tracking-widest text-white/40 font-semibold mb-3">Endpoints</h4>
                <ul className="space-y-2 text-[0.875rem]">
                  <li><a href="#" className="text-white/60 hover:text-white transition">Busca de Empresas</a></li>
                  <li><a href="#" className="text-white/60 hover:text-white transition">Enriquecimento de Lead</a></li>
                  <li><a href="#" className="text-white/60 hover:text-white transition">Webhooks</a></li>
                </ul>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-9 max-w-4xl space-y-16">
            
            <section>
              <h1 className="text-[2.5rem] font-bold tracking-tight mb-4">AcheAqui API Reference</h1>
              <p className="text-[1.125rem] text-white/60 leading-relaxed mb-8">
                Nossa REST API permite que você integre nosso motor de prospecção diretamente ao seu CRM, ERP ou sistema interno.
                Todos os endpoints retornam dados no formato JSON.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 transition text-[0.875rem]">
                  <Key size={16} /> Obter API Key
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 transition text-[0.875rem]">
                  <Webhook size={16} /> Configurar Webhooks
                </button>
              </div>
            </section>

            <section>
              <h2 className="text-[1.5rem] font-bold mb-4 border-b border-white/10 pb-2">Autenticação</h2>
              <p className="text-white/60 mb-4 text-[0.9375rem] leading-relaxed">
                Autentique suas requisições HTTP enviando a sua API Key através do cabeçalho <code className="bg-white/10 px-1.5 py-0.5 rounded text-white font-mono text-[0.8125rem]">Authorization: Bearer</code>.
              </p>
              
              <div className="rounded-[12px] overflow-hidden border border-white/10 bg-[#0d1117] shadow-xl">
                <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-white/10 text-[0.75rem] font-mono text-white/40">
                  <div className="flex items-center gap-2"><Terminal size={14} /> cURL Request</div>
                  <button className="hover:text-white transition"><Copy size={14} /></button>
                </div>
                <div className="p-4 overflow-x-auto text-[0.875rem] font-mono leading-relaxed text-blue-300">
                  <span className="text-pink-400">curl</span> -X GET https://api.acheaqui.com/v1/companies \ <br/>
                  &nbsp;&nbsp;-H <span className="text-amber-300">"Authorization: Bearer sk_live_your_api_key_here"</span>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-[1.5rem] font-bold mb-4 border-b border-white/10 pb-2">Busca de Empresas</h2>
              <p className="text-white/60 mb-6 text-[0.9375rem] leading-relaxed">
                Retorna uma lista paginada de empresas que combinam com os filtros fornecidos.
              </p>

              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-[0.75rem] font-bold tracking-wider font-mono">GET</span>
                <code className="text-white text-[0.9375rem] font-mono">/v1/companies/search</code>
              </div>

              <div className="rounded-[12px] border border-white/10 bg-white/5 overflow-hidden mb-8">
                <table className="w-full text-left text-[0.875rem]">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 text-[0.75rem] uppercase tracking-wider bg-white/5">
                      <th className="px-4 py-3">Parâmetro</th>
                      <th className="px-4 py-3">Tipo</th>
                      <th className="px-4 py-3">Descrição</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-white/80">
                    <tr>
                      <td className="px-4 py-3 font-mono text-blue-300">query</td>
                      <td className="px-4 py-3 font-mono text-[0.75rem]">string</td>
                      <td className="px-4 py-3 text-white/60">Termo de busca (ex: "clínica odontológica")</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-blue-300">location</td>
                      <td className="px-4 py-3 font-mono text-[0.75rem]">string</td>
                      <td className="px-4 py-3 text-white/60">Cidade ou CEP</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-blue-300">limit</td>
                      <td className="px-4 py-3 font-mono text-[0.75rem]">integer</td>
                      <td className="px-4 py-3 text-white/60">Máximo de resultados por página (max 100)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* JSON Response Mock */}
              <h3 className="text-[1rem] font-semibold mb-3">Response</h3>
              <div className="rounded-[12px] overflow-hidden border border-white/10 bg-[#0d1117] shadow-xl">
                <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-white/10 text-[0.75rem] font-mono text-white/40">
                  <div className="flex items-center gap-2"><Code2 size={14} /> JSON Response (200 OK)</div>
                </div>
                <div className="p-4 overflow-x-auto text-[0.8125rem] font-mono leading-relaxed">
                  <pre className="text-white/80">
                    {`{
  "object": "list",
  "data": [
    {
      "id": "comp_1A2b3C",
      "name": "Sorridents Odontologia",
      "category": "Saúde",
      "contacts": {
        "phone": "+551132881200",
        "email": "contato@sorridents.com.br",
        "whatsapp_verified": true
      },
      "address": {
        "city": "São Paulo",
        "state": "SP",
        "zip": "01311-000"
      }
    }
  ],
  "has_more": true
}`}
                  </pre>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

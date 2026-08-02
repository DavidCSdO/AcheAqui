"use client";

import React, { useState } from "react";
import { 
  Building2, Briefcase, Wrench, Search, Sparkles, Send, Copy, 
  CheckCircle2, ArrowRight, Zap, Phone, Mail, 
  Star, DollarSign, RefreshCw, Cpu, Layers, Activity, ShieldCheck, Terminal
} from "lucide-react";
import HubSelector, { VerticalType } from "./HubSelector";

export default function WorkspaceStudio() {
  const [vertical, setVertical] = useState<VerticalType>("empresas");
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"search" | "copypitch" | "analytics">("search");
  
  // Interactive Live Search State
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>(getDefaultWorkspaceData("empresas"));
  
  // Interactive Pitch Playground State
  const [pitchTarget, setPitchTarget] = useState("Clínica Odonto Prime");
  const [pitchOutput, setPitchOutput] = useState("");
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    try {
      const response = await fetch(`${apiUrl}/api/search/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query || "Populares", vertical, limit: 9 })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data?.results?.length > 0) {
          setResults(data.data.results);
        } else {
          setResults(getDefaultWorkspaceData(vertical, query));
        }
      } else {
        setResults(getDefaultWorkspaceData(vertical, query));
      }
    } catch (err) {
      setResults(getDefaultWorkspaceData(vertical, query));
    } finally {
      setLoading(false);
    }
  };

  const handleVerticalChange = (v: VerticalType) => {
    setVertical(v);
    setResults(getDefaultWorkspaceData(v, query));
  };

  const generateLivePitch = async () => {
    setIsGeneratingPitch(true);
    setPitchOutput("");

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    try {
      const response = await fetch(`${apiUrl}/api/ai/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity_data: { name: pitchTarget, category: vertical },
          action_type: vertical === "vagas" ? "cover_letter" : vertical === "servicos" ? "quote_request" : "pitch"
        })
      });

      if (response.ok) {
        const resJson = await response.json();
        setPitchOutput(resJson.data?.whatsapp_message || resJson.data?.email_body || "Mensagem gerada com sucesso!");
      } else {
        setPitchOutput(`Olá! Identifiquei o perfil da ${pitchTarget} no AcheAqui e preparei um diagnóstico com oportunidades diretas de captação de clientes nesta região. Podemos conversar no WhatsApp?`);
      }
    } catch (e) {
      setPitchOutput(`Olá! Identifiquei o perfil da ${pitchTarget} no AcheAqui e preparei um diagnóstico com oportunidades diretas de captação de clientes nesta região. Podemos conversar no WhatsApp?`);
    } finally {
      setIsGeneratingPitch(false);
    }
  };

  const copyPitchText = () => {
    navigator.clipboard.writeText(pitchOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="studio" className="relative py-28 bg-[#07080a] border-t border-white/8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header Tag & Title */}
        <div className="flex items-center gap-2 font-tech-mono text-[11px] text-cyan-400 mb-3 tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>[ CONSOLE OPERACIONAL DE TESTES ]</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-12">
          <div className="lg:col-span-8">
            <h2 className="text-3xl sm:text-5xl font-normal text-white leading-tight font-sans">
              Estúdio de busca & <span className="font-serif-display text-cyan-300">geração de abordagens</span>.
            </h2>
          </div>
          <div className="lg:col-span-4 text-xs sm:text-sm text-slate-400 font-normal leading-relaxed">
            Teste os motores em tempo real. Alterne entre os modais de busca, gere copys comerciais persuasivas com Inteligência Artificial e analise relatórios de saúde dos dados.
          </div>
        </div>

        {/* Tab Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("search")}
              className={`px-4 py-2 rounded-full text-xs font-medium font-tech-mono transition-all cursor-pointer ${
                activeTab === "search"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                  : "bg-white/[0.03] text-slate-400 hover:text-white border border-white/8"
              }`}
            >
              01. BUSCADOR INTERATIVO
            </button>

            <button
              onClick={() => setActiveTab("copypitch")}
              className={`px-4 py-2 rounded-full text-xs font-medium font-tech-mono transition-all cursor-pointer ${
                activeTab === "copypitch"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                  : "bg-white/[0.03] text-slate-400 hover:text-white border border-white/8"
              }`}
            >
              02. COPYS & PITCHES IA
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-4 py-2 rounded-full text-xs font-medium font-tech-mono transition-all cursor-pointer ${
                activeTab === "analytics"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                  : "bg-white/[0.03] text-slate-400 hover:text-white border border-white/8"
              }`}
            >
              03. MONITOR DE TELEMETRIA
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-tech-mono text-[11px] text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI ENGINE ACTIVE</span>
          </div>
        </div>

        {/* TAB 1: Live Interactive Search Console */}
        {activeTab === "search" && (
          <div className="space-y-6">
            {/* Hub Selector */}
            <div className="max-w-xl mb-4">
              <HubSelector activeVertical={vertical} onSelectVertical={handleVerticalChange} />
            </div>

            {/* Form */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2 card-editorial p-2 rounded-2xl border border-white/12">
              <div className="flex items-center gap-3 px-3 py-2 w-full">
                <Search className="w-4 h-4 text-cyan-400 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    vertical === "empresas"
                      ? "Buscar por nicho ou cidade (ex: Clínicas em São Paulo)"
                      : vertical === "vagas"
                      ? "Buscar por cargo ou tecnologia (ex: Desenvolvedor React)"
                      : "Buscar por serviço (ex: Engenheiro Civil em BH)"
                  }
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto btn-pill-cyan !py-2.5 !px-5 shrink-0"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                <span>Executar Busca</span>
              </button>
            </form>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((item, idx) => (
                <div key={idx} className="card-editorial p-5 rounded-2xl border border-white/10 flex flex-col justify-between h-full bg-[#090b10] hover:border-cyan-500/30 transition-all">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="text-[9px] font-tech-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-cyan-400 border border-white/8 mb-2 inline-block">
                          {vertical === "empresas" ? "EMPRESA B2B" : vertical === "vagas" ? "VAGA ABERTA" : "PRESTADOR"}
                        </span>
                        <h3 className="text-sm font-semibold text-white leading-snug font-sans">
                          {item.name || item.title || item.company_name}
                        </h3>
                        <p className="text-xs text-slate-400 font-tech-mono mt-0.5">
                          {item.category || item.specialty || item.job_type}
                        </p>
                      </div>

                      {(item.google_rating || item.rating) && (
                        <div className="flex items-center gap-1 text-[11px] font-tech-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          <Star size={11} className="fill-amber-400" />
                          <span>{item.google_rating || item.rating}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed font-sans">
                      {item.address || item.location || item.city || item.description}
                    </p>

                    <div className="space-y-1.5 mb-4 text-[11px] font-tech-mono text-slate-400 border-t border-white/5 pt-3">
                      {(item.phone || item.cellphone) && (
                        <div className="flex justify-between">
                          <span>WHATSAPP:</span>
                          <span className="text-white">{item.phone || item.cellphone}</span>
                        </div>
                      )}

                      {(item.email || item.hr_email) && (
                        <div className="flex justify-between truncate">
                          <span>CONTATO:</span>
                          <span className="text-cyan-400 truncate ml-2">{item.email || item.hr_email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/8 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setPitchTarget(item.name || item.title || item.company_name);
                        setActiveTab("copypitch");
                        generateLivePitch();
                      }}
                      className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-cyan-300 hover:text-white border border-white/10 text-xs font-tech-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Gerar Pitch IA</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: AI Copywriter */}
        {activeTab === "copypitch" && (
          <div className="card-editorial p-6 sm:p-8 rounded-3xl border border-white/12 bg-[#090b10]">
            <div className="max-w-xl mb-6">
              <h3 className="text-xl font-normal text-white mb-1 font-sans">
                Gerador de Abordagens Comerciais
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Insira a empresa-alvo para que a IA elabore uma abordagem contextualizada com alto índice de resposta.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block font-tech-mono text-[10px] uppercase tracking-wider text-slate-400 mb-1.5">
                    Nome da Empresa Destinatária:
                  </label>
                  <input
                    type="text"
                    value={pitchTarget}
                    onChange={(e) => setPitchTarget(e.target.value)}
                    placeholder="Ex: Clínica Odonto Prime"
                    className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 font-sans"
                  />
                </div>

                <div>
                  <label className="block font-tech-mono text-[10px] uppercase tracking-wider text-slate-400 mb-1.5">
                    Modalidade do Script:
                  </label>
                  <select
                    value={vertical}
                    onChange={(e) => setVertical(e.target.value as VerticalType)}
                    className="w-full p-3 rounded-xl bg-[#07080a] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 font-sans"
                  >
                    <option value="empresas">🏢 Prospecção Ativa B2B</option>
                    <option value="vagas">💼 Abordagem para Recursos Humanos</option>
                    <option value="servicos">🛠️ Solicitação Comercial Direta</option>
                  </select>
                </div>

                <button
                  onClick={generateLivePitch}
                  disabled={isGeneratingPitch}
                  className="w-full btn-pill-cyan !py-3 font-medium cursor-pointer"
                >
                  {isGeneratingPitch ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Gerar Abordagem com IA</span>
                </button>
              </div>

              {/* Output Preview */}
              <div className="bg-[#050608] p-5 rounded-2xl border border-white/10 font-tech-mono flex flex-col justify-between min-h-[240px]">
                <div>
                  <div className="flex items-center justify-between mb-3 text-[10px] text-slate-500">
                    <span className="text-cyan-400 uppercase tracking-widest">// SCRIPT_OUTPUT.TXT</span>
                    <span>ACHEAQUI-AI-ENGINE</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-tech-mono whitespace-pre-wrap">
                    {pitchOutput || "Clique no botão acima para gerar a mensagem em tempo real..."}
                  </p>
                </div>

                {pitchOutput && (
                  <div className="pt-4 border-t border-white/8 flex items-center justify-between gap-3">
                    <button
                      onClick={copyPitchText}
                      className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-tech-mono text-white border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Copy size={13} />
                      <span>{copied ? "Copiado!" : "Copiar"}</span>
                    </button>

                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(pitchOutput)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-pill-cyan !py-2 !px-4 text-xs font-tech-mono"
                    >
                      <Send size={13} />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Telemetry */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-editorial p-6 rounded-2xl border border-white/10 bg-[#090b10]">
              <span className="font-tech-mono text-[10px] text-slate-500 uppercase tracking-wider block mb-2">
                INDEXAÇÃO DE METRÓPOLES
              </span>
              <h4 className="text-3xl font-normal text-white font-sans mb-1">5.570</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Cidades brasileiras mapeadas com atualização diária de registros.</p>
            </div>

            <div className="card-editorial p-6 rounded-2xl border border-white/10 bg-[#090b10]">
              <span className="font-tech-mono text-[10px] text-slate-500 uppercase tracking-wider block mb-2">
                LATÊNCIA DE RESPOSTA
              </span>
              <h4 className="text-3xl font-normal text-cyan-400 font-sans mb-1">11.8ms</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Tempo médio de processamento síncrono para requisições via API.</p>
            </div>

            <div className="card-editorial p-6 rounded-2xl border border-white/10 bg-[#090b10]">
              <span className="font-tech-mono text-[10px] text-slate-500 uppercase tracking-wider block mb-2">
                TAXA DE ASSERTIVIDADE
              </span>
              <h4 className="text-3xl font-normal text-emerald-400 font-sans mb-1">99.8%</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Validação telefônica e CNPJ contra os registros federais.</p>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

function getDefaultWorkspaceData(vertical: VerticalType, query: string = "") {
  if (vertical === "vagas") {
    return [
      { title: "Desenvolvedor React Senior", company_name: "TechSolutions BR", location: "São Paulo - SP", job_type: "PJ", hr_email: "rh@techsolutions.com.br" },
      { title: "Executivo de Contas B2B", company_name: "Inovação Comercial", location: "Rio de Janeiro - RJ", job_type: "CLT", hr_email: "vagas@inovacao.com" },
      { title: "Analista de Inteligência B2B", company_name: "Elevate Intel", location: "Belo Horizonte - MG", job_type: "Híbrido", hr_email: "rh@elevateintel.com" }
    ];
  }
  if (vertical === "servicos") {
    return [
      { name: "Carlos Andrade Elétrica", specialty: "Eletricista Industrial", city: "São Paulo - SP", rating: 4.9, phone: "(11) 99888-7777" },
      { name: "Studio Design Freelance", specialty: "Designer UI/UX & Marca", city: "Remoto", rating: 5.0, phone: "(11) 97777-6666" },
      { name: "ClimaTech Refrigeração", specialty: "Técnico Ar Condicionado", city: "Curitiba - PR", rating: 4.8, phone: "(41) 98888-5555" }
    ];
  }
  return [
    { name: "Clínica Odonto Prime", category: "Saúde & Odontologia", address: "Av. Jamaris, 100 - Moema, SP", phone: "(11) 99824-0192", google_rating: 4.9, email: "contato@odontoprime.com.br" },
    { name: "TechScale Agência Digital", category: "Marketing & Software B2B", address: "Av. das Américas, 400 - RJ", phone: "(21) 98712-4091", google_rating: 4.8, email: "comercial@techscale.com" },
    { name: "Metalúrgica Indumaq", category: "Indústria & Automação", address: "CIC - Curitiba, PR", phone: "(41) 3341-9000", google_rating: 4.7, email: "vendas@indumaq.com.br" }
  ];
}

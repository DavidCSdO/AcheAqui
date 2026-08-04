export default function TheDataPromise() {
  return (
    <section className="relative py-[160px] px-6 max-w-5xl mx-auto w-full text-center flex flex-col items-center justify-center">
      
      {/* Editorial Bracket Label */}
      <div className="mb-12">
        <span className="bracket-label">The Promise</span>
      </div>

      {/* Large Editorial Quote */}
      <h2 className="editorial-title text-[clamp(2rem,5vw,3.5rem)] text-white/90 leading-tight max-w-4xl mx-auto mb-10">
        "Em vendas outbound, precisão não é uma feature—é a <span className="text-violet-400">única coisa</span> que importa."
      </h2>

      {/* Subtle details */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-[1px] h-16 bg-gradient-to-b from-violet-500/50 to-transparent"></div>
        <p className="font-mono text-xs tracking-widest text-white/40 uppercase">AcheAqui Data Engine</p>
      </div>

    </section>
  );
}

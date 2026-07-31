export interface LeadScore {
  score: number;
  label: string;
  color: string;
}

export function calculateLeadScore(company: any): LeadScore {
  let score = 0;

  // 1. Contato Direto (Mais Importante)
  if (company.cellphone) score += 40;
  if (company.landline) score += 10;
  if (company.email) score += 25;
  
  // 2. Presença Digital
  if (company.website) score += 15;
  if (company.instagram || company.linkedin) score += 10;

  // Garantir limite de 100
  score = Math.min(score, 100);

  // Classificação
  if (score >= 80) {
    return { score, label: "Excelente", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" };
  } else if (score >= 50) {
    return { score, label: "Bom", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" };
  } else {
    return { score, label: "Básico", color: "text-rose-400 border-rose-500/30 bg-rose-500/10" };
  }
}

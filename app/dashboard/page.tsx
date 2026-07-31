import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import DashboardClient from "@/components/DashboardClient";
import MagicOnboardingClient from "./MagicOnboardingClient";

export default async function DashboardPage() {
  const supabase = await createClient();
  
  // 1. Ensure user is logged in
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth");
  }

  // 2. Fetch User's Companies
  const { data: companies, error } = await supabase
    .from("companies")
    .select("*")
    .eq("owner_id", user.id)
    .limit(1);

  if (error) {
    console.error("Error fetching companies:", error);
  }

  // 3. If no company, show Magic Onboarding
  if (!companies || companies.length === 0) {
    return <MagicOnboardingClient />;
  }

  const company = companies[0];

  // 4. Fetch AI Data for this company
  const { data: aiData } = await supabase
    .from("ai_data")
    .select("*")
    .eq("company_id", company.id)
    .single();

  // 5. Show Dashboard
  return <DashboardClient company={company} aiData={aiData} />;
}

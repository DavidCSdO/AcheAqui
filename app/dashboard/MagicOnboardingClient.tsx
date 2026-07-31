"use client";

import { useRouter } from "next/navigation";
import MagicOnboarding from "@/components/MagicOnboarding";

export default function MagicOnboardingClient() {
  const router = useRouter();

  return (
    <MagicOnboarding 
      onComplete={() => {
        router.refresh();
      }} 
    />
  );
}

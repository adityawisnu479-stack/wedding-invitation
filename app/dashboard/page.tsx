import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { SetupNotice } from "@/components/ui/SetupNotice";
import { getDashboardData } from "@/lib/data";
import { supabaseConfigured } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!supabaseConfigured) return <SetupNotice />;

  const data = await getDashboardData();
  if (!data) redirect("/login");

  return <DashboardShell data={data} />;
}

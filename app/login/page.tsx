import { redirect } from "next/navigation";
import { LoginForm } from "@/components/dashboard/LoginForm";
import { SetupNotice } from "@/components/ui/SetupNotice";
import { supabaseConfigured } from "@/lib/supabase/client";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (!supabaseConfigured) return <SetupNotice />;

  const supabase = await supabaseServer();
  const {
    data: { user },
  } = (await supabase?.auth.getUser()) ?? { data: { user: null } };

  if (user) redirect("/dashboard");

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#f6efe4,#eae2d6_70%)] px-4 py-10">
      <LoginForm />
    </main>
  );
}

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { AuthUserContext } from "@/types/database";

export async function getAuthContext(): Promise<AuthUserContext | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email,
    fullName: profile?.full_name ?? user.email ?? "Pengguna",
    role: profile?.role ?? "KORSEC",
  };
}

export async function requireUser() {
  const context = await getAuthContext();
  if (!context) {
    redirect("/login");
  }
  return context;
}

export async function requireAdmin() {
  const context = await requireUser();
  if (context.role !== "SCC_ADMIN") {
    redirect("/");
  }
  return context;
}


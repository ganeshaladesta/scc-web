"use server";

import { requireUser } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ActivityJenis } from "@/types/database";

export async function getPersonnelHistory(filters: {
  tanggal?: string;
}) {
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("daily_personnel_reports")
    .select(
      `
      id,
      tanggal,
      jumlah_personil,
      created_at,
      created_by,
      master_wilayah ( nama_wilayah ),
      master_gedung ( nama_gedung ),
      master_shift ( nama_shift ),
      master_korsec ( nama_korsec )
    `,
    )
    .order("tanggal", { ascending: false })
    .order("created_at", { ascending: false });

  if (user.role !== "SCC_ADMIN") {
    query = query.eq("created_by", user.id);
  }

  if (filters.tanggal) {
    query = query.eq("tanggal", filters.tanggal);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getActivityHistory(filters: {
  tanggal?: string;
  jenis?: ActivityJenis;
}) {
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("activity_reports")
    .select("*")
    .order("tanggal", { ascending: false })
    .order("created_at", { ascending: false });

  if (user.role !== "SCC_ADMIN") {
    query = query.eq("created_by", user.id);
  }

  if (filters.tanggal) {
    query = query.eq("tanggal", filters.tanggal);
  }

  if (filters.jenis) {
    query = query.eq("jenis", filters.jenis);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}


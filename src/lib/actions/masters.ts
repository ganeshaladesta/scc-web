"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  contactPersonSchema,
  dailyAssignmentSchema,
  gedungSchema,
  korsecSchema,
  pambiSchema,
  shiftSchema,
  wilayahSchema,
} from "@/lib/validations/masters";
import type { ContactPersonJenis } from "@/types/database";

export type MasterActionResult = { ok: true } | { ok: false; error: string };

function fail(message: string): MasterActionResult {
  return { ok: false, error: message };
}

export async function upsertWilayah(input: unknown): Promise<MasterActionResult> {
  const user = await requireAdmin();
  const parsed = wilayahSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Data tidak valid");

  const supabase = await createServerSupabaseClient();
  const { id, ...rest } = parsed.data;
  const payload = {
    ...rest,
    keterangan: rest.keterangan || null,
    created_by: user.id,
  };

  const { error } = id
    ? await supabase.from("master_wilayah").update(payload).eq("id", id)
    : await supabase.from("master_wilayah").insert(payload);

  if (error) return fail(error.message);
  revalidatePath("/admin/master");
  return { ok: true };
}

export async function upsertGedung(input: unknown): Promise<MasterActionResult> {
  const user = await requireAdmin();
  const parsed = gedungSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Data tidak valid");

  const supabase = await createServerSupabaseClient();
  const { id, ...rest } = parsed.data;
  const payload = {
    ...rest,
    alamat: rest.alamat || null,
    created_by: user.id,
  };

  const { error } = id
    ? await supabase.from("master_gedung").update(payload).eq("id", id)
    : await supabase.from("master_gedung").insert(payload);

  if (error) return fail(error.message);
  revalidatePath("/admin/master");
  return { ok: true };
}

export async function upsertShift(input: unknown): Promise<MasterActionResult> {
  const user = await requireAdmin();
  const parsed = shiftSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Data tidak valid");

  const supabase = await createServerSupabaseClient();
  const { id, ...rest } = parsed.data;
  const payload = { ...rest, created_by: user.id };

  const { error } = id
    ? await supabase.from("master_shift").update(payload).eq("id", id)
    : await supabase.from("master_shift").insert(payload);

  if (error) return fail(error.message);
  revalidatePath("/admin/master");
  return { ok: true };
}

export async function upsertKorsec(input: unknown): Promise<MasterActionResult> {
  const user = await requireAdmin();
  const parsed = korsecSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Data tidak valid");

  const supabase = await createServerSupabaseClient();
  const { id, ...rest } = parsed.data;
  const payload = { ...rest, no_hp: rest.no_hp || null, created_by: user.id };

  const { error } = id
    ? await supabase.from("master_korsec").update(payload).eq("id", id)
    : await supabase.from("master_korsec").insert(payload);

  if (error) return fail(error.message);
  revalidatePath("/admin/master");
  return { ok: true };
}

export async function upsertPambi(input: unknown): Promise<MasterActionResult> {
  const user = await requireAdmin();
  const parsed = pambiSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Data tidak valid");

  const supabase = await createServerSupabaseClient();
  const { id, ...rest } = parsed.data;
  const payload = {
    ...rest,
    nip: rest.nip || null,
    jabatan: rest.jabatan || null,
    photo_url: rest.photo_url || null,
    created_by: user.id,
  };

  const { error } = id
    ? await supabase.from("master_pambi_organik").update(payload).eq("id", id)
    : await supabase.from("master_pambi_organik").insert(payload);

  if (error) return fail(error.message);
  revalidatePath("/admin/master");
  return { ok: true };
}

export async function upsertContactPerson(input: unknown): Promise<MasterActionResult> {
  const user = await requireAdmin();
  const parsed = contactPersonSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Data tidak valid");

  const supabase = await createServerSupabaseClient();
  const { id, ...rest } = parsed.data;
  const payload = {
    ...rest,
    jabatan: rest.jabatan || null,
    no_hp: rest.no_hp || null,
    foto_url: rest.foto_url || null,
    created_by: user.id,
  };

  const { error } = id
    ? await supabase.from("master_contact_person").update(payload).eq("id", id)
    : await supabase.from("master_contact_person").insert(payload);

  if (error) return fail(error.message);
  revalidatePath("/admin/master");
  return { ok: true };
}

export async function saveDailyAssignments(input: unknown): Promise<MasterActionResult> {
  const user = await requireAdmin();
  const parsed = dailyAssignmentSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Data tidak valid");

  const supabase = await createServerSupabaseClient();
  const rows: Array<{
    tanggal: string;
    jenis: ContactPersonJenis;
    contact_person_id: string;
    created_by: string;
  }> = [
    {
      tanggal: parsed.data.tanggal,
      jenis: "OPERATIONAL_COMMANDER",
      contact_person_id: parsed.data.operational_commander_id,
      created_by: user.id,
    },
    {
      tanggal: parsed.data.tanggal,
      jenis: "SCC",
      contact_person_id: parsed.data.scc_id,
      created_by: user.id,
    },
    {
      tanggal: parsed.data.tanggal,
      jenis: "ESS",
      contact_person_id: parsed.data.ess_id,
      created_by: user.id,
    },
  ];

  const { error } = await supabase.from("daily_contact_assignment").upsert(rows, {
    onConflict: "tanggal,jenis",
  });

  if (error) return fail(error.message);
  revalidatePath("/admin/penugasan");
  return { ok: true };
}

export async function getDailyAssignments(tanggal: string) {
  await requireAdmin();
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("daily_contact_assignment")
    .select("*")
    .eq("tanggal", tanggal);

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function setMasterActive(
  table:
    | "master_wilayah"
    | "master_gedung"
    | "master_shift"
    | "master_korsec"
    | "master_pambi_organik"
    | "master_contact_person",
  id: string,
  active: boolean,
): Promise<MasterActionResult> {
  await requireAdmin();
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from(table).update({ active }).eq("id", id);
  if (error) return fail(error.message);
  revalidatePath("/admin/master");
  return { ok: true };
}


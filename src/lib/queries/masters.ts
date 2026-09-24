"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdmin, requireUser } from "@/lib/auth/session";
import type {
  MasterContactPerson,
  MasterGedung,
  MasterKorsec,
  MasterPambiOrganik,
  MasterShift,
  MasterWilayah,
} from "@/types/database";

export async function getActiveMastersForPersonnel() {
  await requireUser();
  const supabase = await createServerSupabaseClient();

  const [wilayah, gedung, shift, korsec] = await Promise.all([
    supabase
      .from("master_wilayah")
      .select("*")
      .eq("active", true)
      .order("nama_wilayah"),
    supabase
      .from("master_gedung")
      .select("*")
      .eq("active", true)
      .order("nama_gedung"),
    supabase.from("master_shift").select("*").eq("active", true).order("jam_mulai"),
    supabase
      .from("master_korsec")
      .select("*")
      .eq("active", true)
      .order("nama_korsec"),
  ]);

  if (wilayah.error) throw new Error(wilayah.error.message);
  if (gedung.error) throw new Error(gedung.error.message);
  if (shift.error) throw new Error(shift.error.message);
  if (korsec.error) throw new Error(korsec.error.message);

  return {
    wilayah: wilayah.data as MasterWilayah[],
    gedung: gedung.data as MasterGedung[],
    shift: shift.data as MasterShift[],
    korsec: korsec.data as MasterKorsec[],
  };
}

export async function getAdminMasters() {
  await requireAdmin();
  const supabase = await createServerSupabaseClient();

  const [wilayah, gedung, shift, korsec, pambi, contact] = await Promise.all([
    supabase.from("master_wilayah").select("*").order("nama_wilayah"),
    supabase.from("master_gedung").select("*").order("nama_gedung"),
    supabase.from("master_shift").select("*").order("jam_mulai"),
    supabase.from("master_korsec").select("*").order("nama_korsec"),
    supabase.from("master_pambi_organik").select("*").order("nama"),
    supabase.from("master_contact_person").select("*").order("nama"),
  ]);

  const errors = [wilayah, gedung, shift, korsec, pambi, contact]
    .map((result) => result.error?.message)
    .filter(Boolean);

  if (errors.length) {
    throw new Error(errors.join("; "));
  }

  return {
    wilayah: wilayah.data as MasterWilayah[],
    gedung: gedung.data as MasterGedung[],
    shift: shift.data as MasterShift[],
    korsec: korsec.data as MasterKorsec[],
    pambi: pambi.data as MasterPambiOrganik[],
    contact: contact.data as MasterContactPerson[],
  };
}


"use server";

import { requireUser } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  personnelReportSchema,
  type PersonnelReportValues,
} from "@/lib/validations/personnel";

export type SubmitResult<T = Record<string, never>> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type PersonnelSubmitData = PersonnelReportValues & {
  wilayah_nama: string;
  gedung_nama: string;
  shift_nama: string;
  korsec_nama: string;
};

export async function submitPersonnelReport(
  input: PersonnelReportValues,
): Promise<SubmitResult<PersonnelSubmitData>> {
  const user = await requireUser();
  const parsed = personnelReportSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  const supabase = await createServerSupabaseClient();
  const values = parsed.data;

  const { data: gedung, error: gedungError } = await supabase
    .from("master_gedung")
    .select("id, nama_gedung, wilayah_id")
    .eq("id", values.gedung_id)
    .eq("active", true)
    .maybeSingle();

  if (gedungError || !gedung) {
    return { ok: false, error: "Gedung tidak ditemukan" };
  }

  if (gedung.wilayah_id !== values.wilayah_id) {
    return { ok: false, error: "Gedung tidak sesuai dengan wilayah yang dipilih" };
  }

  const [{ data: wilayah }, { data: shift }, { data: korsec }] = await Promise.all([
    supabase
      .from("master_wilayah")
      .select("nama_wilayah")
      .eq("id", values.wilayah_id)
      .eq("active", true)
      .maybeSingle(),
    supabase
      .from("master_shift")
      .select("nama_shift")
      .eq("id", values.shift_id)
      .eq("active", true)
      .maybeSingle(),
    supabase
      .from("master_korsec")
      .select("nama_korsec")
      .eq("id", values.korsec_id)
      .eq("active", true)
      .maybeSingle(),
  ]);

  if (!wilayah || !shift || !korsec) {
    return { ok: false, error: "Master data tidak lengkap atau tidak aktif" };
  }

  const { error } = await supabase.from("daily_personnel_reports").insert({
    tanggal: values.tanggal,
    wilayah_id: values.wilayah_id,
    gedung_id: values.gedung_id,
    shift_id: values.shift_id,
    korsec_id: values.korsec_id,
    jumlah_personil: values.jumlah_personil,
    created_by: user.id,
  });

  if (error) {
    if (error.code === "23505") {
      return {
        ok: false,
        error: "Laporan untuk tanggal, gedung, dan shift ini sudah ada",
      };
    }
    return { ok: false, error: error.message };
  }

  return {
    ok: true,
    data: {
      ...values,
      wilayah_nama: wilayah.nama_wilayah,
      gedung_nama: gedung.nama_gedung,
      shift_nama: shift.nama_shift,
      korsec_nama: korsec.nama_korsec,
    },
  };
}


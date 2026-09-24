"use server";

import { requireUser } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  giatMasyarakatSchema,
  unjukRasaSchema,
  type GiatMasyarakatValues,
  type UnjukRasaValues,
} from "@/lib/validations/activity";
import type { ActivityJenis } from "@/types/database";
import type { SubmitResult } from "@/lib/actions/personnel";

export type ActivitySubmitData = {
  jenis: ActivityJenis;
  tanggal: string;
  waktu_mulai: string;
  waktu_selesai: string;
  lokasi_text: string;
  nama_kegiatan: string | null;
  jumlah_peserta: number;
  pihak_terlibat: string;
  tingkat_perhatian: string;
  uraian: string;
};

export async function submitGiatMasyarakat(
  input: GiatMasyarakatValues,
): Promise<SubmitResult<ActivitySubmitData>> {
  const user = await requireUser();
  const parsed = giatMasyarakatSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  return insertActivity(user.id, "GIAT_MASYARAKAT", parsed.data);
}

export async function submitUnjukRasa(
  input: UnjukRasaValues,
): Promise<SubmitResult<ActivitySubmitData>> {
  const user = await requireUser();
  const parsed = unjukRasaSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  return insertActivity(user.id, "UNRAS", { ...parsed.data, nama_kegiatan: null });
}

async function insertActivity(
  userId: string,
  jenis: ActivityJenis,
  values: {
    tanggal: string;
    waktu_mulai: string;
    waktu_selesai: string;
    lokasi_text: string;
    nama_kegiatan?: string | null;
    jumlah_peserta: number;
    pihak_terlibat: string;
    tingkat_perhatian: "RENDAH" | "SEDANG" | "TINGGI" | "KRITIS";
    uraian: string;
  },
): Promise<SubmitResult<ActivitySubmitData>> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from("activity_reports").insert({
    jenis,
    tanggal: values.tanggal,
    waktu_mulai: values.waktu_mulai,
    waktu_selesai: values.waktu_selesai,
    lokasi_text: values.lokasi_text,
    nama_kegiatan: values.nama_kegiatan ?? null,
    jumlah_peserta: values.jumlah_peserta,
    pihak_terlibat: values.pihak_terlibat,
    tingkat_perhatian: values.tingkat_perhatian,
    uraian: values.uraian,
    created_by: userId,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return {
    ok: true,
    data: {
      jenis,
      tanggal: values.tanggal,
      waktu_mulai: values.waktu_mulai,
      waktu_selesai: values.waktu_selesai,
      lokasi_text: values.lokasi_text,
      nama_kegiatan: values.nama_kegiatan ?? null,
      jumlah_peserta: values.jumlah_peserta,
      pihak_terlibat: values.pihak_terlibat,
      tingkat_perhatian: values.tingkat_perhatian,
      uraian: values.uraian,
    },
  };
}


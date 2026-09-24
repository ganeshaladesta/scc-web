import { z } from "zod";

export const wilayahSchema = z.object({
  id: z.string().uuid().optional(),
  nama_wilayah: z.string().min(2, "Nama wilayah wajib diisi"),
  keterangan: z.string().optional(),
  active: z.boolean(),
});

export const gedungSchema = z.object({
  id: z.string().uuid().optional(),
  wilayah_id: z.string().uuid("Pilih wilayah"),
  nama_gedung: z.string().min(2, "Nama gedung wajib diisi"),
  alamat: z.string().optional(),
  active: z.boolean(),
});

export const shiftSchema = z.object({
  id: z.string().uuid().optional(),
  nama_shift: z.string().min(2, "Nama shift wajib diisi"),
  jam_mulai: z.string().min(1, "Jam mulai wajib diisi"),
  jam_selesai: z.string().min(1, "Jam selesai wajib diisi"),
  active: z.boolean(),
});

export const korsecSchema = z.object({
  id: z.string().uuid().optional(),
  nama_korsec: z.string().min(2, "Nama Korsec wajib diisi"),
  no_hp: z.string().optional(),
  active: z.boolean(),
});

export const pambiSchema = z.object({
  id: z.string().uuid().optional(),
  nama: z.string().min(2, "Nama wajib diisi"),
  nip: z.string().optional(),
  jabatan: z.string().optional(),
  photo_url: z.string().optional(),
  active: z.boolean(),
});

export const contactPersonSchema = z.object({
  id: z.string().uuid().optional(),
  nama: z.string().min(2, "Nama wajib diisi"),
  jenis: z.enum(["OPERATIONAL_COMMANDER", "SCC", "ESS"]),
  jabatan: z.string().optional(),
  no_hp: z.string().optional(),
  foto_url: z.string().optional(),
  active: z.boolean(),
});

export const dailyAssignmentSchema = z.object({
  tanggal: z.string().min(1, "Tanggal wajib diisi"),
  operational_commander_id: z.string().uuid("Pilih Operational Commander"),
  scc_id: z.string().uuid("Pilih petugas SCC"),
  ess_id: z.string().uuid("Pilih petugas ESS"),
});


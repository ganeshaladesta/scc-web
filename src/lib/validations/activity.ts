import { z } from "zod";

const tingkatPerhatian = z.enum(["RENDAH", "SEDANG", "TINGGI", "KRITIS"], {
  required_error: "Pilih tingkat perhatian",
  invalid_type_error: "Pilih tingkat perhatian",
});

const activityBaseSchema = z.object({
  tanggal: z.string().min(1, "Tanggal wajib diisi"),
  waktu_mulai: z.string().min(1, "Waktu mulai wajib diisi"),
  waktu_selesai: z.string().min(1, "Waktu selesai wajib diisi"),
  lokasi_text: z.string().min(3, "Lokasi wajib diisi"),
  pihak_terlibat: z.string().min(2, "Pihak terlibat wajib diisi"),
  tingkat_perhatian: tingkatPerhatian,
  uraian: z.string().min(5, "Uraian wajib diisi"),
});

export const giatMasyarakatSchema = activityBaseSchema.extend({
  nama_kegiatan: z.string().min(3, "Nama kegiatan wajib diisi"),
  jumlah_peserta: z.coerce
    .number({
      required_error: "Jumlah peserta wajib diisi",
      invalid_type_error: "Jumlah peserta wajib diisi",
    })
    .int("Jumlah peserta harus bilangan bulat")
    .min(0, "Jumlah peserta tidak boleh negatif"),
});

export const unjukRasaSchema = activityBaseSchema.extend({
  jumlah_peserta: z.coerce
    .number({
      required_error: "Jumlah massa wajib diisi",
      invalid_type_error: "Jumlah massa wajib diisi",
    })
    .int("Jumlah massa harus bilangan bulat")
    .min(0, "Jumlah massa tidak boleh negatif"),
});

export type GiatMasyarakatValues = z.infer<typeof giatMasyarakatSchema>;
export type UnjukRasaValues = z.infer<typeof unjukRasaSchema>;


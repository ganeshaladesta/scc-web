import { z } from "zod";

export const personnelReportSchema = z.object({
  tanggal: z.string().min(1, "Tanggal wajib diisi"),
  wilayah_id: z.string().uuid("Pilih wilayah"),
  gedung_id: z.string().uuid("Pilih gedung"),
  shift_id: z.string().uuid("Pilih shift"),
  korsec_id: z.string().uuid("Pilih nama Korsec"),
  jumlah_personil: z.coerce
    .number({
      required_error: "Jumlah personil wajib diisi",
      invalid_type_error: "Jumlah personil wajib diisi",
    })
    .int("Jumlah personil harus bilangan bulat")
    .min(0, "Jumlah personil tidak boleh negatif"),
});

export type PersonnelReportValues = z.infer<typeof personnelReportSchema>;


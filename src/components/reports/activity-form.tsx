"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, NativeSelect, controlClassName } from "@/components/forms/field";
import { ErrorState, SuccessSummary } from "@/components/feedback/states";
import { submitGiatMasyarakat, submitUnjukRasa } from "@/lib/actions/activity";
import { formatLongDate, formatTime, todayISODate } from "@/lib/format";
import {
  giatMasyarakatSchema,
  unjukRasaSchema,
  type GiatMasyarakatValues,
  type UnjukRasaValues,
} from "@/lib/validations/activity";
import { TINGKAT_PERHATIAN_LABEL, type ActivityJenis } from "@/types/database";

const tingkatOptions = Object.entries(TINGKAT_PERHATIAN_LABEL);

export function ActivityForm({ jenis }: { jenis: ActivityJenis }) {
  const isGiat = jenis === "GIAT_MASYARAKAT";
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    tanggal: string;
    waktu_mulai: string;
    waktu_selesai: string;
    lokasi_text: string;
    nama_kegiatan: string | null;
    jumlah_peserta: number;
    pihak_terlibat: string;
    tingkat_perhatian: string;
    uraian: string;
  } | null>(null);

  const giatForm = useForm<GiatMasyarakatValues>({
    resolver: zodResolver(giatMasyarakatSchema),
    defaultValues: {
      tanggal: todayISODate(),
      waktu_mulai: "",
      waktu_selesai: "",
      nama_kegiatan: "",
      lokasi_text: "",
      jumlah_peserta: 0,
      pihak_terlibat: "",
      tingkat_perhatian: "SEDANG",
      uraian: "",
    },
  });

  const unrasForm = useForm<UnjukRasaValues>({
    resolver: zodResolver(unjukRasaSchema),
    defaultValues: {
      tanggal: todayISODate(),
      waktu_mulai: "",
      waktu_selesai: "",
      lokasi_text: "",
      jumlah_peserta: 0,
      pihak_terlibat: "",
      tingkat_perhatian: "SEDANG",
      uraian: "",
    },
  });

  if (success) {
    return (
      <SuccessSummary
        title={isGiat ? "Laporan giat masyarakat berhasil dikirim" : "Laporan unjuk rasa berhasil dikirim"}
        rows={[
          { label: "Tanggal", value: formatLongDate(success.tanggal) },
          {
            label: "Waktu",
            value: `${formatTime(success.waktu_mulai)} - ${formatTime(success.waktu_selesai)}`,
          },
          ...(success.nama_kegiatan
            ? [{ label: "Nama Kegiatan", value: success.nama_kegiatan }]
            : []),
          { label: isGiat ? "Lokasi" : "Lokasi Aksi", value: success.lokasi_text },
          {
            label: isGiat ? "Jumlah Peserta" : "Jumlah Massa",
            value: String(success.jumlah_peserta),
          },
          { label: "Pihak Terlibat", value: success.pihak_terlibat },
          {
            label: "Tingkat Perhatian",
            value:
              TINGKAT_PERHATIAN_LABEL[
                success.tingkat_perhatian as keyof typeof TINGKAT_PERHATIAN_LABEL
              ] ?? success.tingkat_perhatian,
          },
        ]}
      />
    );
  }

  const errors = isGiat ? giatForm.formState.errors : unrasForm.formState.errors;

const register = (name: string) =>
  isGiat
    ? giatForm.register(name as keyof GiatMasyarakatValues)
    : unrasForm.register(name as keyof UnjukRasaValues);

  return (
    <form
      className="space-y-4"
      onSubmit={
        isGiat
          ? giatForm.handleSubmit((values) => {
              setServerError(null);
              startTransition(async () => {
                const result = await submitGiatMasyarakat(values);
                if (!result.ok) {
                  setServerError(result.error);
                  return;
                }
                setSuccess(result.data);
              });
            })
          : unrasForm.handleSubmit((values) => {
              setServerError(null);
              startTransition(async () => {
                const result = await submitUnjukRasa(values);
                if (!result.ok) {
                  setServerError(result.error);
                  return;
                }
                setSuccess(result.data);
              });
            })
      }
    >
      <Field label="Tanggal" htmlFor="tanggal" error={errors.tanggal?.message}>
        <Input id="tanggal" type="date" className={controlClassName} {...register("tanggal")} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Waktu Mulai" htmlFor="waktu_mulai" error={errors.waktu_mulai?.message}>
          <Input
            id="waktu_mulai"
            type="time"
            className={controlClassName}
            {...register("waktu_mulai")}
          />
        </Field>
        <Field
          label="Waktu Selesai"
          htmlFor="waktu_selesai"
          error={errors.waktu_selesai?.message}
        >
          <Input
            id="waktu_selesai"
            type="time"
            className={controlClassName}
            {...register("waktu_selesai")}
          />
        </Field>
      </div>

      {isGiat ? (
        <Field
          label="Nama Kegiatan"
          htmlFor="nama_kegiatan"
          error={giatForm.formState.errors.nama_kegiatan?.message}
        >
          <Input
            id="nama_kegiatan"
            className={controlClassName}
            {...giatForm.register("nama_kegiatan")}
          />
        </Field>
      ) : null}

      <Field
        label={isGiat ? "Lokasi" : "Lokasi Aksi"}
        htmlFor="lokasi_text"
        hint="Tulis alamat atau nama tempat secara bebas."
        error={errors.lokasi_text?.message}
      >
        <Input
          id="lokasi_text"
          className={controlClassName}
          placeholder="Contoh: Lapangan Banteng, Jakarta Pusat"
          {...register("lokasi_text")}
        />
      </Field>

      <Field
        label={isGiat ? "Jumlah Peserta" : "Jumlah Massa"}
        htmlFor="jumlah_peserta"
        error={errors.jumlah_peserta?.message}
      >
        <Input
          id="jumlah_peserta"
          type="number"
          min={0}
          step={1}
          inputMode="numeric"
          className={controlClassName}
          {...register("jumlah_peserta")}
        />
      </Field>

      <Field
        label="Pihak Terlibat"
        htmlFor="pihak_terlibat"
        error={errors.pihak_terlibat?.message}
      >
        <Input id="pihak_terlibat" className={controlClassName} {...register("pihak_terlibat")} />
      </Field>

      <Field
        label="Tingkat Perhatian"
        htmlFor="tingkat_perhatian"
        error={errors.tingkat_perhatian?.message}
      >
        <NativeSelect id="tingkat_perhatian" {...register("tingkat_perhatian")}>
          {tingkatOptions.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </NativeSelect>
      </Field>

      <Field
        label={isGiat ? "Uraian" : "Uraian Situasi"}
        htmlFor="uraian"
        error={errors.uraian?.message}
      >
        <Textarea id="uraian" rows={5} className="min-h-28 rounded-xl text-base" {...register("uraian")} />
      </Field>

      {serverError ? <ErrorState message={serverError} /> : null}

      <div className="sticky bottom-20 pt-2">
        <Button type="submit" disabled={isPending} className="h-12 w-full rounded-xl text-base">
          {isPending ? "Mengirim..." : "KIRIM LAPORAN"}
        </Button>
      </div>
    </form>
  );
}


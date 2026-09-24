"use client";

import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, NativeSelect, controlClassName } from "@/components/forms/field";
import { ErrorState, SuccessSummary } from "@/components/feedback/states";
import { submitPersonnelReport } from "@/lib/actions/personnel";
import { formatLongDate, todayISODate } from "@/lib/format";
import {
  personnelReportSchema,
  type PersonnelReportValues,
} from "@/lib/validations/personnel";
import type { MasterGedung, MasterKorsec, MasterShift, MasterWilayah } from "@/types/database";

export function PersonnelForm({
  wilayah,
  gedung,
  shift,
  korsec,
}: {
  wilayah: MasterWilayah[];
  gedung: MasterGedung[];
  shift: MasterShift[];
  korsec: MasterKorsec[];
}) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<Awaited<
    ReturnType<typeof submitPersonnelReport>
  > | null>(null);

  const form = useForm<PersonnelReportValues>({
    resolver: zodResolver(personnelReportSchema),
    defaultValues: {
      tanggal: todayISODate(),
      wilayah_id: "",
      gedung_id: "",
      shift_id: "",
      korsec_id: "",
      jumlah_personil: 0,
    },
  });

  const selectedWilayah = form.watch("wilayah_id");
  const filteredGedung = useMemo(
    () => gedung.filter((item) => item.wilayah_id === selectedWilayah),
    [gedung, selectedWilayah],
  );

  if (success?.ok) {
    return (
      <div className="space-y-4">
        <SuccessSummary
          title="Laporan personil berhasil dikirim"
          rows={[
            { label: "Tanggal", value: formatLongDate(success.data.tanggal) },
            { label: "Wilayah", value: success.data.wilayah_nama },
            { label: "Gedung", value: success.data.gedung_nama },
            { label: "Shift", value: success.data.shift_nama },
            { label: "Korsec", value: success.data.korsec_nama },
            { label: "Jumlah Personil", value: String(success.data.jumlah_personil) },
          ]}
        />
        <Button
          type="button"
          className="h-11 w-full rounded-xl"
          onClick={() => {
            setSuccess(null);
            form.reset({
              tanggal: todayISODate(),
              wilayah_id: "",
              gedung_id: "",
              shift_id: "",
              korsec_id: "",
              jumlah_personil: 0,
            });
          }}
        >
          Kirim laporan lain
        </Button>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) => {
        setServerError(null);
        startTransition(async () => {
          const result = await submitPersonnelReport(values);
          if (!result.ok) {
            setServerError(result.error);
            return;
          }
          setSuccess(result);
        });
      })}
    >
      <Field label="Tanggal" htmlFor="tanggal" error={form.formState.errors.tanggal?.message}>
        <Input
          id="tanggal"
          type="date"
          className={controlClassName}
          {...form.register("tanggal")}
        />
      </Field>

      <Field label="Wilayah" htmlFor="wilayah_id" error={form.formState.errors.wilayah_id?.message}>
        <NativeSelect
          id="wilayah_id"
          {...form.register("wilayah_id", {
            onChange: () => form.setValue("gedung_id", ""),
          })}
        >
          <option value="">Pilih Wilayah</option>
          {wilayah.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nama_wilayah}
            </option>
          ))}
        </NativeSelect>
      </Field>

      <Field label="Gedung" htmlFor="gedung_id" error={form.formState.errors.gedung_id?.message}>
        <NativeSelect id="gedung_id" disabled={!selectedWilayah} {...form.register("gedung_id")}>
          <option value="">Pilih Gedung</option>
          {filteredGedung.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nama_gedung}
            </option>
          ))}
        </NativeSelect>
      </Field>

      <Field label="Shift" htmlFor="shift_id" error={form.formState.errors.shift_id?.message}>
        <NativeSelect id="shift_id" {...form.register("shift_id")}>
          <option value="">Pilih Shift</option>
          {shift.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nama_shift} ({item.jam_mulai.slice(0, 5)} - {item.jam_selesai.slice(0, 5)})
            </option>
          ))}
        </NativeSelect>
      </Field>

      <Field
        label="Nama Korsec"
        htmlFor="korsec_id"
        error={form.formState.errors.korsec_id?.message}
      >
        <NativeSelect id="korsec_id" {...form.register("korsec_id")}>
          <option value="">Pilih Korsec</option>
          {korsec.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nama_korsec}
            </option>
          ))}
        </NativeSelect>
      </Field>

      <Field
        label="Jumlah Personil"
        htmlFor="jumlah_personil"
        error={form.formState.errors.jumlah_personil?.message}
      >
        <Input
          id="jumlah_personil"
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          className={controlClassName}
          {...form.register("jumlah_personil")}
        />
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


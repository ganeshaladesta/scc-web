"use client";

import { useRouter } from "next/navigation";
import { Field, NativeSelect, controlClassName } from "@/components/forms/field";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/feedback/states";
import { formatLongDate, formatTime } from "@/lib/format";
import {
  ACTIVITY_JENIS_LABEL,
  TINGKAT_PERHATIAN_LABEL,
  type ActivityJenis,
  type ActivityReport,
} from "@/types/database";

type PersonnelRow = {
  id: string;
  tanggal: string;
  jumlah_personil: number;
  created_at: string;
  master_wilayah: { nama_wilayah: string } | { nama_wilayah: string }[] | null;
  master_gedung: { nama_gedung: string } | { nama_gedung: string }[] | null;
  master_shift: { nama_shift: string } | { nama_shift: string }[] | null;
  master_korsec: { nama_korsec: string } | { nama_korsec: string }[] | null;
};

function relationName<T extends Record<string, string>>(
  value: T | T[] | null | undefined,
  key: keyof T,
) {
  if (!value) return "-";
  const row = Array.isArray(value) ? value[0] : value;
  return row?.[key] ?? "-";
}

export function HistoryFilters({
  tanggal,
  jenis,
  tab = "kegiatan",
}: {
  tanggal?: string;
  jenis?: string;
  tab?: "personil" | "kegiatan";
}) {
  const router = useRouter();

  function update(next: { tanggal?: string; jenis?: string }) {
    const params = new URLSearchParams();
    const tanggalValue = next.tanggal ?? tanggal ?? "";
    const jenisValue = next.jenis ?? jenis ?? "";
    if (tanggalValue) params.set("tanggal", tanggalValue);
    if (jenisValue) params.set("jenis", jenisValue);
    params.set("tab", tab);
    router.push(`/riwayat?${params.toString()}`);
  }

  return (
    <div className="space-y-3">
      <Field label="Tanggal" htmlFor="filter-tanggal">
        <Input
          id="filter-tanggal"
          type="date"
          className={controlClassName}
          value={tanggal ?? ""}
          onChange={(event) => update({ tanggal: event.target.value })}
        />
      </Field>
      {tab === "kegiatan" ? (
        <Field label="Jenis kegiatan" htmlFor="filter-jenis">
          <NativeSelect
            id="filter-jenis"
            value={jenis ?? ""}
            onChange={(event) => update({ jenis: event.target.value })}
          >
            <option value="">Semua</option>
            <option value="GIAT_MASYARAKAT">Giat Masyarakat</option>
            <option value="UNRAS">Unjuk Rasa</option>
          </NativeSelect>
        </Field>
      ) : null}
    </div>
  );
}

export function PersonnelHistoryList({ items }: { items: PersonnelRow[] }) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="Belum ada laporan personil"
        description="Laporan yang sudah dikirim akan tampil di sini."
      />
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article key={item.id} className="rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(11,44,95,0.05)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium text-[#0B2C5F]">{formatLongDate(item.tanggal)}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {relationName(item.master_wilayah, "nama_wilayah")} ·{" "}
                {relationName(item.master_gedung, "nama_gedung")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {relationName(item.master_shift, "nama_shift")} ·{" "}
                {relationName(item.master_korsec, "nama_korsec")}
              </p>
            </div>
            <Badge variant="secondary">Terkirim</Badge>
          </div>
          <p className="mt-3 text-2xl font-semibold text-[#0B2C5F]">{item.jumlah_personil}</p>
          <p className="text-xs text-muted-foreground">Jumlah personil</p>
        </article>
      ))}
    </div>
  );
}

export function ActivityHistoryList({ items }: { items: ActivityReport[] }) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="Belum ada laporan kegiatan"
        description="Giat masyarakat dan unjuk rasa yang sudah dikirim akan tampil di sini."
      />
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article key={item.id} className="rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(11,44,95,0.05)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium text-[#0B2C5F]">{formatLongDate(item.tanggal)}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatTime(item.waktu_mulai)} - {formatTime(item.waktu_selesai)}
              </p>
            </div>
            <Badge variant={item.jenis === "UNRAS" ? "destructive" : "secondary"}>
              {ACTIVITY_JENIS_LABEL[item.jenis as ActivityJenis]}
            </Badge>
          </div>
          <p className="mt-3 text-sm font-medium text-[#0B2C5F]">{item.lokasi_text}</p>
          {item.nama_kegiatan ? (
            <p className="mt-1 text-sm text-muted-foreground">{item.nama_kegiatan}</p>
          ) : null}
          <p className="mt-2 text-xs text-muted-foreground">
            {TINGKAT_PERHATIAN_LABEL[item.tingkat_perhatian]} · {item.jumlah_peserta} orang
          </p>
        </article>
      ))}
    </div>
  );
}


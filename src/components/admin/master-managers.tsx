"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { EmptyState, ErrorState } from "@/components/feedback/states";
import { Field, NativeSelect, controlClassName } from "@/components/forms/field";
import { Textarea } from "@/components/ui/textarea";
import {
  setMasterActive,
  upsertContactPerson,
  upsertGedung,
  upsertKorsec,
  upsertPambi,
  upsertShift,
  upsertWilayah,
  type MasterActionResult,
} from "@/lib/actions/masters";
import type {
  ContactPersonJenis,
  MasterContactPerson,
  MasterGedung,
  MasterKorsec,
  MasterPambiOrganik,
  MasterShift,
  MasterWilayah,
} from "@/types/database";
import { CONTACT_JENIS_LABEL } from "@/types/database";

function useMasterSave() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(action: () => Promise<MasterActionResult>, onDone: () => void) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onDone();
      router.refresh();
    });
  }

  return { pending, error, setError, run };
}

function SearchInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <Input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Cari..."
      className={controlClassName}
      aria-label="Cari"
    />
  );
}

function ActiveRow({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: (next: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Switch checked={active} onCheckedChange={onToggle} aria-label="Status aktif" />
      <Badge variant={active ? "secondary" : "outline"}>{active ? "Aktif" : "Nonaktif"}</Badge>
    </div>
  );
}

export function WilayahMaster({ items }: { items: MasterWilayah[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<MasterWilayah>>({
    nama_wilayah: "",
    keterangan: "",
    active: true,
  });
  const { pending, error, run } = useMasterSave();
  const filtered = useMemo(
    () =>
      items.filter((item) =>
        item.nama_wilayah.toLowerCase().includes(query.toLowerCase()),
      ),
    [items, query],
  );

  return (
    <MasterShell
      query={query}
      setQuery={setQuery}
      onAdd={() => {
        setEditing({ nama_wilayah: "", keterangan: "", active: true });
        setOpen(true);
      }}
      empty={filtered.length === 0}
    >
      {filtered.map((item) => (
        <MasterItem
          key={item.id}
          title={item.nama_wilayah}
          subtitle={item.keterangan}
          active={item.active}
          onEdit={() => {
            setEditing(item);
            setOpen(true);
          }}
          onToggle={(active) => run(() => setMasterActive("master_wilayah", item.id, active), () => undefined)}
        />
      ))}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editing.id ? "Ubah wilayah" : "Tambah wilayah"}</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              run(
                () =>
                  upsertWilayah({
                    id: editing.id,
                    nama_wilayah: editing.nama_wilayah ?? "",
                    keterangan: editing.keterangan ?? "",
                    active: editing.active ?? true,
                  }),
                () => setOpen(false),
              );
            }}
          >
            <Field label="Nama Wilayah" htmlFor="nama_wilayah">
              <Input
                id="nama_wilayah"
                className={controlClassName}
                value={editing.nama_wilayah ?? ""}
                onChange={(event) =>
                  setEditing((current) => ({ ...current, nama_wilayah: event.target.value }))
                }
              />
            </Field>
            <Field label="Keterangan" htmlFor="keterangan">
              <Textarea
                id="keterangan"
                value={editing.keterangan ?? ""}
                onChange={(event) =>
                  setEditing((current) => ({ ...current, keterangan: event.target.value }))
                }
              />
            </Field>
            <SaveFooter pending={pending} error={error} />
          </form>
        </DialogContent>
      </Dialog>
    </MasterShell>
  );
}

export function GedungMaster({
  items,
  wilayah,
}: {
  items: MasterGedung[];
  wilayah: MasterWilayah[];
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<MasterGedung>>({
    nama_gedung: "",
    alamat: "",
    wilayah_id: "",
    active: true,
  });
  const { pending, error, run } = useMasterSave();
  const wilayahName = (id: string) =>
    wilayah.find((item) => item.id === id)?.nama_wilayah ?? "-";
  const filtered = useMemo(
    () =>
      items.filter((item) =>
        `${item.nama_gedung} ${wilayahName(item.wilayah_id)}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [items, query, wilayah],
  );

  return (
    <MasterShell
      query={query}
      setQuery={setQuery}
      onAdd={() => {
        setEditing({ nama_gedung: "", alamat: "", wilayah_id: "", active: true });
        setOpen(true);
      }}
      empty={filtered.length === 0}
    >
      {filtered.map((item) => (
        <MasterItem
          key={item.id}
          title={item.nama_gedung}
          subtitle={`${wilayahName(item.wilayah_id)}${item.alamat ? ` · ${item.alamat}` : ""}`}
          active={item.active}
          onEdit={() => {
            setEditing(item);
            setOpen(true);
          }}
          onToggle={(active) => run(() => setMasterActive("master_gedung", item.id, active), () => undefined)}
        />
      ))}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editing.id ? "Ubah gedung" : "Tambah gedung"}</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              run(
                () =>
                  upsertGedung({
                    id: editing.id,
                    wilayah_id: editing.wilayah_id ?? "",
                    nama_gedung: editing.nama_gedung ?? "",
                    alamat: editing.alamat ?? "",
                    active: editing.active ?? true,
                  }),
                () => setOpen(false),
              );
            }}
          >
            <Field label="Wilayah" htmlFor="wilayah_id">
              <NativeSelect
                id="wilayah_id"
                value={editing.wilayah_id ?? ""}
                onChange={(event) =>
                  setEditing((current) => ({ ...current, wilayah_id: event.target.value }))
                }
              >
                <option value="">Pilih Wilayah</option>
                {wilayah.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nama_wilayah}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Nama Gedung" htmlFor="nama_gedung">
              <Input
                id="nama_gedung"
                className={controlClassName}
                value={editing.nama_gedung ?? ""}
                onChange={(event) =>
                  setEditing((current) => ({ ...current, nama_gedung: event.target.value }))
                }
              />
            </Field>
            <Field label="Alamat" htmlFor="alamat">
              <Textarea
                id="alamat"
                value={editing.alamat ?? ""}
                onChange={(event) =>
                  setEditing((current) => ({ ...current, alamat: event.target.value }))
                }
              />
            </Field>
            <SaveFooter pending={pending} error={error} />
          </form>
        </DialogContent>
      </Dialog>
    </MasterShell>
  );
}

export function ShiftMaster({ items }: { items: MasterShift[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<MasterShift>>({
    nama_shift: "",
    jam_mulai: "06:00",
    jam_selesai: "14:00",
    active: true,
  });
  const { pending, error, run } = useMasterSave();
  const filtered = items.filter((item) =>
    item.nama_shift.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <MasterShell
      query={query}
      setQuery={setQuery}
      onAdd={() => {
        setEditing({ nama_shift: "", jam_mulai: "06:00", jam_selesai: "14:00", active: true });
        setOpen(true);
      }}
      empty={filtered.length === 0}
    >
      {filtered.map((item) => (
        <MasterItem
          key={item.id}
          title={item.nama_shift}
          subtitle={`${item.jam_mulai.slice(0, 5)} - ${item.jam_selesai.slice(0, 5)}`}
          active={item.active}
          onEdit={() => {
            setEditing({
              ...item,
              jam_mulai: item.jam_mulai.slice(0, 5),
              jam_selesai: item.jam_selesai.slice(0, 5),
            });
            setOpen(true);
          }}
          onToggle={(active) => run(() => setMasterActive("master_shift", item.id, active), () => undefined)}
        />
      ))}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editing.id ? "Ubah shift" : "Tambah shift"}</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              run(
                () =>
                  upsertShift({
                    id: editing.id,
                    nama_shift: editing.nama_shift ?? "",
                    jam_mulai: editing.jam_mulai ?? "",
                    jam_selesai: editing.jam_selesai ?? "",
                    active: editing.active ?? true,
                  }),
                () => setOpen(false),
              );
            }}
          >
            <Field label="Nama Shift" htmlFor="nama_shift">
              <Input
                id="nama_shift"
                className={controlClassName}
                value={editing.nama_shift ?? ""}
                onChange={(event) =>
                  setEditing((current) => ({ ...current, nama_shift: event.target.value }))
                }
              />
            </Field>
            <Field label="Jam Mulai" htmlFor="jam_mulai">
              <Input
                id="jam_mulai"
                type="time"
                className={controlClassName}
                value={editing.jam_mulai ?? ""}
                onChange={(event) =>
                  setEditing((current) => ({ ...current, jam_mulai: event.target.value }))
                }
              />
            </Field>
            <Field label="Jam Selesai" htmlFor="jam_selesai">
              <Input
                id="jam_selesai"
                type="time"
                className={controlClassName}
                value={editing.jam_selesai ?? ""}
                onChange={(event) =>
                  setEditing((current) => ({ ...current, jam_selesai: event.target.value }))
                }
              />
            </Field>
            <SaveFooter pending={pending} error={error} />
          </form>
        </DialogContent>
      </Dialog>
    </MasterShell>
  );
}

export function KorsecMaster({ items }: { items: MasterKorsec[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<MasterKorsec>>({
    nama_korsec: "",
    no_hp: "",
    active: true,
  });
  const { pending, error, run } = useMasterSave();
  const filtered = items.filter((item) =>
    item.nama_korsec.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <MasterShell
      query={query}
      setQuery={setQuery}
      onAdd={() => {
        setEditing({ nama_korsec: "", no_hp: "", active: true });
        setOpen(true);
      }}
      empty={filtered.length === 0}
    >
      {filtered.map((item) => (
        <MasterItem
          key={item.id}
          title={item.nama_korsec}
          subtitle={item.no_hp}
          active={item.active}
          onEdit={() => {
            setEditing(item);
            setOpen(true);
          }}
          onToggle={(active) => run(() => setMasterActive("master_korsec", item.id, active), () => undefined)}
        />
      ))}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editing.id ? "Ubah Korsec" : "Tambah Korsec"}</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              run(
                () =>
                  upsertKorsec({
                    id: editing.id,
                    nama_korsec: editing.nama_korsec ?? "",
                    no_hp: editing.no_hp ?? "",
                    active: editing.active ?? true,
                  }),
                () => setOpen(false),
              );
            }}
          >
            <Field label="Nama Korsec" htmlFor="nama_korsec">
              <Input
                id="nama_korsec"
                className={controlClassName}
                value={editing.nama_korsec ?? ""}
                onChange={(event) =>
                  setEditing((current) => ({ ...current, nama_korsec: event.target.value }))
                }
              />
            </Field>
            <Field label="No HP" htmlFor="no_hp">
              <Input
                id="no_hp"
                className={controlClassName}
                value={editing.no_hp ?? ""}
                onChange={(event) =>
                  setEditing((current) => ({ ...current, no_hp: event.target.value }))
                }
              />
            </Field>
            <SaveFooter pending={pending} error={error} />
          </form>
        </DialogContent>
      </Dialog>
    </MasterShell>
  );
}

export function PambiMaster({ items }: { items: MasterPambiOrganik[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<MasterPambiOrganik>>({
    nama: "",
    nip: "",
    jabatan: "",
    photo_url: "",
    active: true,
  });
  const { pending, error, run } = useMasterSave();
  const filtered = items.filter((item) =>
    `${item.nama} ${item.nip ?? ""} ${item.jabatan ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <MasterShell
      query={query}
      setQuery={setQuery}
      onAdd={() => {
        setEditing({ nama: "", nip: "", jabatan: "", photo_url: "", active: true });
        setOpen(true);
      }}
      empty={filtered.length === 0}
    >
      {filtered.map((item) => (
        <MasterItem
          key={item.id}
          title={item.nama}
          subtitle={[item.nip, item.jabatan].filter(Boolean).join(" · ")}
          active={item.active}
          onEdit={() => {
            setEditing(item);
            setOpen(true);
          }}
          onToggle={(active) =>
            run(() => setMasterActive("master_pambi_organik", item.id, active), () => undefined)
          }
        />
      ))}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editing.id ? "Ubah PAMBI Organik" : "Tambah PAMBI Organik"}</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              run(
                () =>
                  upsertPambi({
                    id: editing.id,
                    nama: editing.nama ?? "",
                    nip: editing.nip ?? "",
                    jabatan: editing.jabatan ?? "",
                    photo_url: editing.photo_url ?? "",
                    active: editing.active ?? true,
                  }),
                () => setOpen(false),
              );
            }}
          >
            <Field label="Nama" htmlFor="nama">
              <Input
                id="nama"
                className={controlClassName}
                value={editing.nama ?? ""}
                onChange={(event) => setEditing((current) => ({ ...current, nama: event.target.value }))}
              />
            </Field>
            <Field label="NIP" htmlFor="nip">
              <Input
                id="nip"
                className={controlClassName}
                value={editing.nip ?? ""}
                onChange={(event) => setEditing((current) => ({ ...current, nip: event.target.value }))}
              />
            </Field>
            <Field label="Jabatan" htmlFor="jabatan">
              <Input
                id="jabatan"
                className={controlClassName}
                value={editing.jabatan ?? ""}
                onChange={(event) =>
                  setEditing((current) => ({ ...current, jabatan: event.target.value }))
                }
              />
            </Field>
            <Field label="Photo URL" htmlFor="photo_url" hint="Opsional. Unggah foto akan menyusul.">
              <Input
                id="photo_url"
                className={controlClassName}
                value={editing.photo_url ?? ""}
                onChange={(event) =>
                  setEditing((current) => ({ ...current, photo_url: event.target.value }))
                }
              />
            </Field>
            <SaveFooter pending={pending} error={error} />
          </form>
        </DialogContent>
      </Dialog>
    </MasterShell>
  );
}

export function ContactPersonMaster({ items }: { items: MasterContactPerson[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<MasterContactPerson>>({
    nama: "",
    jenis: "SCC",
    jabatan: "",
    no_hp: "",
    foto_url: "",
    active: true,
  });
  const { pending, error, run } = useMasterSave();
  const filtered = items.filter((item) =>
    `${item.nama} ${item.jenis}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <MasterShell
      query={query}
      setQuery={setQuery}
      onAdd={() => {
        setEditing({
          nama: "",
          jenis: "SCC",
          jabatan: "",
          no_hp: "",
          foto_url: "",
          active: true,
        });
        setOpen(true);
      }}
      empty={filtered.length === 0}
    >
      {filtered.map((item) => (
        <MasterItem
          key={item.id}
          title={item.nama}
          subtitle={`${CONTACT_JENIS_LABEL[item.jenis]}${item.no_hp ? ` · ${item.no_hp}` : ""}`}
          active={item.active}
          onEdit={() => {
            setEditing(item);
            setOpen(true);
          }}
          onToggle={(active) =>
            run(() => setMasterActive("master_contact_person", item.id, active), () => undefined)
          }
        />
      ))}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editing.id ? "Ubah contact person" : "Tambah contact person"}</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              run(
                () =>
                  upsertContactPerson({
                    id: editing.id,
                    nama: editing.nama ?? "",
                    jenis: editing.jenis ?? "SCC",
                    jabatan: editing.jabatan ?? "",
                    no_hp: editing.no_hp ?? "",
                    foto_url: editing.foto_url ?? "",
                    active: editing.active ?? true,
                  }),
                () => setOpen(false),
              );
            }}
          >
            <Field label="Nama" htmlFor="nama">
              <Input
                id="nama"
                className={controlClassName}
                value={editing.nama ?? ""}
                onChange={(event) => setEditing((current) => ({ ...current, nama: event.target.value }))}
              />
            </Field>
            <Field label="Jenis" htmlFor="jenis">
              <NativeSelect
                id="jenis"
                value={editing.jenis ?? "SCC"}
                onChange={(event) =>
                  setEditing((current) => ({
                    ...current,
                    jenis: event.target.value as ContactPersonJenis,
                  }))
                }
              >
                {Object.entries(CONTACT_JENIS_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Jabatan" htmlFor="jabatan">
              <Input
                id="jabatan"
                className={controlClassName}
                value={editing.jabatan ?? ""}
                onChange={(event) =>
                  setEditing((current) => ({ ...current, jabatan: event.target.value }))
                }
              />
            </Field>
            <Field label="No HP" htmlFor="no_hp">
              <Input
                id="no_hp"
                className={controlClassName}
                value={editing.no_hp ?? ""}
                onChange={(event) => setEditing((current) => ({ ...current, no_hp: event.target.value }))}
              />
            </Field>
            <Field label="Foto URL" htmlFor="foto_url">
              <Input
                id="foto_url"
                className={controlClassName}
                value={editing.foto_url ?? ""}
                onChange={(event) =>
                  setEditing((current) => ({ ...current, foto_url: event.target.value }))
                }
              />
            </Field>
            <SaveFooter pending={pending} error={error} />
          </form>
        </DialogContent>
      </Dialog>
    </MasterShell>
  );
}

function MasterShell({
  query,
  setQuery,
  onAdd,
  empty,
  children,
}: {
  query: string;
  setQuery: (value: string) => void;
  onAdd: () => void;
  empty: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <SearchInput
        value={query}
        onChange={setQuery}
      />

      <Button
        type="button"
        className="h-11 w-full rounded-xl"
        onClick={onAdd}
      >
        Tambah
      </Button>

      {/* Empty state hanya untuk tampilan list */}
      {empty ? (
        <EmptyState
          title="Tidak ada data"
          description="Belum ada data. Tekan Tambah untuk membuat data baru."
        />
      ) : null}

      {/* 
        children TETAP dirender.
        Ini penting karena Dialog Tambah berada
        di dalam children.
      */}
      <div
        className={
          empty
            ? "hidden"
            : "space-y-3"
        }
      >
        {children}
      </div>

      {/* 
        Saat empty, children tetap harus mounted
        supaya Dialog tetap bisa dibuka.
        Dialog Radix akan portal ke body.
      */}
      {empty ? (
        <div className="hidden">
          {children}
        </div>
      ) : null}
    </div>
  );
}

function MasterItem({
  title,
  subtitle,
  active,
  onEdit,
  onToggle,
}: {
  title: string;
  subtitle?: string | null;
  active: boolean;
  onEdit: () => void;
  onToggle: (active: boolean) => void;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(11,44,95,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <button type="button" className="min-w-0 text-left" onClick={onEdit}>
          <p className="font-medium text-[#0B2C5F]">{title}</p>
          {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
        </button>
        <ActiveRow active={active} onToggle={onToggle} />
      </div>
    </div>
  );
}

function SaveFooter({ pending, error }: { pending: boolean; error: string | null }) {
  return (
    <div className="space-y-3 pt-1">
      {error ? <ErrorState message={error} /> : null}
      <Button type="submit" disabled={pending} className="h-11 w-full rounded-xl">
        {pending ? "Menyimpan..." : "Simpan"}
      </Button>
    </div>
  );
}


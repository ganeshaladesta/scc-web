"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, NativeSelect, controlClassName } from "@/components/forms/field";
import { ErrorState, SuccessSummary } from "@/components/feedback/states";
import { saveDailyAssignments } from "@/lib/actions/masters";
import { todayISODate } from "@/lib/format";
import type { DailyContactAssignment, MasterContactPerson } from "@/types/database";

export function DailyAssignmentForm({
  contacts,
  initial,
}: {
  contacts: MasterContactPerson[];
  initial: DailyContactAssignment[];
}) {
  const [tanggal, setTanggal] = useState(todayISODate());
  const [oc, setOc] = useState(
    initial.find((row) => row.jenis === "OPERATIONAL_COMMANDER")?.contact_person_id ?? "",
  );
  const [scc, setScc] = useState(initial.find((row) => row.jenis === "SCC")?.contact_person_id ?? "");
  const [ess, setEss] = useState(initial.find((row) => row.jenis === "ESS")?.contact_person_id ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  const byJenis = (jenis: MasterContactPerson["jenis"]) =>
    contacts.filter((item) => item.jenis === jenis && item.active);

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        setSaved(false);
        startTransition(async () => {
          const result = await saveDailyAssignments({
            tanggal,
            operational_commander_id: oc,
            scc_id: scc,
            ess_id: ess,
          });
          if (!result.ok) {
            setError(result.error);
            return;
          }
          setSaved(true);
        });
      }}
    >
      <Field label="Tanggal" htmlFor="tanggal">
        <Input
          id="tanggal"
          type="date"
          className={controlClassName}
          value={tanggal}
          onChange={(event) => setTanggal(event.target.value)}
        />
      </Field>
      <Field label="Operational Commander" htmlFor="oc">
        <NativeSelect id="oc" value={oc} onChange={(event) => setOc(event.target.value)}>
          <option value="">Pilih</option>
          {byJenis("OPERATIONAL_COMMANDER").map((item) => (
            <option key={item.id} value={item.id}>
              {item.nama}
            </option>
          ))}
        </NativeSelect>
      </Field>
      <Field label="SCC" htmlFor="scc">
        <NativeSelect id="scc" value={scc} onChange={(event) => setScc(event.target.value)}>
          <option value="">Pilih</option>
          {byJenis("SCC").map((item) => (
            <option key={item.id} value={item.id}>
              {item.nama}
            </option>
          ))}
        </NativeSelect>
      </Field>
      <Field label="ESS / Penyelamatan" htmlFor="ess">
        <NativeSelect id="ess" value={ess} onChange={(event) => setEss(event.target.value)}>
          <option value="">Pilih</option>
          {byJenis("ESS").map((item) => (
            <option key={item.id} value={item.id}>
              {item.nama}
            </option>
          ))}
        </NativeSelect>
      </Field>
      {error ? <ErrorState message={error} /> : null}
      {saved ? (
        <SuccessSummary
          title="Penugasan harian disimpan"
          rows={[
            { label: "Tanggal", value: tanggal },
            {
              label: "Operational Commander",
              value: contacts.find((item) => item.id === oc)?.nama ?? "-",
            },
            { label: "SCC", value: contacts.find((item) => item.id === scc)?.nama ?? "-" },
            { label: "ESS", value: contacts.find((item) => item.id === ess)?.nama ?? "-" },
          ]}
        />
      ) : null}
      <Button type="submit" disabled={pending} className="h-12 w-full rounded-xl">
        {pending ? "Menyimpan..." : "Simpan penugasan"}
      </Button>
    </form>
  );
}


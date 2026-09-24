import { PageHeader } from "@/components/layout/page-header";
import {
  ContactPersonMaster,
  GedungMaster,
  KorsecMaster,
  PambiMaster,
  ShiftMaster,
  WilayahMaster,
} from "@/components/admin/master-managers";
import { getAdminMasters } from "@/lib/queries/masters";

export default async function AdminMasterPage() {
  const masters = await getAdminMasters();

  return (
    <div className="space-y-5">
      <PageHeader title="Master Data" description="Kelola data referensi yang dipakai oleh seluruh form." backHref="/admin" />
      <section className="space-y-3"><h2 className="text-base font-bold text-[#0B2C5F]">Wilayah</h2><WilayahMaster items={masters.wilayah} /></section>
      <section className="space-y-3"><h2 className="text-base font-bold text-[#0B2C5F]">Gedung</h2><GedungMaster items={masters.gedung} wilayah={masters.wilayah} /></section>
      <section className="space-y-3"><h2 className="text-base font-bold text-[#0B2C5F]">Shift</h2><ShiftMaster items={masters.shift} /></section>
      <section className="space-y-3"><h2 className="text-base font-bold text-[#0B2C5F]">Korsec</h2><KorsecMaster items={masters.korsec} /></section>
      <section className="space-y-3"><h2 className="text-base font-bold text-[#0B2C5F]">PAMBI Organik</h2><PambiMaster items={masters.pambi} /></section>
      <section className="space-y-3"><h2 className="text-base font-bold text-[#0B2C5F]">Contact Person</h2><ContactPersonMaster items={masters.contact} /></section>
    </div>
  );
}

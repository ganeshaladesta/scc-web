import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  ClipboardList,
  Database,
  Megaphone,
  Settings2,
  Users,
} from "lucide-react";

import { requireUser } from "@/lib/auth/session";

function formatDate() {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

function formatTime() {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  }).format(new Date());
}

function MenuCard({
  href,
  icon: Icon,
  title,
  description,
  accent = "blue",
}: {
  href: string;
  icon: typeof Users;
  title: string;
  description: string;
  accent?: "blue" | "gold" | "purple";
}) {
  const accentStyle = {
    blue: {
      icon: "bg-[#E8F1FF] text-[#0B2C5F]",
      border: "border-[#D5E3F8]",
    },
    gold: {
      icon: "bg-[#FFF6DC] text-[#A36A00]",
      border: "border-[#F0DEAA]",
    },
    purple: {
      icon: "bg-[#F0EBFF] text-[#6246A8]",
      border: "border-[#DDD3F7]",
    },
  }[accent];

  return (
    <Link
      href={href}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4F9C]"
    >
      <div
        className={`relative overflow-hidden rounded-2xl border bg-white p-5 shadow-[0_6px_20px_rgba(11,44,95,0.06)] transition active:scale-[0.99] ${accentStyle.border}`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${accentStyle.icon}`}
          >
            <Icon className="size-6" strokeWidth={1.8} />
          </div>

          <div className="min-w-0 flex-1 pr-8">
            <h3 className="text-[16px] font-bold tracking-tight text-[#0B2C5F]">
              {title}
            </h3>

            <p className="mt-1.5 text-[13px] leading-5 text-[#64748B]">
              {description}
            </p>
          </div>

          <div className="absolute right-5 top-5 flex size-8 items-center justify-center rounded-full bg-[#F4F7FB] text-[#0B2C5F]">
            <ArrowRight className="size-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function SectionTitle({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon: typeof Users;
}) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <Icon className="size-4 text-[#1B4F9C]" />

      <h2 className="text-[11px] font-bold tracking-[0.16em] text-[#58708F]">
        {children}
      </h2>
    </div>
  );
}

function AnnouncementCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#D7E0EE] bg-white shadow-[0_6px_20px_rgba(11,44,95,0.05)]">
      <div className="flex items-center gap-3 border-b border-[#EEF2F7] px-4 py-3.5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-[#E8F1FF] text-[#0B2C5F]">
          <Megaphone className="size-4" />
        </div>

        <div>
          <p className="text-[13px] font-bold text-[#0B2C5F]">
            Pengumuman Terbaru
          </p>

          <p className="text-[11px] text-[#7A8AA3]">
            Informasi dari SCC
          </p>
        </div>

        <Bell className="ml-auto size-4 text-[#8BA0BD]" />
      </div>

      <div className="px-4 py-4">
        <div className="flex gap-3">
          <div className="mt-1.5 size-2 shrink-0 rounded-full bg-[#1B4F9C]" />

          <div>
            <p className="text-[13px] font-semibold text-[#0B2C5F]">
              Belum ada pengumuman
            </p>

            <p className="mt-1 text-[12px] leading-5 text-[#718096]">
              Pengumuman operasional akan muncul di sini.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function Home() {
  const user = await requireUser();

  const isAdmin = user.role === "SCC_ADMIN";

  const displayName =
    user.fullName?.trim() || (isAdmin ? "SCC Admin" : "Korsec");

  return (
    <div className="px-4 pb-6">
      {/* =====================================================
          HERO / HEADER
      ===================================================== */}

      <section className="relative -mx-4 overflow-hidden rounded-b-[30px] bg-linear-to-br from-[#0B2C5F] via-[#123A73] to-[#1B4F9C] px-5 pb-6 pt-5 text-white shadow-[0_12px_30px_rgba(11,44,95,0.15)]">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-20 -top-24 size-56 rounded-full border border-white/8" />

        <div className="pointer-events-none absolute -right-5 top-20 size-28 rounded-full border border-white/8" />

        {/* =================================================
            LOGO AREA
        ================================================= */}

        <div className="relative flex items-center">
          {/* LOGO BI */}

          <div className="flex h-11 w-[118px] items-center">
            <Image
              src="/logo-bi.png"
              alt="Bank Indonesia"
              width={118}
              height={45}
              priority
              className="h-auto w-full object-contain object-left"
            />
          </div>

          {/* LOGO PAMBI + DLAF + NOTIFICATION */}

          <div className="ml-auto flex items-center gap-2">
            {/* PAMBI */}

            <div className="flex size-10 items-center justify-center rounded-xl bg-white p-1.5">
              <Image
                src="/logo-pambi.png"
                alt="PAMBI"
                width={36}
                height={36}
                priority
                className="h-full w-full object-contain"
              />
            </div>

            {/* DLAF */}

            <div className="flex size-10 items-center justify-center rounded-xl bg-white p-1.5">
              <Image
                src="/logo-dlaf.png"
                alt="DLAF"
                width={36}
                height={36}
                priority
                className="h-full w-full object-contain"
              />
            </div>

            {/* NOTIFICATION */}

            <div className="ml-1 flex size-9 items-center justify-center rounded-full bg-white/10">
              <Bell className="size-4" />
            </div>
          </div>
        </div>

        {/* Divider */}

        <div className="relative mt-4 h-px bg-white/10" />

        {/* =================================================
            GREETING
        ================================================= */}

        <div className="relative mt-5">
          <p className="text-sm text-white/60">
            Security Command Center
          </p>

          <h1 className="mt-1 text-[25px] font-bold tracking-tight">
            Halo, {displayName}
          </h1>

          <p className="mt-1 max-w-[300px] text-[12px] leading-5 text-white/70">
            {isAdmin
              ? "Kelola data dan konfigurasi operasional SCC."
              : "Pilih data yang ingin kamu laporkan hari ini."}
          </p>
        </div>

        {/* =================================================
            DATE / TIME
        ================================================= */}

        <div className="relative mt-5 flex items-center rounded-2xl border border-white/10 bg-black/10 px-4 py-3.5 backdrop-blur-sm">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <CalendarDays className="size-5 shrink-0 text-white/75" />

            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wide text-white/45">
                Hari ini
              </p>

              <p className="truncate text-[12px] font-semibold text-white">
                {formatDate()}
              </p>
            </div>
          </div>

          <div className="mx-3 h-9 w-px bg-white/10" />

          <div className="text-right">
            <p className="text-[19px] font-bold leading-none">
              {formatTime()}
            </p>

            <p className="mt-1 text-[10px] text-white/50">
              WIB
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="mt-6 space-y-6">
        {isAdmin ? (
          <>
            {/* =================================================
                ADMINISTRATION
            ================================================= */}

            <section>
              <SectionTitle icon={Settings2}>
                ADMINISTRASI
              </SectionTitle>

              <div className="space-y-3">
                <MenuCard
                  href="/admin/master"
                  icon={Database}
                  title="Master Data"
                  description="Kelola Wilayah, Gedung, Shift, Korsec, PAMBI Organik, dan Contact Person."
                  accent="blue"
                />

                <MenuCard
                  href="/admin/penugasan"
                  icon={Users}
                  title="Penugasan Harian"
                  description="Atur Operational Commander, SCC, dan ESS untuk setiap tanggal."
                  accent="gold"
                />
              </div>
            </section>

            {/* =================================================
                REPORT
            ================================================= */}

            <section>
              <SectionTitle icon={ClipboardList}>
                LAPORAN
              </SectionTitle>

              <MenuCard
                href="/riwayat"
                icon={ClipboardList}
                title="Data Laporan"
                description="Lihat riwayat laporan personil dan kegiatan yang masuk."
                accent="purple"
              />
            </section>
          </>
        ) : (
          <>
            {/* =================================================
                USER / KORSEC
            ================================================= */}

            <section>
              <SectionTitle icon={ClipboardList}>
                LAPORAN HARIAN
              </SectionTitle>

              <div className="space-y-3">
                <MenuCard
                  href="/personil"
                  icon={Users}
                  title="Personil Harian"
                  description="Isi jumlah personil berdasarkan wilayah, gedung, shift, dan Korsec."
                  accent="blue"
                />

                <MenuCard
                  href="/kegiatan"
                  icon={ClipboardList}
                  title="Kegiatan"
                  description="Laporkan giat masyarakat atau unjuk rasa yang sedang berlangsung."
                  accent="gold"
                />
              </div>
            </section>
          </>
        )}

        {/* =====================================================
            ANNOUNCEMENT
        ===================================================== */}

        <section>
          <SectionTitle icon={Megaphone}>
            INFORMASI
          </SectionTitle>

          <AnnouncementCard />
        </section>
      </div>
    </div>
  );
}
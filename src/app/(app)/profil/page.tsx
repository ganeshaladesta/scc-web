import { Mail, ShieldCheck, UserRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { LogoutButton } from "@/components/auth/logout-button";
import { requireUser } from "@/lib/auth/session";

export default async function ProfilPage() {
  const user = await requireUser();
  const roleLabel = user.role === "SCC_ADMIN" ? "SCC Admin" : "Korsec";

  return (
    <div className="space-y-4">
      <PageHeader title="Profil" description="Informasi akun yang sedang digunakan." backHref="/" />
      <Card className="rounded-3xl border-0 p-5">
        <div className="flex items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#0B2C5F] text-white">
            <UserRound className="size-7" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-[#0B2C5F]">{user.fullName}</p>
            <Badge variant="secondary" className="mt-1">{roleLabel}</Badge>
          </div>
        </div>
        <div className="mt-5 space-y-3 border-t pt-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="size-4 text-[#0B2C5F]/55" aria-hidden />
            <span className="text-muted-foreground">Email</span>
            <span className="ml-auto max-w-[62%] truncate font-medium text-[#0B2C5F]">{user.email ?? "-"}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <ShieldCheck className="size-4 text-[#0B2C5F]/55" aria-hidden />
            <span className="text-muted-foreground">Akses</span>
            <span className="ml-auto font-medium text-[#0B2C5F]">{roleLabel}</span>
          </div>
        </div>
      </Card>
      <LogoutButton />
    </div>
  );
}

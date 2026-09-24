import { LoginForm } from "@/components/auth/login-form";
import { BrandMark } from "@/components/layout/brand-mark";

export default function LoginPage() {
  return (
    <div className="min-h-dvh bg-linear-to-br from-[#0B2C5F] via-[#123A73] to-[#1B4F9C] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100dvh-5rem)] w-full max-w-md flex-col justify-center">
        <BrandMark />
        <div className="mt-8 rounded-3xl bg-white p-5 shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
          <h1 className="text-lg font-semibold text-[#0B2C5F]">Masuk</h1>
          <p className="mt-1 mb-5 text-sm text-muted-foreground">
            Gunakan akun Korsec atau SCC Admin untuk mengirim laporan.
          </p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}


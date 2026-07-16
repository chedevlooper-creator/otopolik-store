"use client";

import { Suspense, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LockIcon, LoaderIcon } from "lucide-react";
import { loginAction } from "./actions";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const nextPath = searchParams.get("next") || "/admin";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await loginAction(password, nextPath);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.replace(result.redirectTo || "/admin");
      router.refresh();
    });
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center py-12">
      <div className="border border-border bg-surface p-8 shadow-[6px_6px_0_var(--brand-red)]">
        <div className="mb-6 flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center bg-brand-black text-sand"
          >
            <LockIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="spec-label text-muted">Yönetim Paneli</p>
            <h1 className="font-heading text-2xl font-bold uppercase tracking-tight text-foreground">
              Giriş Yap
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="admin-password"
              className="spec-label mb-1.5 block text-muted"
            >
              Şifre
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-sand focus:outline-none focus:ring-2 focus:ring-sand/20"
              placeholder="••••••••"
            />
          </div>

          {error ? (
            <p
              role="alert"
              className="border border-brand-red bg-brand-red/10 px-3 py-2 text-xs font-semibold text-brand-red"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isPending || password.length === 0}
            className="flex w-full items-center justify-center gap-2 bg-brand-black px-4 py-3 text-sm font-bold uppercase tracking-wider text-sand transition-colors hover:bg-brand-red hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (
              <>
                <LoaderIcon className="h-4 w-4 animate-spin" aria-hidden="true" />
                Kontrol ediliyor
              </>
            ) : (
              "Giriş Yap"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function LoginFallback() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center py-12">
      <div className="border border-border bg-surface p-8" role="status">
        <div className="flex items-center gap-3 text-sm font-semibold text-muted">
          <LoaderIcon className="h-5 w-5 animate-spin text-sand" aria-hidden="true" />
          Giriş ekranı hazırlanıyor
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <AdminLoginForm />
    </Suspense>
  );
}

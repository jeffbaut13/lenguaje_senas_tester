"use client";

import dynamic from "next/dynamic";

const AppShell = dynamic(() => import("@/components/AppShell"), {
  ssr: false,
  loading: () => (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="panel max-w-xl rounded-3xl p-8 text-center">
        <p className="panel-label mb-3">Booting Client Runtime</p>
        <h1 className="text-2xl font-semibold">Preparando tracking en tiempo real</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Cargando Three.js, Human y el pipeline de retargeting del avatar.
        </p>
      </div>
    </main>
  ),
});

export default function ClientOnlyAppShell() {
  return <AppShell />;
}

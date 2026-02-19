import { Link } from 'react-router-dom';

export default function StatusPage() {
  const now = new Date().toISOString();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <section className="w-full max-w-xl space-y-4 rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
        <h1 className="text-2xl font-semibold">Status do Preview</h1>
        <p className="text-sm text-muted-foreground">
          Esta rota é pública e serve para validar rapidamente se o bundle client foi construído e está renderizando.
        </p>
        <div className="rounded-md border bg-muted/40 p-4 text-sm">
          <p>
            <strong>status:</strong> ok
          </p>
          <p>
            <strong>timestamp:</strong> {now}
          </p>
          <p>
            <strong>mode:</strong> {import.meta.env.MODE}
          </p>
        </div>
        <div className="flex gap-3">
          <Link className="text-sm font-medium underline" to="/">
            Ir para login
          </Link>
          <a className="text-sm font-medium underline" href="/api/health">
            Ver /api/health
          </a>
        </div>
      </section>
    </main>
  );
}

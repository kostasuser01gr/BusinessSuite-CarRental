export default function App() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold">AdaptiveAI Business Suite</h1>
          <p className="mt-2 text-zinc-400">
            Full-scale adaptive business operating system
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">KPI Block</div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">Operations Block</div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">Assistant Rail</div>
        </section>
      </div>
    </main>
  )
}

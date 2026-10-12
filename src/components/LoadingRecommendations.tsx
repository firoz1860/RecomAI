export function LoadingRecommendations() {
  return (
    <section className="rounded-3xl border border-brand-100 bg-white/80 p-5 shadow-card sm:p-7" aria-busy="true" aria-live="polite">
      <div className="mb-5 flex items-center gap-3">
        <span className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-brand-100" />
        <div className="space-y-2">
          <span className="block h-4 w-40 animate-pulse rounded-full bg-slate-200" />
          <span className="block h-3 w-56 animate-pulse rounded-full bg-slate-100" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
            <div className="aspect-[16/10] w-full animate-pulse bg-slate-100" />
            <div className="space-y-3 p-4">
              <span className="block h-3 w-24 animate-pulse rounded-full bg-slate-100" />
              <span className="block h-4 w-3/4 animate-pulse rounded-full bg-slate-200" />
              <span className="block h-12 w-full animate-pulse rounded-xl bg-slate-100" />
              <span className="block h-4 w-20 animate-pulse rounded-full bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-center text-sm text-slate-400">Matching products to your request</p>
    </section>
  )
}

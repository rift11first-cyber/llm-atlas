export default function ExploreLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl animate-pulse px-5 py-12 sm:px-8 sm:py-16">
      <div className="h-3 w-48 bg-muted" />
      <div className="mt-6 h-14 w-full max-w-2xl bg-muted" />
      <div className="mt-4 h-4 w-full max-w-xl bg-muted" />
      <div className="mt-10 h-12 w-full rounded-2xl border border-border" />
      <div className="mt-8 flex gap-2">
        <div className="h-6 w-16 rounded-full bg-muted" />
        <div className="h-6 w-24 rounded-full bg-muted" />
        <div className="h-6 w-24 rounded-full bg-muted" />
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-72 rounded-2xl border border-border" />
        ))}
      </div>
    </main>
  );
}

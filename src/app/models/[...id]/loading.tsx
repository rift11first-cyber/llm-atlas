export default function ModelLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl animate-pulse px-5 pb-24 pt-8 sm:px-8">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="h-3 w-24 bg-muted" />
        <div className="h-3 w-32 bg-muted" />
      </div>
      <div className="mt-10">
        <div className="h-5 w-20 bg-muted" />
        <div className="mt-6 h-16 w-full max-w-3xl bg-muted" />
        <div className="mt-5 h-4 w-72 bg-muted" />
      </div>
      <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-24 bg-background" />
        ))}
      </div>
      <div className="mt-14 grid gap-12 lg:grid-cols-[180px_minmax(0,1fr)]">
        <div className="hidden h-56 border-t border-border lg:block" />
        <div className="space-y-10">
          <div className="h-40 border-t border-border" />
          <div className="h-40 border-t border-border" />
          <div className="h-40 border-t border-border" />
        </div>
      </div>
    </main>
  );
}

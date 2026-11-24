import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-block select-none text-[15px] font-semibold tracking-[-0.03em] text-foreground",
        className
      )}
    >
      Strata
      <span aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="absolute inset-x-0 top-[31%] h-px bg-background" />
        <span className="absolute inset-x-0 top-1/2 h-px bg-background" />
        <span className="absolute inset-x-0 top-[69%] h-px bg-background" />
      </span>
    </span>
  );
}

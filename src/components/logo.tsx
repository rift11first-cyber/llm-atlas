import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={cn("block", className)}
    >
      <rect width="64" height="64" rx="14" fill="#ffffff" />
      <text
        x="32"
        y="46"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="44"
        fontWeight="700"
        fill="#000000"
      >
        S
      </text>
      <g stroke="#ffffff" strokeWidth="1.8">
        <path d="M12 24h40" />
        <path d="M12 32h40" />
        <path d="M12 40h40" />
      </g>
    </svg>
  );
}

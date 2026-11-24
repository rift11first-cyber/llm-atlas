"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
];

export function SiteNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex items-center gap-1", className)}>
      {links.map((link) => {
        const active =
          link.href === "/"
            ? pathname === "/"
            : link.href === "/explore"
              ? pathname.startsWith("/explore") ||
                pathname.startsWith("/models")
              : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors",
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

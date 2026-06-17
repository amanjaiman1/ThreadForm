import Link from "next/link";
import { cn } from "@/lib/utils";

/** ThreadForm wordmark + glyph (a stylized stitched "T" thread loop). */
export function Logo({
  className,
  withWordmark = true,
}: {
  className?: string;
  withWordmark?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="ThreadForm home"
      className={cn("inline-flex items-center gap-2.5", className)}
    >
      <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-brand text-white shadow-brand">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <path
            d="M4 6.5C4 5.67 4.67 5 5.5 5h13c.83 0 1.5.67 1.5 1.5S19.33 8 18.5 8H14v9.5c0 .83-.67 1.5-1.5 1.5S11 18.33 11 17.5V8H5.5C4.67 8 4 7.33 4 6.5Z"
            fill="currentColor"
          />
          <circle cx="18.5" cy="17" r="2.2" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </span>
      {withWordmark && (
        <span className="font-display text-lg font-bold tracking-tight text-ink-900">
          Thread<span className="text-brand-500">Form</span>
        </span>
      )}
    </Link>
  );
}

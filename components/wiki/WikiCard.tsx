import Link from "next/link";
import Panel from "@/components/ui/Panel";

interface RarityCardProps {
  id: string | number;
  name: string;
  tag: string;
  image?: string | null;
  /** Rarity cloth plate classes from `RARITY_META[...].plate`. */
  plate: string;
  /** Rarity pip count, so the tier reads without colour. */
  pips?: number;
  href?: string;
  onClick?: () => void;
  fallbackIcon?: React.ReactNode;
}

/**
 * The codex grid card: a wood plank with the entry's sprite sunk into it and a
 * rarity plate across the top.
 *
 * Notes on what this deliberately does *not* do, since all three were here
 * before the pixel system and read as modern web:
 * - no `hover:-translate-y-0.5` / `hover:shadow-xl` lift — `pixel-press` sinks
 *   the card into its own shadow on :active instead;
 * - no `group-hover:scale-105` on the sprite — a smooth zoom is the clearest
 *   modern-web tell, and it also resamples pixel art;
 * - no `rounded-*`, though the global `border-radius: 0` would have caught it.
 */
export function RarityCard({
  name,
  tag,
  image,
  plate,
  pips = 0,
  href,
  onClick,
  fallbackIcon,
}: RarityCardProps) {
  const content = (
    <Panel
      material="wood"
      className="pixel-press group flex h-full flex-col transition-colors hover:border-accent"
    >
      {/* Rarity plate. Pips carry the tier alongside the label so the cloth
          colour is never the only signal. */}
      <div className={`flex items-center justify-between border-b-2 border-black/60 px-2.5 py-1.5 ${plate}`}>
        <span className="truncate text-[10px] font-bold uppercase tracking-widest">{tag}</span>
        {pips > 0 && (
          <span className="flex shrink-0 gap-0.5" aria-hidden="true">
            {Array.from({ length: pips }, (_, i) => (
              <span key={i} className="h-1.5 w-1.5 bg-current opacity-80" />
            ))}
          </span>
        )}
      </div>

      {/* Sprite, sunk into the plank. */}
      <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-black/50 bg-stone">
        {image ? (
          // Sprites come from arbitrary API-supplied URLs, so this stays a plain
          // <img> rather than next/image (no remotePatterns entry to match).
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={name}
            className="pixelated h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : fallbackIcon ? (
          <div className="flex h-full w-full items-center justify-center">{fallbackIcon}</div>
        ) : null}

        <div
          className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent"
          aria-hidden="true"
        />
      </div>

      {/* Name */}
      <div className="flex flex-1 items-center justify-center p-3">
        <p className="line-clamp-2 text-center text-sm font-bold text-parchment transition-colors group-hover:text-accent">
          {name}
        </p>
      </div>
    </Panel>
  );

  if (href) {
    return (
      <Link href={href} className="block cursor-pointer">
        {content}
      </Link>
    );
  }
  // Keyboard parity for the onClick variant: a bare div with a click handler is
  // unreachable by tab and Enter, which the codex grid relied on.
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className="cursor-pointer text-left"
    >
      {content}
    </div>
  );
}

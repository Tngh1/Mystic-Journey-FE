import Link from "next/link";
import Panel from "@/components/ui/Panel";

interface RarityCardProps {
  id: string | number;
  name: string;
  tag: string;
  image?: string | null;
  plate: string;
  pips?: number;
  href?: string;
  onClick?: () => void;
  fallbackIcon?: React.ReactNode;
}

// Renders the rarity card reusable UI component.
// Features: applies customizable style variants and responsive CSS classes; binds user interaction event listeners.
// Returns the styled JSX element.
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
  // Process content and returns the computed result.
  const content = (
    <Panel
      material="wood"
      className="pixel-press group flex h-full flex-col transition-colors hover:border-accent"
    >
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

      <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-black/50 bg-stone">
        {image ? (
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
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();  // Prevent default HTML form submission and page reload
          onClick?.();
        }
      }}
      className="cursor-pointer text-left"
    >
      {content}
    </div>
  );
}

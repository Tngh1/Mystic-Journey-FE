import Link from "next/link";

interface RarityCardProps {
  id: string | number;
  name: string;
  tag: string;
  image?: string | null;
  accent: string;
  href?: string;
  onClick?: () => void;
  fallbackIcon?: React.ReactNode;
}

export function RarityCard({ name, tag, image, accent, href, onClick, fallbackIcon }: RarityCardProps) {
  const content = (
    <div
      className="group relative bg-[#111111] border border-gray-800 rounded-2xl overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 cursor-pointer hover:border-[#ffc032]/40"
      onClick={onClick}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ background: accent }} />

      {/* Image container */}
      <div className="relative aspect-[4/3] bg-[#111] overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : fallbackIcon ? (
          <div className="w-full h-full flex items-center justify-center">
            {fallbackIcon}
          </div>
        ) : null}

        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />

        {/* Tag badge */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-black/60 text-gray-200 border border-gray-700">
          {tag}
        </div>
      </div>

      {/* Name */}
      <div className="p-3 border-t border-gray-800">
        <p className="text-sm font-semibold text-white text-center group-hover:text-[#ffc032] transition-colors line-clamp-1">
          {name}
        </p>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="block">{content}</Link>;
  }
  return content;
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Tag, Bell, ArrowRight, AlertCircle } from "lucide-react";
import { getAll, getCategories, type ContentResponse, type CategoryResponse } from "@/lib/api/contents";
import Panel from "@/components/ui/Panel";
import NoticeBoard from "@/components/ui/NoticeBoard";

// Renders the format date view component.
// Returns the JSX element hierarchy for the page view.
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}

// Renders the content card view component.
// Returns the JSX element hierarchy for the page view.
function ContentCard({ content }: { content: ContentResponse }) {
  return (
    <Panel
      as="article"
      material="parchment"
      className="min-w-0 transition-colors focus-within:border-accent hover:border-accent"
    >
      <Link
        href={`/content/${content.slug || content.contentId}`}
        className="group flex flex-col text-on-parchment md:flex-row"
      >
        <div className="relative h-40 w-full shrink-0 overflow-hidden border-b-2 border-wood-dark bg-stone md:h-auto md:w-[240px] md:border-b-0 md:border-r-2 lg:w-[280px]">
          {content.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={content.thumbnailUrl}
              alt=""
              loading="lazy"
              className="pixelated absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <span className="pixel-grid flex h-full w-full items-center justify-center">
              <Bell className="h-8 w-8 text-parchment-dim/40" aria-hidden="true" />
            </span>
          )}

          {content.categoryName && (
            <span className="absolute left-2.5 top-2.5 flex items-center gap-1.5 border-2 border-black/60 bg-wood-dark px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-parchment">
              <Tag className="h-3 w-3 text-accent" aria-hidden="true" />
              {content.categoryName}
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col p-4 md:p-5">
          <h2 className="mb-2 line-clamp-2 break-words text-lg font-bold group-hover:underline md:text-xl">
            {content.title}
          </h2>
          {content.summary && (
            <p className="mb-4 line-clamp-2 break-words text-sm leading-relaxed text-on-parchment/80">
              {content.summary}
            </p>
          )}

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t-2 border-on-parchment/20 pt-3">
            <span className="flex items-center gap-1.5 text-xs text-on-parchment/70">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              <time dateTime={content.createdAt}>{formatDate(content.createdAt)}</time>
            </span>
            <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest">
              Read more
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </Panel>
  );
}

// Renders the card skeleton view component.
// Key functionality: manages local UI state, pagination, and filter values; fetches asynchronous page data on initial load and parameter changes.
// Returns the JSX element hierarchy for the page view.
function CardSkeleton() {
  return (
    <Panel material="parchment" aria-hidden="true" className="flex flex-col md:flex-row">
      <span className="pixel-grid h-40 w-full shrink-0 border-b-2 border-wood-dark md:h-auto md:min-h-[164px] md:w-[240px] md:border-b-0 md:border-r-2 lg:w-[280px]" />
      <span className="flex flex-1 flex-col gap-3 p-4 md:p-5">
        <span className="h-5 w-3/4 bg-on-parchment/15" />
        <span className="h-4 w-full bg-on-parchment/10" />
        <span className="h-4 w-2/3 bg-on-parchment/10" />
      </span>
    </Panel>
  );
}

// Renders the content page view component.
// Key functionality: manages local UI state, pagination, and filter values; fetches asynchronous page data on initial load and parameter changes.
// Returns the JSX element hierarchy for the page view.
export default function ContentPage() {
  const [contents, setContents] = useState<ContentResponse[] | null>(null);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Load all and categories when the dependencies change, update contents, categories, and error, and ignore stale callbacks after unmount.
  useEffect(() => {
    let mounted = true;
    // Execute these independent asynchronous operations concurrently, then combine their results after all complete.
    Promise.all([getAll(1, 100, { isPublished: true }), getCategories()])
      .then(([contentsRes, categoriesRes]) => {
        if (!mounted) return;
        setContents(contentsRes.items ?? []);
        setCategories(Array.isArray(categoriesRes) ? categoriesRes.filter((c) => c.isActive) : []);
        setError(null);
      })
      .catch((e) => {
        if (mounted) setError(e instanceof Error ? e.message : "Failed to load notices.");
      });
    return () => {
      mounted = false;
    };
  }, []);

  const loading = !contents && !error;
  const filtered = selectedCategory
    ? (contents ?? []).filter((c) => c.categoryId === selectedCategory)
    : contents ?? [];

  const tabs: { id: number | null; name: string }[] = [
    { id: null, name: "All" },
    ...categories.map((c) => ({ id: c.categoryContentId, name: c.name })),
  ];

  return (
    <div className="flex min-h-dvh flex-col pt-[88px] md:pt-[112px]">
      <NoticeBoard
        eyebrow="Notice Board"
        icon={Bell}
        title="Contents"
        lede="News, events and patch notes, posted as they are proclaimed."
      >
        {loading && (
          <p role="status" className="sr-only">
            Loading notices…
          </p>
        )}

        {categories.length > 0 && (
          <div role="tablist" aria-label="Categories" className="mb-3 flex flex-wrap justify-center gap-2 md:mb-4">
            {tabs.map((t) => {
              const isActive = selectedCategory === t.id;
              return (
                <button
                  key={t.id ?? "all"}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedCategory(t.id)}
                  className={`pixel-press flex min-h-11 cursor-pointer items-center border-2 px-4 text-xs font-black uppercase tracking-widest shadow-md transition-colors ${
                    isActive
                      ? "border-accent bg-accent text-on-accent"
                      : "border-black/60 bg-wood-dark text-parchment-dim hover:border-accent hover:text-parchment"
                  }`}
                >
                  {t.name}
                </button>
              );
            })}
          </div>
        )}

        {error && (
          <Panel material="iron" role="alert" className="mb-3 flex items-start gap-3 px-4 py-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-parchment-dim">
              The board could not be read ({error}).{" "}
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="cursor-pointer font-bold text-accent underline decoration-accent/50 underline-offset-2 hover:decoration-accent"
              >
                Try again
              </button>
            </p>
          </Panel>
        )}

        <div className="grid min-w-0 grid-cols-1 gap-3 md:gap-4" aria-busy={loading || undefined}>
          {loading
            ? Array.from({ length: 3 }, (_, i) => <CardSkeleton key={i} />)
            : filtered.map((item) => <ContentCard key={item.contentId} content={item} />)}
        </div>

        {!loading && !error && filtered.length === 0 && (
          <Panel material="parchment" className="p-10 text-center text-on-parchment">
            <Bell className="mx-auto mb-3 h-10 w-10 text-on-parchment/40" aria-hidden="true" />
            <p className="mb-4 text-sm text-on-parchment/80">
              {selectedCategory ? "Nothing posted under this category yet." : "No notices posted yet."}
            </p>
            {selectedCategory ? (
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="pixel-press inline-flex min-h-11 cursor-pointer items-center border-2 border-wood-dark bg-wood px-5 text-xs font-black uppercase tracking-widest text-parchment hover:border-accent hover:text-accent"
              >
                Show all notices
              </button>
            ) : (
              <Link
                href="/wiki"
                className="pixel-press inline-flex min-h-11 items-center border-2 border-wood-dark bg-wood px-5 text-xs font-black uppercase tracking-widest text-parchment hover:border-accent hover:text-accent"
              >
                Visit the archive
              </Link>
            )}
          </Panel>
        )}
      </NoticeBoard>
    </div>
  );
}

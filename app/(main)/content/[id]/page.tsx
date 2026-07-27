"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Calendar,
  Tag,
  Clock,
  ChevronLeft,
  List,
  ChevronRight,
  AlertCircle,
  ImageOff,
} from "lucide-react";
import Panel from "@/components/ui/Panel";
import { BoardFrame } from "@/components/ui/NoticeBoard";
import { ContentDetailResponse, ContentResponse, getBySlug, getAll } from "@/lib/api/contents";

interface HeadingItem {
  id: string;
  text: string;
  level: 1 | 2 | 3;
}

/** Slugify heading text into a valid HTML id. Duplicates get a numeric suffix. */
function slugify(text: string, seen: Map<string, number>): string {
  const base =
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "") || "heading";

  const count = seen.get(base) ?? 0;
  seen.set(base, count + 1);
  return count === 0 ? base : `${base}-${count + 1}`;
}

/**
 * Inject unique `id` attributes into the H1/H2/H3 elements of each raw HTML
 * block and collect them for the table of contents. Parses in a detached
 * document, so nothing runs while we walk it.
 */
function processHtmlWithIds(htmlBlocks: string[]): {
  processedBlocks: string[];
  headings: HeadingItem[];
} {
  if (typeof window === "undefined") {
    return { processedBlocks: htmlBlocks, headings: [] };
  }

  const seen = new Map<string, number>();
  const headings: HeadingItem[] = [];
  const processedBlocks: string[] = [];

  for (const html of htmlBlocks) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    doc.body.querySelectorAll("h1, h2, h3").forEach((node) => {
      const level = parseInt(node.tagName[1]) as 1 | 2 | 3;
      const text = node.textContent?.trim() || "";
      if (!text) return;
      const id = slugify(text, seen);
      node.setAttribute("id", id);
      headings.push({ id, text, level });
    });
    processedBlocks.push(doc.body.innerHTML);
  }

  return { processedBlocks, headings };
}

/* The contents index — a brass plate of ruled lines. The open section is marked
   by the gold ink *and* a gilt bar on its inner edge, so it never rests on
   colour alone. */
function TableOfContents({ headings }: { headings: HeadingItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <Panel material="wood" as="nav" aria-label="On this page" className="sticky top-24 w-full">
      <p className="flex items-center gap-2 border-b-2 border-black/60 bg-wood-dark px-3 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-accent">
        <List className="h-3.5 w-3.5" aria-hidden="true" />
        Contents
      </p>
      <ul className="max-h-[60dvh] overflow-y-auto py-2">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`relative flex min-h-11 items-center break-words px-3 py-2 text-sm leading-snug transition-colors ${
                  heading.level === 2 ? "pl-6" : heading.level === 3 ? "pl-9 text-xs" : "font-bold"
                } ${isActive ? "bg-black/25 text-accent" : "text-parchment-dim hover:text-parchment"} break-words`}
              >
                {isActive && (
                  <span
                    className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-accent"
                    aria-hidden="true"
                  />
                )}
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

function formatDate(dateString: string, long = false) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: long ? "long" : "short",
    day: "numeric",
  });
}

/* The other notices still on the board. A failed fetch here costs the rail and
   nothing else, so it degrades to a quiet line rather than an alert. */
function RecentPosts({ currentContentId }: { currentContentId: number }) {
  const [posts, setPosts] = useState<ContentResponse[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let mounted = true;
    getAll(1, 10)
      .then((data) => {
        if (!mounted) return;
        setPosts(
          data.items.filter((p) => p.isPublished && p.contentId !== currentContentId).slice(0, 5)
        );
      })
      .catch(() => {
        if (mounted) setFailed(true);
      });
    return () => {
      mounted = false;
    };
  }, [currentContentId]);

  const loading = !posts && !failed;

  return (
    <div className="sticky top-24 w-full">
      <Panel material="wood" as="section" aria-labelledby="recent-heading">
        <h2
          id="recent-heading"
          className="border-b-2 border-black/60 bg-wood-dark px-3 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-parchment"
        >
          Recent Posts
        </h2>

        <div aria-busy={loading || undefined}>
          {loading ? (
            <ul className="space-y-2 p-3" aria-hidden="true">
              {Array.from({ length: 3 }, (_, i) => (
                <li key={i} className="space-y-1.5">
                  <span className="block h-4 w-full bg-parchment/10" />
                  <span className="block h-3 w-1/2 bg-parchment/8" />
                </li>
              ))}
            </ul>
          ) : failed || posts!.length === 0 ? (
            <p className="px-3 py-6 text-center text-xs text-parchment-dim">
              {failed ? "The board could not be read." : "No other posts yet."}
            </p>
          ) : (
            <ul>
              {posts!.map((post, idx) => (
                <li key={post.contentId} className={idx > 0 ? "border-t border-black/40" : ""}>
                  <Link
                    href={`/content/${post.slug || post.contentId}`}
                    className="group flex flex-col gap-1 px-3 py-3 hover:bg-black/25"
                  >
                    <span className="line-clamp-2 text-sm font-bold leading-snug text-parchment group-hover:text-accent">
                      {post.title}
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] text-parchment-dim">
                      <Calendar className="h-3 w-3" aria-hidden="true" />
                      <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
                      {post.categoryName && <span>· {post.categoryName}</span>}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Panel>

      <Link
        href="/content"
        className="pixel-press mt-3 flex min-h-11 w-full items-center justify-center gap-1.5 border-2 border-black/60 bg-wood text-xs font-bold uppercase tracking-widest text-parchment-dim hover:border-accent hover:text-accent"
      >
        View all posts
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </div>
  );
}

export default function ContentDetailPage() {
  const params = useParams();
  const [content, setContent] = useState<ContentDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  /* Keyed by position, not by blockContentId: the BE hands back 0 for every
     block on some records, so an id-keyed map collapsed them into one entry and
     rendered the first block's HTML everywhere. */
  const [processedTextBlocks, setProcessedTextBlocks] = useState<string[]>([]);

  const slug = params.id as string;

  /* All state lands in the promise callbacks, never in the effect body — a
     synchronous setState here would cascade a second render on every mount. */
  useEffect(() => {
    let mounted = true;
    getBySlug(slug)
      .then((data) => {
        if (!mounted) return;

        /* Same filter and comparator as the render below, so the processed HTML
           lines up with the rendered blocks by index. Non-text blocks keep an
           empty slot rather than being squeezed out. */
        const activeBlocks = data.blocks
          .filter((b) => b.isActive)
          .sort((a, b) => a.sortOrder - b.sortOrder);

        const { processedBlocks, headings: extracted } = processHtmlWithIds(
          activeBlocks.map((b) => (b.blockType === "text" ? b.contentData || "" : ""))
        );

        setHeadings(extracted);
        setProcessedTextBlocks(processedBlocks);
        setContent(data);
        setError(null);
      })
      .catch((err) => {
        if (mounted) setError(err instanceof Error ? err.message : "Content not found");
      });
    return () => {
      mounted = false;
    };
  }, [slug]);

  // Derived, not a third piece of state to keep in sync.
  const loading = !content && !error;

  if (loading) {
    return (
      <div className="min-h-dvh px-4 pt-[88px] pb-16 md:pt-[112px]">
        <p role="status" className="sr-only">
          Loading article…
        </p>
        <div className="mx-auto max-w-[760px] space-y-4 py-10" aria-hidden="true">
          <span className="block h-8 w-3/4 bg-parchment/10" />
          <span className="block h-4 w-1/2 bg-parchment/8" />
          <span className="block h-64 w-full bg-parchment/8" />
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4 pt-[88px] pb-16 md:pt-[112px]">
        <Panel material="wood" role="alert" className="w-full max-w-md p-8 text-center">
          <AlertCircle className="mx-auto mb-3 h-8 w-8 text-accent" aria-hidden="true" />
          <h1 className="mb-2 text-xl font-bold text-parchment">Notice not found</h1>
          <p className="mb-6 text-sm text-parchment-dim">{error || "This post is no longer posted."}</p>
          <Link
            href="/content"
            className="pixel-press flex min-h-11 w-full items-center justify-center border-2 border-accent bg-accent text-sm font-black uppercase tracking-widest text-on-accent shadow-md hover:bg-accent-hover"
          >
            Back to Contents
          </Link>
        </Panel>
      </div>
    );
  }

  const sortedBlocks = content.blocks.filter((b) => b.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const totalBlocks = sortedBlocks.length;
  const hasToc = headings.length > 0;

  return (
    /* Full-height column, `mt-auto` on the body and no bottom padding: a short
       notice sinks to the bottom of the page so the board stands in the
       footer's turf strip instead of floating over empty sky. */
    <div className="flex min-h-dvh flex-col pt-[88px] md:pt-[112px]">
      <div className="mx-auto mt-auto w-full max-w-[1200px] px-4 pt-8 md:px-6">
        <div
          className={`grid gap-6 lg:gap-8 ${
            hasToc
              ? "grid-cols-1 xl:grid-cols-[240px_1fr_260px]"
              : "grid-cols-1 xl:grid-cols-[1fr_260px]"
          }`}
        >
          {hasToc && (
            <aside className="hidden xl:block">
              <TableOfContents headings={headings} />
            </aside>
          )}

          <article className="min-w-0">
            {hasToc && (
              <div className="mb-6 xl:hidden">
                <TableOfContents headings={headings} />
              </div>
            )}

            {/* The same board as /content — BoardFrame is shared, so the list and
                a single notice read as one object rather than two designs. The
                title plate and every block are nailed to the same planks, so a
                block is a slip on the board rather than a board of its own. */}
            <BoardFrame>
              <div className="min-w-0 space-y-3 md:space-y-4">
                {/* Title plate, sized to its own text and centred like the one on
                    /content. It used to be a full-width sheet at md:text-4xl with
                    p-8, which made the header taller than most articles' bodies. */}
                <header className="parchment mx-auto max-w-[68ch] border-2 border-wood-dark px-5 py-4 text-center text-on-parchment shadow-[inset_0_0_0_2px_rgb(0_0_0_/_0.12)] md:px-8 md:py-5">
                  {content.categoryName ? (
                    <span className="mb-2 inline-flex items-center gap-1.5 border-2 border-black/60 bg-wood px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-parchment">
                      <Tag className="h-3 w-3 text-accent" aria-hidden="true" />
                      {content.categoryName}
                    </span>
                  ) : (
                    <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em]">
                      Article
                    </span>
                  )}

                  {/* break-words: title and summary are admin-supplied and may be a
                      single unbroken string, which used to run off the viewport. */}
                  <h1 className="break-words text-lg font-bold leading-tight sm:text-xl md:text-2xl">
                    {content.title}
                  </h1>

                  {content.summary && (
                    <p className="mt-1.5 break-words text-[11px] leading-snug text-on-parchment/85 sm:text-xs">
                      {content.summary}
                    </p>
                  )}

                  <div className="mt-2.5 flex flex-wrap items-center justify-center gap-3 border-t-2 border-on-parchment/25 pt-2 text-[11px] text-on-parchment/75">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" aria-hidden="true" />
                      <time dateTime={content.createdAt}>{formatDate(content.createdAt, true)}</time>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {totalBlocks} section{totalBlocks !== 1 ? "s" : ""}
                    </span>
                  </div>
                </header>

                {/* Banner, framed rather than rounded-and-glowing. */}
                {content.thumbnailUrl && (
                  <div className="border-2 border-wood-dark bg-stone">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={content.thumbnailUrl}
                      alt=""
                      className="pixelated h-56 w-full object-cover sm:h-72 md:h-80"
                    />
                  </div>
                )}

                {/* Blocks. Long-form prose sits on parchment — the one light surface
                    in the system, and the only place a wall of text is comfortable. */}
                {sortedBlocks.map((block, i) => {
                  if (block.blockType === "text") {
                    const html = processedTextBlocks[i] || block.contentData || "";
                    return (
                      <div
                        key={i}
                        /* Editor HTML from the admin portal; `.rendered-html` in
                           components/css/rendered-html.css carries the prose rules. */
                        className="parchment rendered-html border-2 border-wood-dark p-5 text-[15px] leading-[1.8] shadow-[inset_0_0_0_2px_rgb(0_0_0_/_0.12)] md:p-8"
                        dangerouslySetInnerHTML={{ __html: html }}
                      />
                    );
                  }

                  if (block.blockType === "image") {
                    return (
                      <figure key={i} className="border-2 border-wood-dark">
                        {block.mediaUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={block.mediaUrl}
                            alt={block.caption || ""}
                            loading="lazy"
                            className="pixelated max-h-[500px] w-full bg-stone object-contain"
                          />
                        ) : (
                          <p className="flex h-40 items-center justify-center gap-2 bg-stone text-sm text-parchment-dim">
                            <ImageOff className="h-4 w-4" aria-hidden="true" />
                            Image unavailable
                          </p>
                        )}
                        {block.caption && (
                          <figcaption className="border-t-2 border-wood-dark bg-wood-dark px-4 py-2.5 text-center text-xs italic leading-relaxed text-parchment-dim">
                            {block.caption}
                          </figcaption>
                        )}
                      </figure>
                    );
                  }

                  return null;
                })}

                {sortedBlocks.length === 0 && (
                  <p className="parchment border-2 border-wood-dark p-10 text-center text-sm text-on-parchment/80">
                    This notice has no body yet.
                  </p>
                )}

                {/* The way out is nailed to the board too. Outside it, the row
                    was a rule and two lines floating on the starfield below the
                    planks — one object, so it goes on the planks. */}
                <footer className="flex flex-wrap items-center justify-between gap-3 border-2 border-black/60 bg-wood-dark px-3 py-3">
                  <Link
                    href="/content"
                    className="pixel-press flex min-h-11 items-center gap-2 border-2 border-accent/50 px-5 text-xs font-black uppercase tracking-widest text-accent hover:border-accent hover:bg-accent hover:text-on-accent"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    Back to all posts
                  </Link>
                  <p className="flex items-center gap-1.5 text-xs text-parchment-dim">
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                    Published {formatDate(content.createdAt, true)}
                  </p>
                </footer>
              </div>
            </BoardFrame>
          </article>

          <aside className="hidden xl:block">
            <RecentPosts currentContentId={content.contentId} />
          </aside>
        </div>

        <div className="mt-10 xl:hidden">
          <RecentPosts currentContentId={content.contentId} />
        </div>
      </div>
    </div>
  );
}

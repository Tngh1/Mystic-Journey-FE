"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  Tag,
  ArrowLeft,
  Loader2,
  Share2,
  Clock,
  ChevronLeft,
  List,
  ChevronRight,
} from "lucide-react";
import PageLoader from "@/components/ui/PageLoader";
import { ContentDetailResponse, ContentResponse, getBySlug, getAll } from "@/lib/api/contents";

/* ─────────────────────────────────────────────────────────────────────────────
   Heading extraction utilities
───────────────────────────────────────────────────────────────────────────── */

interface HeadingItem {
  id: string;
  text: string;
  level: 1 | 2 | 3;
}

/**
 * Slugify heading text into a valid HTML id.
 * Duplicate slugs get a numeric suffix.
 */
function slugify(text: string, seen: Map<string, number>): string {
  const base = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    || "heading";

  const count = seen.get(base) ?? 0;
  seen.set(base, count + 1);
  return count === 0 ? base : `${base}-${count + 1}`;
}

/**
 * Parse raw HTML string and extract H1/H2/H3 headings.
 * Runs in a detached DOM so it's safe on the client.
 */
function extractHeadings(htmlBlocks: string[]): HeadingItem[] {
  if (typeof window === "undefined") return [];

  const seen = new Map<string, number>();
  const items: HeadingItem[] = [];

  for (const html of htmlBlocks) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const nodes = doc.body.querySelectorAll("h1, h2, h3");
    nodes.forEach((node) => {
      const level = parseInt(node.tagName[1]) as 1 | 2 | 3;
      const text = node.textContent?.trim() || "";
      if (!text) return;
      const id = slugify(text, seen);
      items.push({ id, text, level });
    });
  }

  return items;
}

/**
 * Inject unique `id` attributes into H1/H2/H3 elements in raw HTML.
 * Returns the modified HTML string and the heading list.
 */
function processHtmlWithIds(
  htmlBlocks: string[]
): { processedBlocks: string[]; headings: HeadingItem[] } {
  if (typeof window === "undefined") {
    return { processedBlocks: htmlBlocks, headings: [] };
  }

  const seen = new Map<string, number>();
  const headings: HeadingItem[] = [];
  const processedBlocks: string[] = [];

  for (const html of htmlBlocks) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const nodes = doc.body.querySelectorAll("h1, h2, h3");
    nodes.forEach((node) => {
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

/* ─────────────────────────────────────────────────────────────────────────────
   TableOfContents component
───────────────────────────────────────────────────────────────────────────── */

function TableOfContents({ headings }: { headings: HeadingItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
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

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 100;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  if (headings.length === 0) return null;

  let h1Counter = 0;

  return (
    <div className="sticky top-24 w-full">
      <div className="flex items-center gap-2 px-4 py-3 bg-[#ffc032]/10 border border-[#ffc032]/25 rounded-t-xl">
        <List className="w-4 h-4 text-[#ffc032] shrink-0" />
        <span className="text-[#ffc032] text-xs font-bold tracking-widest uppercase">
          Table of Contents
        </span>
      </div>

      <div className="bg-[#111111]/90 border border-t-0 border-white/8 rounded-b-xl overflow-hidden">
        <ul className="py-3 space-y-0.5">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            const isH1 = heading.level === 1;
            const isH2 = heading.level === 2;
            const isH3 = heading.level === 3;

            if (isH1) h1Counter++;

            return (
              <li key={heading.id}>
                <button
                  onClick={() => scrollTo(heading.id)}
                  className={`
                    w-full text-left flex items-start gap-2.5 px-4 py-2 transition-all duration-200 group cursor-pointer
                    ${isH2 ? "pl-8" : ""}
                    ${isH3 ? "pl-12" : ""}
                    ${isActive
                      ? "text-[#ffc032] bg-[#ffc032]/8"
                      : "text-white/55 hover:text-white/85 hover:bg-white/4"
                    }
                  `}
                >
                  {isH1 && (
                    <span
                      className={`shrink-0 text-xs font-semibold mt-0.5 min-w-[18px] ${
                        isActive ? "text-[#ffc032]" : "text-white/30"
                      }`}
                    >
                      {h1Counter}.
                    </span>
                  )}
                  {isH2 && (
                    <span
                      className={`shrink-0 w-1.5 h-1.5 rounded-full mt-1.5 ${
                        isActive ? "bg-[#ffc032]" : "bg-white/20"
                      }`}
                    />
                  )}
                  {isH3 && (
                    <span
                      className={`shrink-0 w-1 h-1 rounded-full mt-2 ${
                        isActive ? "bg-[#ffc032]/70" : "bg-white/15"
                      }`}
                    />
                  )}

                  <span
                    className={`text-sm leading-snug ${
                      isH1 ? "font-medium" : isH2 ? "font-normal" : "text-xs"
                    } ${isActive ? "text-[#ffc032]" : ""}`}
                  >
                    {heading.text}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   RecentPosts component
───────────────────────────────────────────────────────────────────────────── */

function RecentPosts({ currentContentId }: { currentContentId: number }) {
  const [posts, setPosts] = useState<ContentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const data = await getAll(1, 10);
        const filtered = data.items
          .filter((p) => p.isPublished && p.contentId !== currentContentId)
          .slice(0, 5);
        setPosts(filtered);
      } catch {
        // silently ignore
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, [currentContentId]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="sticky top-24 w-full">
      <div className="mb-4">
        <h3 className="text-white font-bold text-base tracking-wide uppercase">
          Recent Posts
        </h3>
        <div className="mt-1.5 w-10 h-0.5 bg-[#ffc032] rounded-full" />
      </div>

      <div className="bg-[#111111]/80 border border-white/8 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-5 h-5 text-[#ffc032]/50 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <p className="text-white/30 text-sm text-center py-8 px-4">
            No recent posts
          </p>
        ) : (
          <ul>
            {posts.map((post, idx) => (
              <li key={post.contentId}>
                {idx > 0 && <div className="mx-4 h-px bg-white/5" />}
                <Link
                  href={`/content/${post.slug || post.contentId}`}
                  className="flex flex-col gap-1.5 px-4 py-4 hover:bg-white/4 transition-colors group"
                >
                  <span className="text-sm text-white/80 font-medium leading-snug group-hover:text-[#ffc032] transition-colors line-clamp-2">
                    {post.title}
                  </span>
                  <div className="flex items-center gap-1.5 text-white/30 text-xs">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(post.createdAt)}</span>
                    {post.categoryName && (
                      <>
                        <span className="w-0.5 h-0.5 rounded-full bg-white/20" />
                        <span className="text-[#ffc032]/60">{post.categoryName}</span>
                      </>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link
        href="/content"
        className="mt-3 flex items-center justify-center gap-1.5 w-full py-2.5 text-xs text-white/40 hover:text-[#ffc032] border border-white/8 hover:border-[#ffc032]/30 rounded-xl transition-all duration-200"
      >
        View all posts
        <ChevronRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main page component
───────────────────────────────────────────────────────────────────────────── */

export default function ContentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [content, setContent] = useState<ContentDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [processedTextBlocks, setProcessedTextBlocks] = useState<{ id: number; html: string }[]>([]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const id = params.id as string;
      const data = await getBySlug(id);
      setContent(data);

      const activeTextBlocks = data.blocks
        .filter((b) => b.blockType === "text" && b.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder);

      const rawHtmlList = activeTextBlocks.map((b) => b.contentData || "");
      const { processedBlocks, headings: extracted } = processHtmlWithIds(rawHtmlList);

      setHeadings(extracted);
      setProcessedTextBlocks(
        activeTextBlocks.map((b, i) => ({
          id: b.blockContentId,
          html: processedBlocks[i],
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Content not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(fetchContent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="w-16 h-16 text-[#ffc032] animate-spin" />
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-white/50 text-lg">{error || "Content not found"}</p>
          <button
            onClick={() => router.push("/content")}
            className="mt-4 px-6 py-2 bg-[#ffc032] text-black rounded-xl font-medium hover:bg-[#e6ad2d] transition-colors cursor-pointer"
          >
            Back to Contents
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const imageBlocks = content.blocks
    .filter((b) => b.blockType === "image" && b.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const totalBlocks = processedTextBlocks.length + imageBlocks.length;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: content.title,
          text: content.summary || content.title,
          url: window.location.href,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const hasToc = headings.length > 0;

  return (
    <div className="min-h-screen pt-20 pb-16 ">
      {/* Page wrapper */}
      <div className="container mx-auto px-4 py-8">
        {/* 3-column grid */}
        <div
          className={`
            grid gap-8
            ${hasToc
              ? "grid-cols-1 xl:grid-cols-[260px_1fr_260px]"
              : "grid-cols-1 xl:grid-cols-[1fr_260px]"
            }
          `}
        >
          {/* LEFT: Table of Contents */}
          {hasToc && (
            <aside className="hidden xl:block">
              <TableOfContents headings={headings} />
            </aside>
          )}

          {/* CENTER: Article */}
          <article className="min-w-0">
            {/* Mobile TOC (above article) */}
            {hasToc && (
              <div className="xl:hidden mb-6">
                <TableOfContents headings={headings} />
              </div>
            )}

            {/* Hero Section */}
            <header className="pb-8">
              {content.categoryName && (
                <div className="flex mb-5">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#ffc032]/10 text-[#ffc032] border border-[#ffc032]/20 rounded-full text-sm font-semibold tracking-wide">
                    <Tag className="w-3.5 h-3.5" />
                    {content.categoryName}
                  </span>
                </div>
              )}

              <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-5">
                {content.title}
              </h1>

              {content.summary && (
                <p className="text-lg text-white/50 leading-relaxed mb-5">
                  {content.summary}
                </p>
              )}

              <div className="flex items-center gap-5 text-sm text-white/40">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(content.createdAt)}</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{totalBlocks} section{totalBlocks !== 1 ? "s" : ""}</span>
                </div>
              </div>
            </header>

            {/* Banner Image */}
            {content.thumbnailUrl && (
              <div className="relative w-full rounded-2xl overflow-hidden mb-10 shadow-2xl shadow-black/50">
                <img
                  src={content.thumbnailUrl}
                  alt={content.title}
                  className="w-full h-64 sm:h-80 md:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f]/60 to-transparent" />
              </div>
            )}

            {/* Content Blocks */}
            {(() => {
              const allSorted = content.blocks
                .filter((b) => b.isActive)
                .sort((a, b) => a.sortOrder - b.sortOrder);

              const processedMap = new Map(
                processedTextBlocks.map((p) => [p.id, p.html])
              );

              return (
                <div className="space-y-6 pb-12">
                  {allSorted.map((block) => {
                    if (block.blockType === "text") {
                      const html = processedMap.get(block.blockContentId) || block.contentData || "";
                      return (
                        <div key={block.blockContentId} className="relative group">
                          <div className="bg-[#111111]/80 border border-white/5 rounded-2xl p-6 sm:p-8">
                            <div
                              className="text-white/80 leading-[1.9] text-base rendered-html"
                              dangerouslySetInnerHTML={{ __html: html }}
                            />
                          </div>
                        </div>
                      );
                    }

                    if (block.blockType === "image") {
                      return (
                        <div key={block.blockContentId} className="relative group">
                          <div className="bg-[#111111]/80 border border-white/5 rounded-2xl overflow-hidden">
                            {block.mediaUrl ? (
                              <img
                                src={block.mediaUrl}
                                alt={block.caption || "Image"}
                                className="w-full object-contain max-h-[500px] bg-[#111]"
                              />
                            ) : (
                              <div className="w-full h-48 bg-[#111111] flex items-center justify-center">
                                <span className="text-white/30 text-sm">No image</span>
                              </div>
                            )}
                            {block.caption && (
                              <div className="px-6 py-4 border-t border-white/5">
                                <p className="text-white/40 text-sm italic text-center leading-relaxed">
                                  {block.caption}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>
              );
            })()}

            {/* Empty state */}
            {content.blocks.length === 0 && (
              <div className="text-center py-16 bg-[#111111]/50 border border-white/5 rounded-2xl">
                <p className="text-white/40">No content available</p>
              </div>
            )}

            {/* Article Footer */}
            <footer className="border-t border-white/5 pt-8 mt-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => router.push("/content")}
                  className="flex items-center gap-2 px-6 py-3 bg-[#ffc032]/10 hover:bg-[#ffc032]/20 border border-[#ffc032]/20 text-[#ffc032] rounded-xl font-medium transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to all posts
                </button>

                <div className="flex items-center gap-2 text-white/40 text-sm">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Published {formatDate(content.createdAt)}</span>
                </div>
              </div>
            </footer>
          </article>

          {/* RIGHT: Recent Posts */}
          <aside className="hidden xl:block">
            <RecentPosts currentContentId={content.contentId} />
          </aside>
        </div>

        {/* Mobile Recent Posts */}
        <div className="xl:hidden mt-10">
          <RecentPosts currentContentId={content.contentId} />
        </div>
      </div>
    </div>
  );
}

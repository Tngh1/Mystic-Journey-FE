"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Tag, Bell, ArrowRight } from "lucide-react";
import { getAll, getCategories, type ContentResponse, type CategoryResponse } from "@/lib/api/contents";
import PageLoader from "@/components/ui/PageLoader";

export default function ContentPage() {
  const [contents, setContents] = useState<ContentResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const [contentsRes, categoriesRes] = await Promise.all([
          getAll(1, 100, { isPublished: true }),
          getCategories(),
        ]);
        if (!mounted) return;
        setContents(contentsRes.items ?? []);
        setCategories(Array.isArray(categoriesRes) ? categoriesRes.filter((c) => c.isActive) : []);
      } catch (error) {
        console.error("Failed to fetch contents:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const filteredContents = selectedCategory
    ? contents.filter((c) => c.categoryId === selectedCategory)
    : contents;

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen pt-[88px] md:pt-[112px] flex flex-col">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-white/10 py-10 md:py-14">
        {/* Ambient gold glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[min(85%,680px)] -translate-x-1/2 rounded-full bg-[#ffc032]/10 blur-[130px]" />

        <div className="max-w-[1200px] mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="mb-5 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-linear-to-r from-transparent to-[#ffc032]/60" />
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.34em] text-[#ffc032]">
                <Bell className="w-3.5 h-3.5" />
                Latest Contents
              </span>
              <span className="h-px w-10 bg-linear-to-l from-transparent to-[#ffc032]/60" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
              Contents
            </h1>
            <p className="text-white/60 text-sm md:text-base">
              Stay updated with the latest news and events.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-grow max-w-[1200px] mx-auto w-full px-4 pb-8 md:pb-12">
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 cursor-pointer ${
              selectedCategory === null
                ? "bg-[#ffc032] text-[#111] shadow-lg shadow-[#ffc032]/20"
                : "bg-[#0d0d0d] text-white/70 hover:bg-white/5 hover:text-white border border-white/10"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.categoryContentId}
              onClick={() => setSelectedCategory(cat.categoryContentId)}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 cursor-pointer ${
                selectedCategory === cat.categoryContentId
                  ? "bg-[#ffc032] text-[#111] shadow-lg shadow-[#ffc032]/20"
                  : "bg-[#0d0d0d] text-white/70 hover:bg-white/5 hover:text-white border border-white/10"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Contents Grid */}
        <div className="grid grid-cols-1 gap-6 max-w-5xl mx-auto">
          {filteredContents.map((item) => (
            <ContentCard key={item.contentId} content={item} />
          ))}
        </div>

        {/* Empty State */}
        {filteredContents.length === 0 && (
          <div className="text-center py-20">
            <Bell className="w-20 h-20 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-lg">No contents found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ContentCard({ content }: { content: ContentResponse }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Link
      href={`/content/${content.slug || content.contentId}`}
      className="group relative flex flex-col md:flex-row bg-[#111111] border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#ffc032]/40 hover:shadow-xl hover:shadow-[#ffc032]/5"
    >
      {/* Image Section */}
      <div className="relative w-full md:w-[320px] lg:w-[380px] h-48 md:h-auto shrink-0 overflow-hidden">
        {content.thumbnailUrl ? (
          <img
            src={content.thumbnailUrl}
            alt={content.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-[#ffc032]/20 to-[#ff8c00]/20 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Bell className="w-8 h-8 text-[#ffc032]" />
            </div>
          </div>
        )}
        
        {/* Category Badge */}
        {content.categoryName && (
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-medium rounded-full flex items-center gap-1.5 border border-white/10">
              <Tag className="w-3.5 h-3.5" />
              {content.categoryName}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 flex flex-col flex-1 justify-center">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-[#ffc032] transition-colors line-clamp-2">
          {content.title}
        </h3>
        {content.summary && (
          <p className="text-white/60 text-sm md:text-base mb-6 line-clamp-2 leading-relaxed">
            {content.summary}
          </p>
        )}

        {/* Meta Info */}
        <div className="mt-auto pt-2 flex flex-wrap items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-5 text-white/50">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(content.createdAt)}</span>
            </div>
          </div>

          {/* Read More Link */}
          <div className="flex items-center gap-1.5 text-[#ffc032] font-medium group-hover:translate-x-1 transition-transform">
            Read more <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}

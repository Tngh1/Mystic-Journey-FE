"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Tag, Bell, Loader2, User, ArrowRight } from "lucide-react";
import { ContentResponse, getAll, getCategories } from "@/lib/api/contents";

interface CategoryInfo {
  categoryContentId: number;
  name: string;
}

export default function ContentPage() {
  const [contents, setContents] = useState<ContentResponse[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [contentsData, categoriesData] = await Promise.all([
        getAll(1, 100),
        getCategories()
      ]);
      setContents(contentsData.items.filter(c => c.isPublished));
      setCategories(categoriesData.filter(c => c.isActive));
    } catch (error) {
      console.error("Failed to fetch contents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(fetchData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredContents = selectedCategory
    ? contents.filter((c) => c.categoryId === selectedCategory)
    : contents;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="w-16 h-16 text-[#ffc032] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffc032]/20 rounded-full mb-6">
              <Bell className="w-5 h-5 text-[#ffc032]" />
              <span className="text-[#ffc032] font-medium">Latest Contents</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Contents
            </h1>
            <p className="text-white/70 text-lg">
              Stay updated with the latest news, events, and updates from the Mystic Journey team
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 cursor-pointer ${
              selectedCategory === null
                ? "bg-[#ffc032] text-black shadow-lg shadow-[#ffc032]/20"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
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
                  ? "bg-[#ffc032] text-black shadow-lg shadow-[#ffc032]/20"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
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
      className="group relative flex flex-col md:flex-row bg-[#1a1a1a]/80 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#ffc032]/30 hover:shadow-xl hover:shadow-[#ffc032]/5"
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
          <div className="w-full h-full bg-gradient-to-br from-[#ffc032]/20 to-[#ff8c00]/20 flex items-center justify-center">
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
            Xem thêm <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}

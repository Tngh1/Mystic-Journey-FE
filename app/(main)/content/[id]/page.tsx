"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, Tag, ArrowLeft, Loader2, Share2, Image as ImageIcon, Type } from "lucide-react";
import { ContentDetailResponse, getBySlug } from "@/lib/api/content";

export default function ContentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [content, setContent] = useState<ContentDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, [params.id]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const id = params.id as string;
      const data = await getBySlug(id);
      setContent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Content not found');
    } finally {
      setLoading(false);
    }
  };

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
          <p className="text-white/50 text-lg">{error || 'Content not found'}</p>
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const textBlocks = content.blocks.filter(b => b.blockType === 'text' && b.isActive);
  const imageBlocks = content.blocks.filter(b => b.blockType === 'image' && b.isActive);

  return (
    <div className="min-h-screen pt-20 pb-12">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <button
          onClick={() => router.push("/content")}
          className="flex items-center gap-2 text-white/70 hover:text-[#ffc032] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Contents
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Category Badge */}
            {content.categoryName && (
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="px-4 py-2 bg-[#ffc032]/20 text-[#ffc032] border border-[#ffc032]/30 rounded-full text-sm font-medium flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  {content.categoryName}
                </span>
              </div>
            )}
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {content.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(content.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white rounded-xl transition-all cursor-pointer">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>

          {/* Banner Image */}
          {content.thumbnailUrl && (
            <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
              <img
                src={content.thumbnailUrl}
                alt={content.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Summary */}
          {content.summary && (
            <div className="bg-gradient-to-br from-[#ffc032]/10 to-[#ff8c00]/10 border border-[#ffc032]/20 rounded-2xl p-6 mb-8">
              <p className="text-white/80 text-lg leading-relaxed">
                {content.summary}
              </p>
            </div>
          )}

          {/* Content Blocks */}
          <div className="space-y-8">
            {/* Text Blocks */}
            {textBlocks.map((block) => (
              <div key={block.blockContentId} className="bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-2xl p-6 md:p-8">
                {block.title && (
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <Type className="w-6 h-6 text-[#ffc032]" />
                    {block.title}
                  </h2>
                )}
                <div className="text-white/70 whitespace-pre-wrap leading-relaxed prose prose-invert prose-lg max-w-none">
                  {block.contentData}
                </div>
              </div>
            ))}

            {/* Image Blocks */}
            {imageBlocks.map((block) => (
              <div key={block.blockContentId} className="bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-2xl overflow-hidden">
                <div className="relative w-full">
                  {block.mediaUrl ? (
                    <img
                      src={block.mediaUrl}
                      alt={block.caption || 'Image'}
                      className="w-full max-h-96 object-contain bg-[#111]"
                    />
                  ) : (
                    <div className="w-full h-48 bg-[#1a1a1a] flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-600" />
                    </div>
                  )}
                </div>
                {block.caption && (
                  <div className="p-4 text-center">
                    <p className="text-white/60 text-sm italic">{block.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* No Content Message */}
          {content.blocks.length === 0 && (
            <div className="text-center py-12 bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-2xl">
              <p className="text-white/50">No content available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

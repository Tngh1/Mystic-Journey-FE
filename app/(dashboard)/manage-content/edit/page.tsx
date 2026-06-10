'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Save, Globe, GlobeLock } from 'lucide-react';
import { getById, update, publish, getCategories, ContentDetailResponse, CategoryResponse } from '@/lib/api/content';

interface FormData {
  title: string;
  summary: string;
  thumbnailUrl: string;
  categoryId: number;
  isPublished: boolean;
  isActive: boolean;
}

function EditContentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentId = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<ContentDetailResponse | null>(null);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    summary: '',
    thumbnailUrl: '',
    categoryId: 0,
    isPublished: false,
    isActive: true,
  });

  useEffect(() => {
    if (contentId) {
      fetchData();
    }
  }, [contentId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [contentData, categoriesData] = await Promise.all([
        getById(Number(contentId)),
        getCategories(),
      ]);
      setContent(contentData);
      setCategories(categoriesData.filter((c) => c.isActive));
      setFormData({
        title: contentData.title,
        summary: contentData.summary || '',
        thumbnailUrl: contentData.thumbnailUrl || '',
        categoryId: contentData.categoryId ?? 0,
        isPublished: contentData.isPublished,
        isActive: contentData.isActive,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch content');
    } finally {
      setLoading(false);
      setFetchingCategories(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    setError(null);

    try {
      setSubmitting(true);
      await update(content.contentId, {
        title: formData.title,
        summary: formData.summary,
        thumbnailUrl: formData.thumbnailUrl || undefined,
        categoryId: formData.categoryId,
        isPublished: formData.isPublished,
        isActive: formData.isActive,
      });
      router.push('/manage-content');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update content');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (!content) return;

    setError(null);

    try {
      setPublishing(true);
      await publish(content.contentId);
      setContent((prev) =>
        prev ? { ...prev, isPublished: !prev.isPublished } : null
      );
      setFormData((prev) => ({ ...prev, isPublished: !prev.isPublished }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update publish status');
    } finally {
      setPublishing(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#ffc032] animate-spin" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Content not found</p>
          <Link href="/manage-content" className="text-[#ffc032] hover:underline">
            Back to Content
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/manage-content"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Content
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Edit Content</h1>
            <button
              onClick={handlePublish}
              disabled={publishing}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                content.isPublished
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-green-600 text-white hover:bg-green-500'
              }`}
            >
              {publishing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : content.isPublished ? (
                <GlobeLock className="w-5 h-5" />
              ) : (
                <Globe className="w-5 h-5" />
              )}
              {content.isPublished ? 'Unpublish' : 'Publish'}
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-[#1a1a1a] rounded-lg p-6">
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-4 py-2 bg-[#222] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ffc032]"
            />
          </div>

          {/* Summary */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Summary
            </label>
            <textarea
              value={formData.summary}
              onChange={(e) => handleChange('summary', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-[#222] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ffc032] resize-none"
            />
          </div>

          {/* Thumbnail URL */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Thumbnail URL
            </label>
            <input
              type="text"
              value={formData.thumbnailUrl}
              onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
              className="w-full px-4 py-2 bg-[#222] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ffc032]"
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            {fetchingCategories ? (
              <div className="flex items-center gap-2 text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading categories...
              </div>
            ) : (
              <select
                value={formData.categoryId}
                onChange={(e) => handleChange('categoryId', Number(e.target.value))}
                className="w-full px-4 py-2 bg-[#222] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ffc032]"
              >
                {categories.map((cat) => (
                  <option key={cat.categoryContentId} value={cat.categoryContentId}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Checkboxes */}
          <div className="mb-6 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
                className="w-5 h-5 rounded border-[#333] bg-[#222] text-[#ffc032] focus:ring-[#ffc032] focus:ring-offset-0"
              />
              <span className="text-sm text-gray-300">Active</span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2 bg-[#ffc032] text-[#111] rounded-lg font-semibold hover:bg-[#e6ae2c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
            <Link
              href="/manage-content"
              className="px-6 py-2 bg-[#333] text-white rounded-lg font-semibold hover:bg-[#444] transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditContentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#111] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#ffc032] animate-spin" />
        </div>
      }
    >
      <EditContentContent />
    </Suspense>
  );
}

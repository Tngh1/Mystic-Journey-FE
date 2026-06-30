'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { updateCategory, getCategories, CategoryResponse } from '@/lib/api/contents';
import ImageUploader from '@/components/ui/ImageUploader';
import {
  uploadImageWithCleanup,
} from '@/lib/api/cloudinary';

interface FormData {
  name: string;
  slug: string;
  description: string;
  iconUrl: string | File | null;
  isActive: boolean;
}


function UpdateCategoryContentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<CategoryResponse | null>(null);
  const [originalIconUrl, setOriginalIconUrl] = useState<string>('');

  const [formData, setFormData] = useState<FormData>({
    name: '',
    slug: '',
    description: '',
    iconUrl: '' as string | File | null,
    isActive: true,
  });

  useEffect(() => {
    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategories();
      const cat = data.find((c) => c.categoryContentId === Number(categoryId));
      if (cat) {
        setCategory(cat);
        setOriginalIconUrl(cat.iconUrl || '');
        setFormData({
          name: cat.name,
          slug: cat.slug,
          description: cat.description || '',
          iconUrl: cat.iconUrl || '',
          isActive: cat.isActive,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch category');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string | boolean | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    setError(null);

    try {
      setSubmitting(true);

      let finalIconUrl: string | undefined;
      if (formData.iconUrl instanceof File) {
        const result = await uploadImageWithCleanup(formData.iconUrl, originalIconUrl);
        finalIconUrl = result.secureUrl;
      } else if (typeof formData.iconUrl === 'string' && formData.iconUrl) {
        finalIconUrl = formData.iconUrl;
      }

      await updateCategory(category.categoryContentId, {
        name: formData.name,
        slug: formData.slug || undefined,
        description: formData.description || undefined,
        iconUrl: finalIconUrl,
        isActive: formData.isActive,
      });
      router.push('/manage-category-content');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#ffc032]" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-red-400 mb-4">Category not found</p>
          <button
            onClick={() => router.push("/manage-category-content")}
            className="text-[#ffc032] hover:underline"
          >
            Back to Categories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/manage-category-content")}
          className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Update Category</h1>
          <p className="text-white/50 text-sm">Edit content category (ID: {categoryId})</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-400/10 border border-red-400/20 rounded-lg p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors resize-none"
            />
          </div>

          {/* Icon */}
          <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-4">
            <ImageUploader
              value={formData.iconUrl}
              onChange={(url) => handleChange('iconUrl', url)}
              label="Icon"
            />
          </div>

          {/* Active */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              className="w-5 h-5 rounded border-white/20 bg-white/5 text-[#ffc032] focus:ring-[#ffc032] focus:ring-offset-0 cursor-pointer"
            />
            <label htmlFor="isActive" className="text-sm text-white/70 cursor-pointer">
              Category is active
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => router.push("/manage-category-content")}
              className="px-4 py-2 text-sm font-medium text-white/70 bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-[#ffc032] hover:bg-[#ffc032]/90 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {submitting ? "Updating..." : "Update Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UpdateCategoryContentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#ffc032] animate-spin" />
        </div>
      }
    >
      <UpdateCategoryContentContent />
    </Suspense>
  );
}

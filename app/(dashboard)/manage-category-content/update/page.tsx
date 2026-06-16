'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Upload, X } from 'lucide-react';
import { updateCategory, getCategories, CategoryResponse } from '@/lib/api/content';
import { uploadImageToCloudinary } from '@/lib/api/cloudinary';

interface FormData {
  name: string;
  slug: string;
  description: string;
  iconUrl: string;
  isActive: boolean;
}

interface IconUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

function IconUploader({ value, onChange }: IconUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      const result = await uploadImageToCloudinary(file);
      onChange(result.secureUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    await handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div>
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-2 rounded-lg text-sm mb-2">
          {error}
        </div>
      )}

      {!value ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => handleFileSelect((e.target as HTMLInputElement).files);
            input.click();
          }}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-[#ffc032] bg-[#ffc032]/10'
              : 'border-gray-600 hover:border-gray-500'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 text-[#ffc032] animate-spin" />
              <p className="text-gray-400 text-sm">Uploading...</p>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Click or drag image here</p>
            </>
          )}
        </div>
      ) : (
        <div className="relative inline-block">
          <img src={value} alt="Icon" className="w-24 h-24 object-cover rounded-lg bg-[#111]" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 p-1.5 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function UpdateCategoryContentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<CategoryResponse | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    slug: '',
    description: '',
    iconUrl: '',
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

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    setError(null);

    try {
      setSubmitting(true);
      await updateCategory(category.categoryContentId, {
        name: formData.name,
        slug: formData.slug || undefined,
        description: formData.description || undefined,
        iconUrl: formData.iconUrl || undefined,
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
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#ffc032] animate-spin" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Category not found</p>
          <Link href="/manage-category-content" className="text-[#ffc032] hover:underline">
            Back to Categories
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
            href="/manage-category-content"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Categories
          </Link>
          <h1 className="text-3xl font-bold text-white">Update Category</h1>
          <p className="text-gray-400 mt-1">Edit content category</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-[#1a1a1a] rounded-lg p-6">
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-2 bg-[#222] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ffc032]"
            />
          </div>

          {/* Slug */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Slug
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              className="w-full px-4 py-2 bg-[#222] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ffc032]"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-[#222] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ffc032] resize-none"
            />
          </div>

          {/* Icon URL */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Icon
            </label>
            <IconUploader
              value={formData.iconUrl}
              onChange={(url) => handleChange('iconUrl', url)}
            />
          </div>

          {/* Active */}
          <div className="mb-6">
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
                  Updating...
                </>
              ) : (
                'Update Category'
              )}
            </button>
            <Link
              href="/manage-category-content"
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

export default function UpdateCategoryContentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#111] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#ffc032] animate-spin" />
        </div>
      }
    >
      <UpdateCategoryContentContent />
    </Suspense>
  );
}

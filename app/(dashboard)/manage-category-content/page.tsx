'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Loader2 } from 'lucide-react';
import { CategoryResponse, getCategories } from '@/lib/api/content';

export default function ManageCategoryContentPage() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#ffc032] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#ffc032] to-[#ff8c00] flex items-center justify-center">
                <svg className="w-8 h-8 text-[#111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#ffc032]">Manage Category Content</h1>
                <p className="text-gray-400">Create and manage content categories</p>
              </div>
            </div>
            <Link
              href="/manage-category-content/create"
              className="px-6 py-3 bg-[#ffc032] text-[#111] font-semibold rounded-xl hover:bg-[#ffd04c] transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Category
            </Link>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Table */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Slug</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Created</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      No categories found
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.categoryContentId} className="border-b border-gray-800/50 hover:bg-[#222] transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-400 font-mono">{cat.categoryContentId}</td>
                      <td className="px-6 py-4 font-medium">{cat.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{cat.slug}</td>
                      <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">{cat.description || '-'}</td>
                      <td className="px-6 py-4">
                        {cat.isActive ? (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(cat.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/manage-category-content/update?id=${cat.categoryContentId}`}
                          className="px-4 py-2 bg-[#ffc032] text-[#111] rounded-lg hover:bg-[#ffd04c] transition-colors text-sm font-medium inline-flex items-center gap-2"
                        >
                          <Pencil className="w-4 h-4" />
                          Update
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

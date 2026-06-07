'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Save, Shield, UserPlus, Eye, EyeOff } from 'lucide-react';
import { create } from '@/lib/api/admin-account';

export default function CreateAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    displayName: '',
    roleId: 2,
    isActive: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const payload = {
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName || undefined,
        roleId: formData.roleId,
        isActive: formData.isActive,
      };

      await create(payload);
      setSuccess(true);

      setTimeout(() => {
        router.push('/manage-admins');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111] text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/manage-admins"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#ffc032] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admins
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ffc032] to-[#ff8c00] flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-[#111]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#ffc032]">Create Account</h1>
                <p className="text-gray-400">Create a new admin or player account</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
            <p className="text-green-400">Account created successfully! Redirecting...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#ffc032]" />
              Account Information
            </h2>

            <div className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Username <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#ffc032] transition-colors"
                  placeholder="Enter username"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#ffc032] transition-colors"
                  placeholder="Enter email address"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#ffc032] transition-colors pr-12"
                    placeholder="Enter password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Display Name (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Display Name <span className="text-gray-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#ffc032] transition-colors"
                  placeholder="Enter display name"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Role <span className="text-red-400">*</span>
                </label>
                <select
                  name="roleId"
                  value={formData.roleId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#ffc032] transition-colors"
                  required
                >
                  <option value={2}>Admin</option>
                  <option value={3}>Super Admin</option>
                  <option value={1}>Player</option>
                </select>
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-700 bg-[#0d0d0d] text-[#ffc032] focus:ring-[#ffc032] focus:ring-offset-0"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-300">
                  Active
                </label>
              </div>
            </div>
          </div>

          {/* Role Info */}
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6 mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-4">Role Permissions</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2" />
                <div>
                  <p className="font-medium text-purple-400">Super Admin</p>
                  <p className="text-sm text-gray-500">Full system access including account management</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2" />
                <div>
                  <p className="font-medium text-red-400">Admin</p>
                  <p className="text-sm text-gray-500">Full access to all game features and settings</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                <div>
                  <p className="font-medium text-blue-400">Player</p>
                  <p className="text-sm text-gray-500">Regular player account</p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link
              href="/manage-admins"
              className="px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#ffc032] text-[#111] font-semibold rounded-xl hover:bg-[#ffd04c] transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

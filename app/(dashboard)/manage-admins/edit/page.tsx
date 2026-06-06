'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Save, Shield, Eye, EyeOff } from 'lucide-react';
import { getById, update, AccountAdminResponse } from '@/lib/api/admin-account';

export default function EditAdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accountId = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    roleId: 2,
    isActive: true,
    newPassword: '',
  });

  useEffect(() => {
    if (accountId) {
      fetchAccount();
    }
  }, [accountId]);

  const fetchAccount = async () => {
    if (!accountId) return;

    try {
      setLoading(true);
      setError(null);
      const data: AccountAdminResponse = await getById(Number(accountId));

      setUserName(data.userName);
      setFormData((prev) => ({
        ...prev,
        email: data.email,
        roleId: getRoleIdFromName(data.roleName),
        isActive: data.isActive,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load account');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIdFromName = (roleName: string): number => {
    switch (roleName) {
      case 'Player':
        return 1;
      case 'Admin':
        return 2;
      case 'Super Admin':
        return 3;
      default:
        return 2;
    }
  };

  const getRoleNameFromId = (roleId: number): string => {
    switch (roleId) {
      case 1:
        return 'Player';
      case 2:
        return 'Admin';
      case 3:
        return 'Super Admin';
      default:
        return 'Admin';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountId) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const payload: Record<string, unknown> = {
        email: formData.email,
        roleId: formData.roleId,
        isActive: formData.isActive,
      };

      if (formData.newPassword && formData.newPassword.trim()) {
        payload.newPassword = formData.newPassword;
      }

      await update(Number(accountId), payload);
      setSuccess(true);

      setTimeout(() => {
        router.push('/manage-admins');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update account');
    } finally {
      setSaving(false);
    }
  };

  if (!accountId) {
    return (
      <div className="min-h-screen bg-[#111] text-white p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
            <p className="text-red-400">No account ID provided</p>
            <Link href="/manage-admins" className="text-[#ffc032] hover:underline mt-2 inline-block">
              Back to Accounts List
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const roleColors: Record<string, string> = {
    'Super Admin': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    Admin: 'bg-red-500/20 text-red-400 border-red-500/30',
    Player: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
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
              <Shield className="w-8 h-8 text-[#111]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#ffc032]">Edit Admin</h1>
              <p className="text-gray-400">Update admin account information</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#ffc032] animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Success Message */}
            {success && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
                <p className="text-green-400">Account updated successfully! Redirecting...</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* Account Info Display */}
            <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6 mb-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#ffc032]" />
                Account Information
              </h2>

              {/* Username (Read-only) */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                <div className="px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-gray-400">
                  {userName}
                </div>
                <p className="text-xs text-gray-500 mt-2">Username cannot be changed</p>
              </div>

              {/* Email */}
              <div className="mb-6">
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

              {/* Role */}
              <div className="mb-6">
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
                <div className="mt-3">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${
                      roleColors[getRoleNameFromId(formData.roleId)]
                    }`}
                  >
                    {getRoleNameFromId(formData.roleId)}
                  </span>
                </div>
              </div>

              {/* Active Status */}
              <div className="mb-6 flex items-center gap-3">
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

              {/* New Password (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  New Password <span className="text-gray-500">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#ffc032] transition-colors pr-12"
                    placeholder="Leave blank to keep current password"
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
                <p className="text-xs text-gray-500 mt-2">Only fill this if you want to change the password</p>
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
                disabled={saving}
                className="px-6 py-3 bg-[#ffc032] text-[#111] font-semibold rounded-xl hover:bg-[#ffd04c] transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

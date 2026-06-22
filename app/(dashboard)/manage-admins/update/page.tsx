'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2, Save, Eye, EyeOff } from 'lucide-react';
import { getById, update, AccountAdminResponse } from '@/lib/api/admin-account';

function EditAdminContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accountId = searchParams.get('id');

  const [fetching, setFetching] = useState(true);
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
      setFetching(true);
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
      setFetching(false);
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

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#ffc032]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/manage-admins")}
          className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Update Account</h1>
          <p className="text-white/50 text-sm">Update account details (ID: {accountId})</p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-400/10 border border-green-400/20 rounded-lg p-4 text-green-400 text-sm">
          Account updated successfully! Redirecting...
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-400/10 border border-red-400/20 rounded-lg p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username (Read-only) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Username
              </label>
              <input
                type="text"
                value={userName}
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white/50 cursor-not-allowed"
              />
              <p className="text-xs text-white/30">Username cannot be changed</p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Role <span className="text-red-400">*</span>
              </label>
              <select
                name="roleId"
                value={formData.roleId}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              >
                <option value={2} className="bg-[#1a1a1a]">Admin</option>
                <option value={3} className="bg-[#1a1a1a]">Super Admin</option>
                <option value={1} className="bg-[#1a1a1a]">Player</option>
              </select>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 pr-12 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-white/30">Only fill this if you want to change the password</p>
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-5 h-5 rounded border-white/20 bg-white/5 text-[#ffc032] focus:ring-[#ffc032] focus:ring-offset-0 cursor-pointer"
            />
            <label htmlFor="isActive" className="text-sm text-white/70 cursor-pointer">
              Account is active
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => router.push("/manage-admins")}
              className="px-4 py-2 text-sm font-medium text-white/70 bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-[#ffc032] hover:bg-[#ffc032]/90 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Updating..." : "Update Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditAdminPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#ffc032] animate-spin" />
        </div>
      }
    >
      <EditAdminContent />
    </Suspense>
  );
}

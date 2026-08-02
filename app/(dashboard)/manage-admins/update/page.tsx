'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Save, Eye, EyeOff, UserCheck, ShieldCheck, CircleCheck } from 'lucide-react';
import { getById, update, AccountAdminResponse } from '@/lib/api/admin-accounts';
import { showSuccessAlert, showErrorAlert } from '@/lib/utils/swal';
import { useAuth } from '@/lib/contexts/AuthContext';
import FormHeader from '@/components/form/FormHeader';
import FormSection from '@/components/form/FormSection';
import FormField from '@/components/form/FormField';
import FormActions from '@/components/form/FormActions';
import FormAlert from '@/components/form/FormAlert';
import { TextInput, SelectInput, Checkbox } from '@/components/form/FormInput';

const ROLE_OPTIONS = [
  { value: '1', label: 'Player' },
  { value: '2', label: 'Admin' },
  { value: '3', label: 'Super Admin' },
];

function EditAdminContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accountId = searchParams.get('id');
  const { user, isLoading: authLoading } = useAuth();
  const normalizedRole = user?.role?.toLowerCase() ?? '';
  const isSuperAdmin = normalizedRole === 'superadmin' || normalizedRole === 'super admin';

  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isSuperAdmin) {
      router.replace('/dashboard');
    }
  }, [authLoading, isSuperAdmin, router]);
  
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    roleId: 2,
    isActive: true,
    newPassword: '',
  });

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

  function getRoleIdFromName(roleName: string): number {
    switch (roleName) {
      case 'Player': return 1;
      case 'Admin': return 2;
      case 'Super Admin': return 3;
      default: return 2;
    }
  }

  useEffect(() => {
    if (accountId) {
      void fetchAccount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);

  const handleChange = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
      await showSuccessAlert('Success!', 'Account updated successfully.');

      setTimeout(() => {
        router.push('/manage-admins');
      }, 1500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update account';
      setError(msg);
      await showErrorAlert('Error', msg);
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
    <form onSubmit={handleSubmit} className="space-y-6 pb-32">
      <FormHeader
        title="Update Account"
        subtitle={`Update account details (ID: ${accountId})`}
        backHref="/manage-admins"
        badge="Editing"
        badgeTone="warning"
      />

      {success && (
        <div className="bg-green-400/10 border border-green-400/20 rounded-lg p-4 text-green-400 text-sm flex items-center gap-2">
          <CircleCheck className="w-5 h-5" />
          Account updated successfully! Redirecting...
        </div>
      )}

      {error && <FormAlert message={error} onDismiss={() => setError(null)} />}

      <FormSection title="Account Information" icon={UserCheck}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Username" htmlFor="userName">
            <TextInput
              id="userName"
              value={userName}
              disabled
              className="opacity-50 cursor-not-allowed"
            />
            <p className="text-xs text-white/30 mt-1">Username cannot be changed</p>
          </FormField>

          <FormField label="Email" htmlFor="email" required>
            <TextInput
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Enter email address"
              required
            />
          </FormField>

          <FormField label="Role" htmlFor="roleId" required>
            <SelectInput
              id="roleId"
              name="roleId"
              options={ROLE_OPTIONS}
              value={String(formData.roleId)}
              onChange={(e) => handleChange('roleId', Number(e.target.value))}
            />
          </FormField>

          <FormField label="New Password" htmlFor="newPassword">
            <div className="relative">
              <TextInput
                id="newPassword"
                name="newPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => handleChange('newPassword', e.target.value)}
                placeholder="Leave blank to keep current"
                minLength={6}
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-white/30 mt-1">Only fill this if you want to change the password</p>
          </FormField>
        </div>

        <Checkbox
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => handleChange('isActive', e.target.checked)}
          label="Account is active"
        />
      </FormSection>

      <FormActions
        onCancel={() => router.push('/manage-admins')}
        submitLabel="Update Account"
        loadingLabel="Updating..."
        loading={saving}
        submitIcon={Save}
      />
    </form>
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
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, Eye, EyeOff, UserPlus, ShieldCheck, CircleCheck } from 'lucide-react';
import { create } from '@/lib/api/admin-accounts';
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

export default function CreateAdminPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const normalizedRole = user?.role?.toLowerCase() ?? '';
  const isSuperAdmin = normalizedRole === 'superadmin' || normalizedRole === 'super admin';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!authLoading && !isSuperAdmin) {
      router.replace('/dashboard');
    }
  }, [authLoading, isSuperAdmin, router]);

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    displayName: '',
    roleId: 2,
    isActive: true,
  });

  if (authLoading || !isSuperAdmin) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#ffc032]" />
      </div>
    );
  }

  const handleChange = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
      await showSuccessAlert('Success!', 'Account created successfully.');

      setTimeout(() => {
        router.push('/manage-admins');
      }, 1500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create account';
      setError(msg);
      await showErrorAlert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-32">
      <FormHeader
        title="Create Account"
        subtitle="Create a new admin or player account"
        backHref="/manage-admins"
        badge="New"
        badgeTone="primary"
      />

      {success && (
        <div className="bg-green-400/10 border border-green-400/20 rounded-lg p-4 text-green-400 text-sm flex items-center gap-2">
          <CircleCheck className="w-5 h-5" />
          Account created successfully! Redirecting...
        </div>
      )}

      {error && <FormAlert message={error} onDismiss={() => setError(null)} />}

      <FormSection title="Account Information" icon={UserPlus}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Username" htmlFor="userName" required>
            <TextInput
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={(e) => handleChange('userName', e.target.value)}
              placeholder="Enter username"
              required
            />
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

          <FormField label="Password" htmlFor="password" required>
            <div className="relative">
              <TextInput
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Enter password"
                required
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
          </FormField>

          <FormField label="Display Name" htmlFor="displayName">
            <TextInput
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={(e) => handleChange('displayName', e.target.value)}
              placeholder="Enter display name (optional)"
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
        submitLabel="Create Account"
        loadingLabel="Creating..."
        loading={loading}
        submitIcon={Save}
      />
    </form>
  );
}
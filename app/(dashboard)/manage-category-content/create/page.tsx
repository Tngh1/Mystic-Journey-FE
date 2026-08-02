'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, FolderTree, Image as ImageIcon } from 'lucide-react';
import { createCategory } from '@/lib/api/contents';
import { showSuccessAlert, showErrorAlert } from '@/lib/utils/swal';
import ImageUploader from '@/components/ui/ImageUploader';
import { uploadImageToCloudinary } from '@/lib/api/cloudinary';
import FormHeader from '@/components/form/FormHeader';
import FormSection from '@/components/form/FormSection';
import FormField from '@/components/form/FormField';
import FormActions from '@/components/form/FormActions';
import FormAlert from '@/components/form/FormAlert';
import { TextInput, TextArea, Checkbox } from '@/components/form/FormInput';

interface FormData {
  name: string;
  slug: string;
  description: string;
  iconUrl: string | File | null;
  isActive: boolean;
}

export default function CreateCategoryContentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    slug: '',
    description: '',
    iconUrl: '' as string | File | null,
    isActive: true,
  });

  const handleChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      setLoading(true);

      let finalIconUrl = formData.iconUrl;
      if (finalIconUrl instanceof File) {
        const result = await uploadImageToCloudinary(finalIconUrl);
        finalIconUrl = result.secureUrl;
      }

      const iconUrl = typeof finalIconUrl === 'string' && finalIconUrl ? finalIconUrl : undefined;

      await createCategory({
        name: formData.name,
        slug: formData.slug || undefined,
        description: formData.description || undefined,
        iconUrl,
        isActive: formData.isActive,
      });
      await showSuccessAlert('Success!', 'Category created successfully.');
      router.push('/manage-category-content');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create category';
      setError(msg);
      await showErrorAlert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-32">
      <FormHeader
        title="Create Category"
        subtitle="Add a new content category"
        backHref="/manage-category-content"
        badge="New"
        badgeTone="primary"
      />

      {error && <FormAlert message={error} onDismiss={() => setError(null)} />}

      <FormSection title="Category Details" icon={FolderTree}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Name" htmlFor="name" required>
            <TextInput
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Category name"
              required
            />
          </FormField>

          <FormField label="Slug" htmlFor="slug" hint="Auto-generated if empty">
            <TextInput
              id="slug"
              value={formData.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              placeholder="category-slug"
            />
          </FormField>
        </div>

        <FormField label="Description" htmlFor="description">
          <TextArea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Category description"
            rows={3}
          />
        </FormField>

        <Checkbox
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => handleChange('isActive', e.target.checked)}
          label="Category is active"
        />
      </FormSection>

      <FormSection title="Icon" icon={ImageIcon}>
        <ImageUploader
          value={formData.iconUrl}
          onChange={(url) => handleChange('iconUrl', url)}
          label="Icon"
        />
      </FormSection>

      <FormActions
        onCancel={() => router.push('/manage-category-content')}
        submitLabel="Create Category"
        loadingLabel="Creating..."
        loading={loading}
        submitIcon={Save}
      />
    </form>
  );
}
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Save, FolderTree, Image as ImageIcon } from 'lucide-react';
import { updateCategory, getCategories, CategoryResponse } from '@/lib/api/contents';
import { showSuccessAlert, showErrorAlert } from '@/lib/utils/swal';
import ImageUploader from '@/components/ui/ImageUploader';
import { uploadImageWithCleanup } from '@/lib/api/cloudinary';
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

// Renders the update category content content view component.
// Key functionality: manages local UI state, pagination, and filter values.
// Returns the JSX element hierarchy for the page view.
function UpdateCategoryContentContent() {
  const router = useRouter();  // Initialize Next.js router for programmatic navigation
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('id');

  const [loading, setLoading] = useState(true);  // Initialize loading flag as active on first render
  const [submitting, setSubmitting] = useState(false);  // Initialize boolean flag as inactive
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

  // Renders the fetch category view component.
  // Returns the JSX element hierarchy for the page view.
  const fetchCategory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategories();  // Await asynchronous operation before proceeding
      // Renders the cat view component.
      // Returns the JSX element hierarchy for the page view.
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

  // Synchronize this effect by builds resolve whenever its dependencies change.
  useEffect(() => {
    if (categoryId) {
      void Promise.resolve().then(fetchCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  // Renders the handle change view component.
  // Returns the JSX element hierarchy for the page view.
  const handleChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Renders the handle submit view component.
  // Key functionality: displays interactive alert dialogues for user actions.
  // Returns the JSX element hierarchy for the page view.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  // Prevent default HTML form submission and page reload
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
      await showSuccessAlert('Success!', 'Category updated successfully.');  // Display styled success alert dialog to the user
      router.push('/manage-category-content');  // Navigate to the next page and push to history stack
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update category';
      setError(msg);
      await showErrorAlert('Error', msg);  // Display styled error alert dialog to the user
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
            onClick={() => router.push("/manage-category-content")}  // Navigate to the next page and push to history stack
            className="text-[#ffc032] hover:underline cursor-pointer"
          >
            Back to Categories
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-32">
      <FormHeader
        title="Update Category"
        subtitle={`Edit content category (ID: ${categoryId})`}
        backHref="/manage-category-content"
        badge="Editing"
        badgeTone="warning"
      />

      {error && <FormAlert message={error} onDismiss={() => setError(null)} />}

      <FormSection title="Category Details" icon={FolderTree}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Name" htmlFor="name" required>
            <TextInput
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </FormField>

          <FormField label="Slug" htmlFor="slug">
            <TextInput
              id="slug"
              value={formData.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
            />
          </FormField>
        </div>

        <FormField label="Description" htmlFor="description">
          <TextArea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
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
        onCancel={() => router.push('/manage-category-content')}  // Navigate to the next page and push to history stack
        submitLabel="Update Category"
        loadingLabel="Updating..."
        loading={submitting}
        submitIcon={Save}
      />
    </form>
  );
}

// Renders the update category content page view component.
// Returns the JSX element hierarchy for the page view.
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

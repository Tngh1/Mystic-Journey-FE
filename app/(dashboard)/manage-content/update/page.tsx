'use client';

import { useState, useEffect, Suspense, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ArrowLeft,
  Loader2,
  GripVertical,
  Image as ImageIcon,
  Type,
  Upload,
  X,
  Quote,
  Globe,
  GlobeLock,
  Plus,
} from 'lucide-react';
import { getById, update, publish, getCategories, createBlock, updateBlock, removeBlock, ContentDetailResponse, CategoryResponse, BlockResponse } from '@/lib/api/contents';
import { uploadImageToCloudinary, uploadImageWithCleanup } from '@/lib/api/cloudinary';
import EditableTextBlock from '@/components/ui/EditableTextBlock';
import { showConfirmAlert, showErrorAlert, showSuccessAlert } from '@/lib/utils/swal';
import ImageUploader from '@/components/ui/ImageUploader';

interface FormData {
  title: string;
  summary: string;
  thumbnailUrl: string | File | null;
  categoryId: number;
  isPublished: boolean;
}

interface LocalBlock extends BlockResponse {
  tempId?: string;
  isNew?: boolean;
  isDirty?: boolean;
  mediaFile?: File | null;
}

// Renders the editable image block view component.
// Returns the JSX element hierarchy for the page view.
function EditableImageBlock({ block, onUpdate, onDelete }: {
  block: LocalBlock;
  onUpdate: (id: string, updates: Partial<LocalBlock>) => void;
  onDelete: (id: string) => void;
}) {
  const blockId = String(block.tempId ?? block.blockContentId);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: blockId });

  // Renders the style view component.
  // Key functionality: manages local UI state, pagination, and filter values.
  // Returns the JSX element hierarchy for the page view.
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  const [isDraggingFile, setIsDraggingFile] = useState(false);  // Initialize boolean flag as inactive
  const [error, setError] = useState<string | null>(null);

  // Renders the handle file select view component.
  // Returns the JSX element hierarchy for the page view.
  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setError(null);
    const objectUrl = URL.createObjectURL(file);
    onUpdate(blockId, { mediaUrl: objectUrl, mediaFile: file });
  };

  // Renders the handle drop view component.
  // Returns the JSX element hierarchy for the page view.
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();  // Prevent default HTML form submission and page reload
    setIsDraggingFile(false);
    handleFileSelect(e.dataTransfer.files);
  };

  // Renders the handle caption change view component.
  // Returns the JSX element hierarchy for the page view.
  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(blockId, { caption: e.target.value });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-[#222] border border-purple-500/50 rounded-lg overflow-hidden"
    >
      <div className="flex items-stretch">
        <div
          {...attributes}
          {...listeners}
          className="flex items-center px-2 bg-[#111111] border-r border-purple-500/30 cursor-grab active:cursor-grabbing hover:bg-[#252525]"
        >
          <GripVertical className="w-4 h-4 text-purple-400/50" />
        </div>

        <div className="flex-1 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs font-medium">
              <ImageIcon className="w-3 h-3 inline mr-1" />
              Image
            </span>
            <div className="flex-1" />
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();  // Prevent default HTML form submission and page reload
                e.stopPropagation();
              }}
              onClick={async (e) => {
                e.stopPropagation();
                const result = await showConfirmAlert(
                  'Delete this content block?',
                  'This action cannot be undone.',
                  'Delete',
                  'Cancel'
                );
                if (result) {
                  onDelete(blockId);
                }
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 border border-red-500/30 rounded transition-colors cursor-pointer"
              title="Delete this block"
            >
              <X className="w-3.5 h-3.5" />
              Delete Block
            </button>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-3 py-2 rounded-lg text-xs">
              {error}
            </div>
          )}

          {!block.mediaUrl ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}  // Prevent default HTML form submission and page reload
              onDragLeave={(e) => { e.preventDefault(); setIsDraggingFile(false); }}  // Prevent default HTML form submission and page reload
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => handleFileSelect((e.target as HTMLInputElement).files);
                input.click();
              }}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDraggingFile
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Drag & drop or click to upload</p>
            </div>
          ) : (
            <div className="relative">
              <img src={block.mediaUrl} alt="Preview" className="w-full max-h-48 object-contain rounded-lg bg-[#111]" />
              <button
                type="button"
                onClick={() => onUpdate(blockId, { mediaUrl: '', mediaFile: null })}
                className="absolute top-2 right-2 p-1.5 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <input
            type="text"
            value={block.caption || ''}
            onChange={handleCaptionChange}
            placeholder="Image caption (optional)"
            className="w-full px-3 py-1.5 bg-[#111111] border border-[#333] rounded text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>
    </div>
  );
}


// Renders the insert zone view component.
// Returns the JSX element hierarchy for the page view.
function InsertZone({
  onAddText,
  onAddImage,
}: {
  onAddText: () => void;
  onAddImage: () => void;
}) {
  const [hovered, setHovered] = useState(false);  // Initialize boolean flag as inactive
  return (
    <div className="relative flex items-center py-2">
      <div className="flex-1 h-px bg-gray-700/20" />
      <div
        className="flex items-center gap-1.5 px-3 h-8"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {hovered ? (
          <>
            <button
              type="button"
              onClick={onAddText}
              className="flex items-center gap-1 px-2.5 py-0.5 text-xs bg-blue-500/20 text-blue-400 border border-blue-500/40 rounded-full hover:bg-blue-500/30 transition-colors font-medium whitespace-nowrap cursor-pointer"
            >
              <Type className="w-3 h-3" /> Text
            </button>
            <button
              type="button"
              onClick={onAddImage}
              className="flex items-center gap-1 px-2.5 py-0.5 text-xs bg-purple-500/20 text-purple-400 border border-purple-500/40 rounded-full hover:bg-purple-500/30 transition-colors font-medium whitespace-nowrap cursor-pointer"
            >
              <ImageIcon className="w-3 h-3" /> Image
            </button>
          </>
        ) : (
          <Plus className="w-3.5 h-3.5 text-gray-700" />
        )}
      </div>
      <div className="flex-1 h-px bg-gray-700/20" />
    </div>
  );
}

// Renders the update content content view component.
// Key functionality: manages local UI state, pagination, and filter values.
// Returns the JSX element hierarchy for the page view.
function UpdateContentContent() {
  const router = useRouter();  // Initialize Next.js router for programmatic navigation
  const searchParams = useSearchParams();
  const contentId = searchParams.get('id');

  const [loading, setLoading] = useState(true);  // Initialize loading flag as active on first render
  const [submitting, setSubmitting] = useState(false);  // Initialize boolean flag as inactive
  const [publishing, setPublishing] = useState(false);  // Initialize boolean flag as inactive
  const [fetchingCategories, setFetchingCategories] = useState(true);  // Initialize loading flag as active on first render
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<ContentDetailResponse | null>(null);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [allBlocks, setAllBlocks] = useState<LocalBlock[]>([]);
  const [deletedBlockIds, setDeletedBlockIds] = useState<number[]>([]);
  const [originalThumbnailUrl, setOriginalThumbnailUrl] = useState<string>("");

  // Renders the editor content getters view component.
  // Returns the JSX element hierarchy for the page view.
  const editorContentGetters = useRef<Map<string, () => string>>(new Map());

  // Renders the generate id view component.
  // Returns the JSX element hierarchy for the page view.
  const generateId = () =>
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `new-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const [formData, setFormData] = useState<FormData>({
    title: '',
    summary: '',
    thumbnailUrl: '' as string | File | null,
    categoryId: 0,
    isPublished: false,
  });

  // Renders the fetch data view component.
  // Returns the JSX element hierarchy for the page view.
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Execute these independent asynchronous operations concurrently, then combine their results after all complete.
      const [contentData, categoriesData] = await Promise.all([
        getById(Number(contentId)),
        getCategories(),
      ]);
      setContent(contentData);
      setCategories(categoriesData.filter((c: CategoryResponse) => c.isActive));
      setAllBlocks(
        (contentData.blocks || [])
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((b: BlockResponse, index) => {
            const localB = b as LocalBlock;
            return {
              ...b,
              tempId: localB.tempId || (b.blockContentId ? `block-${b.blockContentId}` : `block-existing-${index}-${Date.now()}`),
              isDirty: false,
              isNew: false,
            };
          })
      );
      setOriginalThumbnailUrl(contentData.thumbnailUrl || "");
      setFormData({
        title: contentData.title,
        summary: contentData.summary || '',
        thumbnailUrl: contentData.thumbnailUrl || '',
        categoryId: contentData.categoryId ?? 0,
        isPublished: contentData.isPublished,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch content');
    } finally {
      setLoading(false);
      setFetchingCategories(false);
    }
  };

  // Synchronize this effect by builds resolve whenever its dependencies change.
  useEffect(() => {
    if (contentId) {
      void Promise.resolve().then(fetchData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentId]);

  // Renders the get block key view component.
  // Returns the JSX element hierarchy for the page view.
  const getBlockKey = (b: LocalBlock, index?: number): string =>
    b.tempId || (b.blockContentId ? `block-${b.blockContentId}` : `block-idx-${index ?? 0}`);

  // Renders the collect editor content view component.
  // Returns the JSX element hierarchy for the page view.
  const collectEditorContent = () =>
    allBlocks.map(b => {
      const key = getBlockKey(b);
      const getContent = editorContentGetters.current.get(key);
      if (getContent) return { ...b, contentData: getContent(), isDirty: true };
      return b;
    });

  // Renders the handle submit view component.
  // Returns the JSX element hierarchy for the page view.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  // Prevent default HTML form submission and page reload
    if (!content) return;
    setError(null);

    const updatedBlocks = collectEditorContent();

    const invalidImageBlock = updatedBlocks.find(
      (b) => b.blockType === 'image' && !b.mediaUrl?.trim() && !b.mediaFile
    );
    if (invalidImageBlock) {
      setError('All image blocks must contain an image');
      return;
    }

    // Renders the empty text block view component.
    // Returns the JSX element hierarchy for the page view.
    const emptyTextBlock = updatedBlocks.find((b) => {
      if (b.blockType !== 'text') return false;
      const text = (b.contentData || '').replace(/<[^>]*>/g, '').trim();
      return !text;
    });
    if (emptyTextBlock) {
      setError('All text blocks must contain content');
      return;
    }

    try {
      setSubmitting(true);

      // Execute these independent asynchronous operations concurrently, then combine their results after all complete.
      const finalBlocks = await Promise.all(updatedBlocks.map(async (b) => {
        if (b.blockType === 'image' && b.mediaFile) {
          const result = await uploadImageToCloudinary(b.mediaFile);
          return { ...b, mediaUrl: result.secureUrl };
        }
        return b;
      }));

      let finalThumbnailUrl: string | undefined;
      if (formData.thumbnailUrl instanceof File) {
        const result = await uploadImageWithCleanup(formData.thumbnailUrl, originalThumbnailUrl);
        finalThumbnailUrl = result.secureUrl;
      } else if (typeof formData.thumbnailUrl === 'string' && formData.thumbnailUrl) {
        finalThumbnailUrl = formData.thumbnailUrl;
      }
      const thumbnailUrl = finalThumbnailUrl;

      await update(content.contentId, {
        title: formData.title,
        summary: formData.summary,
        thumbnailUrl: thumbnailUrl,
        categoryId: formData.categoryId,
        isPublished: formData.isPublished,
      });

      // Execute these independent asynchronous operations concurrently, then combine their results after all complete.
      await Promise.all(
        deletedBlockIds.filter((id) => id > 0).map((id) => removeBlock(id))
      );

      const updateOps = finalBlocks
        .map((b, i) => ({ ...b, sortOrder: i + 1 }))
        .filter((b) => !b.isNew && b.blockContentId > 0)
        .map((b) =>
          updateBlock(b.blockContentId, {
            contentData: b.contentData || undefined,
            mediaUrl: b.mediaUrl || undefined,
            caption: b.caption || undefined,
            blockType: b.blockType,
            sortOrder: b.sortOrder,
            isActive: b.isActive,
          })
        );

      const createOps = finalBlocks
        .map((b, i) => ({ b, sortOrder: i + 1 }))
        .filter(({ b }) => b.isNew || !b.blockContentId || b.blockContentId <= 0)
        .map(({ b, sortOrder }) =>
          createBlock({
            contentId: content.contentId,
            contentData: b.contentData || undefined,
            mediaUrl: b.mediaUrl || undefined,
            caption: b.caption || undefined,
            blockType: b.blockType,
            sortOrder,
            isActive: b.isActive,
          })
        );

      // Execute these independent asynchronous operations concurrently, then combine their results after all complete.
      const allResults = await Promise.allSettled([...updateOps, ...createOps]);
      // Renders the failed view component.
      // Returns the JSX element hierarchy for the page view.
      const failed = allResults.filter((r) => r.status === 'rejected');
      if (failed.length > 0) {
        const firstReason = (failed[0] as PromiseRejectedResult).reason;
        const message =
          firstReason instanceof Error
            ? firstReason.message
            : `${failed.length} block operation(s) failed. Some changes may not have been saved — please review and try again.`;
        throw new Error(message);
      }

      await showSuccessAlert('Success!', 'Content updated successfully.');  // Display styled success alert dialog to the user
      router.push('/manage-content');  // Navigate to the next page and push to history stack
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update content';
      setError(message);
      await showErrorAlert('Error', message);  // Display styled error alert dialog to the user
    } finally {
      setSubmitting(false);
    }
  };

  // Renders the handle publish view component.
  // Returns the JSX element hierarchy for the page view.
  const handlePublish = async () => {
    if (!content) return;
    setError(null);
    try {
      setPublishing(true);
      await publish(content.contentId);
      setContent(prev => prev ? { ...prev, isPublished: !prev.isPublished } : null);
      setFormData(prev => ({ ...prev, isPublished: !prev.isPublished }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update publish status';
      setError(message);
      await showErrorAlert('Cannot Publish Content', message);  // Display styled error alert dialog to the user
    } finally {
      setPublishing(false);
    }
  };

  // Renders the handle change view component.
  // Returns the JSX element hierarchy for the page view.
  const handleChange = (field: keyof FormData, value: string | number | boolean | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Renders the handle register editor view component.
  // Returns the JSX element hierarchy for the page view.
  const handleRegisterEditor = useCallback((id: string, getContent: () => string) => {
    editorContentGetters.current.set(id, getContent);
  }, []);

  // Renders the handle unregister editor view component.
  // Returns the JSX element hierarchy for the page view.
  const handleUnregisterEditor = useCallback((id: string) => {
    editorContentGetters.current.delete(id);
  }, []);

  // Renders the handle insert block view component.
  // Returns the JSX element hierarchy for the page view.
  const handleInsertBlock = (type: 'text' | 'image', insertAtIndex: number) => {
    const newBlock: LocalBlock = {
      blockContentId: -Date.now(),
      tempId: generateId(),
      contentId: Number(contentId) || 0,
      contentData: type === 'text' ? '<p><br></p>' : null,
      mediaUrl: null,
      caption: null,
      blockType: type,
      sortOrder: 0,
      isActive: true,
      isNew: true,
      isDirty: false,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };
    setAllBlocks(prev => [
      ...prev.slice(0, insertAtIndex),
      newBlock,
      ...prev.slice(insertAtIndex),
    ]);
  };

  // Renders the handle add text view component.
  // Returns the JSX element hierarchy for the page view.
  const handleAddText = () => handleInsertBlock('text', allBlocks.length);
  // Renders the handle add image view component.
  // Returns the JSX element hierarchy for the page view.
  const handleAddImage = () => handleInsertBlock('image', allBlocks.length);

  // Renders the handle update block view component.
  // Returns the JSX element hierarchy for the page view.
  const handleUpdateBlock = (id: string, updates: Partial<LocalBlock>) => {
    setAllBlocks(prev => prev.map(b => {
      if (getBlockKey(b) === id) {
        return { ...b, ...updates, ...(!b.isNew && { isDirty: true }) };
      }
      return b;
    }));
  };

  // Renders the handle delete block view component.
  // Returns the JSX element hierarchy for the page view.
  const handleDeleteBlock = (id: string) => {
    // Renders the block view component.
    // Returns the JSX element hierarchy for the page view.
    const block = allBlocks.find(b => getBlockKey(b) === id);
    setAllBlocks(prev => prev.filter(b => getBlockKey(b) !== id));
    if (block && !block.isNew && block.blockContentId > 0) {
      setDeletedBlockIds(prev => [...prev, block.blockContentId]);
      editorContentGetters.current.delete(String(block.blockContentId));
    } else if (block?.tempId) {
      editorContentGetters.current.delete(block.tempId);
    }
  };

  // Renders the handle drag end view component.
  // Returns the JSX element hierarchy for the page view.
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && String(active.id) !== String(over.id)) {
      setAllBlocks(items => {
        // Renders the old index view component.
        // Returns the JSX element hierarchy for the page view.
        const oldIndex = items.findIndex(item => getBlockKey(item) === String(active.id));
        // Renders the new index view component.
        // Returns the JSX element hierarchy for the page view.
        const newIndex = items.findIndex(item => getBlockKey(item) === String(over.id));
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#ffc032] animate-spin" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Content not found</p>
          <Link href="/manage-content" className="text-[#ffc032] hover:underline">
            Back to Content
          </Link>
        </div>
      </div>
    );
  }

  const sortableIds = allBlocks.map(getBlockKey);

  return (
    <div className="min-h-screen bg-[#111] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link
            href="/manage-content"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Content
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Update Content</h1>
            <button
              onClick={handlePublish}
              disabled={publishing}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                content.isPublished
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-green-600 text-white hover:bg-green-500'
              }`}
            >
              {publishing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : content.isPublished ? (
                <GlobeLock className="w-5 h-5" />
              ) : (
                <Globe className="w-5 h-5" />
              )}
              {content.isPublished ? 'Unpublish' : 'Publish'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-[#111111] rounded-lg p-6">
              {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <h2 className="text-lg font-semibold text-white mb-4">Content Info</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-4 py-2 bg-[#222] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ffc032]"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Summary
                </label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => handleChange('summary', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-[#222] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ffc032] resize-none"
                />
              </div>

              <div className="mb-4">
                <ImageUploader
                  value={formData.thumbnailUrl}
                  onChange={(url) => handleChange('thumbnailUrl', url)}
                  label="Thumbnail"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                {fetchingCategories ? (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading categories...
                  </div>
                ) : (
                  <select
                    value={formData.categoryId}
                    onChange={(e) => handleChange('categoryId', Number(e.target.value))}
                    className="w-full px-4 py-2 bg-[#222] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ffc032]"
                  >
                    {categories.map((cat, idx) => (
                      <option key={`cat-${cat.categoryContentId ?? idx}`} value={cat.categoryContentId}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

            </div>

            <div className="bg-[#111111] rounded-lg p-6">
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2 bg-[#ffc032] text-[#111] rounded-lg font-semibold hover:bg-[#e6ae2c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
                <Link
                  href="/manage-content"
                  className="px-6 py-2 bg-[#333] text-white rounded-lg font-semibold hover:bg-[#444] transition-colors cursor-pointer"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </form>

          <div className="bg-[#111111] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Block Contents</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddText}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg font-medium hover:bg-blue-500/30 transition-colors text-sm cursor-pointer"
                >
                  <Type className="w-4 h-4" />
                  Add Text
                </button>
                <button
                  onClick={handleAddImage}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg font-medium hover:bg-purple-500/30 transition-colors text-sm cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4" />
                  Add Image
                </button>
              </div>
            </div>

            {allBlocks.length === 0 ? (
              <div className="text-center py-16 text-gray-400 border-2 border-dashed border-white/10 rounded-lg">
                <Quote className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                <p>No blocks added yet.</p>
                <p className="text-sm mt-1">Click &quot;Add Text&quot; or &quot;Add Image&quot; to create content blocks.</p>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
                  <div>
                    <InsertZone
                      onAddText={() => handleInsertBlock('text', 0)}
                      onAddImage={() => handleInsertBlock('image', 0)}
                    />
                    {allBlocks.map((block, index) => (
                      <div key={getBlockKey(block)}>
                        {block.blockType === 'text' ? (
                          <EditableTextBlock
                            id={getBlockKey(block)}
                            contentData={block.contentData || ''}
                            onDelete={handleDeleteBlock}
                            onRegisterEditor={handleRegisterEditor}
                            onUnregisterEditor={handleUnregisterEditor}
                          />
                        ) : (
                          <EditableImageBlock
                            block={block}
                            onUpdate={handleUpdateBlock}
                            onDelete={handleDeleteBlock}
                          />
                        )}
                        <InsertZone
                          onAddText={() => handleInsertBlock('text', index + 1)}
                          onAddImage={() => handleInsertBlock('image', index + 1)}
                        />
                      </div>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Renders the update content page view component.
// Returns the JSX element hierarchy for the page view.
export default function UpdateContentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#111] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#ffc032] animate-spin" />
        </div>
      }
    >
      <UpdateContentContent />
    </Suspense>
  );
}

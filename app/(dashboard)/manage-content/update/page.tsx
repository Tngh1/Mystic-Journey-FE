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
import { showConfirmAlert, showErrorAlert } from '@/lib/utils/swal';
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    handleFileSelect(e.dataTransfer.files);
  };

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
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="flex items-center px-2 bg-[#111111] border-r border-purple-500/30 cursor-grab active:cursor-grabbing hover:bg-[#252525]"
        >
          <GripVertical className="w-4 h-4 text-purple-400/50" />
        </div>

        <div className="flex-1 p-4 space-y-3">
          {/* Header with delete button */}
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs font-medium">
              <ImageIcon className="w-3 h-3 inline mr-1" />
              Image
            </span>
            <div className="flex-1" />
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
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
                if (result.isConfirmed) {
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

          {/* Image Upload Area */}
          {!block.mediaUrl ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsDraggingFile(false); }}
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

          {/* Caption */}
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


// ── InsertZone ─────────────────────────────────────────────────────────────
// Thin separator between blocks that reveals Text / Image insert buttons on hover.
function InsertZone({
  onAddText,
  onAddImage,
}: {
  onAddText: () => void;
  onAddImage: () => void;
}) {
  const [hovered, setHovered] = useState(false);
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

function UpdateContentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentId = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<ContentDetailResponse | null>(null);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  // Single ordered list of all blocks (existing + newly added)
  const [allBlocks, setAllBlocks] = useState<LocalBlock[]>([]);
  // IDs of existing blocks queued for deletion — sent to API on Save Changes
  const [deletedBlockIds, setDeletedBlockIds] = useState<number[]>([]);
  // Original thumbnail URL for cleanup
  const [originalThumbnailUrl, setOriginalThumbnailUrl] = useState<string>("");

  const editorContentGetters = useRef<Map<string, () => string>>(new Map());

  // Stable random id generator that won't collide on rapid clicks.
  // crypto.randomUUID() is available in modern browsers and Next.js client.
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

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [contentData, categoriesData] = await Promise.all([
        getById(Number(contentId)),
        getCategories(),
      ]);
      setContent(contentData);
      setCategories(categoriesData.filter((c: CategoryResponse) => c.isActive));
      // Load existing blocks — all treated as non-new, clean
      setAllBlocks((contentData.blocks || [])
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(b => ({ ...b, isDirty: false, isNew: false })));
      // Save original thumbnail URL for cleanup
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

  useEffect(() => {
    if (contentId) {
      void Promise.resolve().then(fetchData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentId]);

  // Stable key for a block: string tempId for new blocks, numeric blockContentId for existing ones
  const getBlockKey = (b: LocalBlock): string => String(b.tempId ?? b.blockContentId);

  const collectEditorContent = () =>
    allBlocks.map(b => {
      const key = getBlockKey(b);
      const getContent = editorContentGetters.current.get(key);
      if (getContent) return { ...b, contentData: getContent(), isDirty: true };
      return b;
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    setError(null);

    const updatedBlocks = collectEditorContent();

    // Validation: image blocks must have a mediaUrl or mediaFile
    const invalidImageBlock = updatedBlocks.find(
      (b) => b.blockType === 'image' && !b.mediaUrl?.trim() && !b.mediaFile
    );
    if (invalidImageBlock) {
      setError('All image blocks must contain an image');
      return;
    }

    // Validation: text blocks must have non-empty visible content
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

      // 1. Update main content info
      await update(content.contentId, {
        title: formData.title,
        summary: formData.summary,
        thumbnailUrl: thumbnailUrl,
        categoryId: formData.categoryId,
        isPublished: formData.isPublished,
      });

      // 2. Delete queued blocks
      await Promise.all(deletedBlockIds.map((id) => removeBlock(id)));

      // 3. Reorder existing blocks by sortOrder, then write all changes
      //    in parallel: existing blocks (all, since reorder may have shifted
      //    positions) and new blocks.  One failure doesn't block the others.
      const updateOps = finalBlocks
        .map((b, i) => ({ ...b, sortOrder: i + 1 }))
        .filter((b) => !b.isNew)
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
        .filter(({ b }) => b.isNew)
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

      const allResults = await Promise.allSettled([...updateOps, ...createOps]);
      const failed = allResults.filter((r) => r.status === 'rejected');
      if (failed.length > 0) {
        const firstReason = (failed[0] as PromiseRejectedResult).reason;
        const message =
          firstReason instanceof Error
            ? firstReason.message
            : `${failed.length} block operation(s) failed. Some changes may not have been saved — please review and try again.`;
        throw new Error(message);
      }

      router.push('/manage-content');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update content';
      setError(message);
      if (/category is inactive/i.test(message)) {
        await showErrorAlert('Cannot Publish Content', message);
      }
    } finally {
      setSubmitting(false);
    }
  };

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
      await showErrorAlert('Cannot Publish Content', message);
    } finally {
      setPublishing(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string | number | boolean | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegisterEditor = useCallback((id: string, getContent: () => string) => {
    editorContentGetters.current.set(id, getContent);
  }, []);

  const handleUnregisterEditor = useCallback((id: string) => {
    editorContentGetters.current.delete(id);
  }, []);

  // Insert a new block at a specific index in the list
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

  // Top-level buttons append to the end
  const handleAddText = () => handleInsertBlock('text', allBlocks.length);
  const handleAddImage = () => handleInsertBlock('image', allBlocks.length);

  const handleUpdateBlock = (id: string, updates: Partial<LocalBlock>) => {
    setAllBlocks(prev => prev.map(b => {
      if (getBlockKey(b) === id) {
        return { ...b, ...updates, ...(!b.isNew && { isDirty: true }) };
      }
      return b;
    }));
  };

  const handleDeleteBlock = (id: string) => {
    const block = allBlocks.find(b => getBlockKey(b) === id);
    setAllBlocks(prev => prev.filter(b => getBlockKey(b) !== id));
    if (block && !block.isNew) {
      setDeletedBlockIds(prev => [...prev, block.blockContentId]);
      editorContentGetters.current.delete(String(block.blockContentId));
    } else if (block?.tempId) {
      editorContentGetters.current.delete(block.tempId);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && String(active.id) !== String(over.id)) {
      setAllBlocks(items => {
        const oldIndex = items.findIndex(item => getBlockKey(item) === String(active.id));
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
        {/* Header */}
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
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
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

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Content Info */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-[#111111] rounded-lg p-6">
              {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <h2 className="text-lg font-semibold text-white mb-4">Content Info</h2>

              {/* Title */}
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

              {/* Summary */}
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

              {/* Thumbnail */}
              <div className="mb-4">
                <ImageUploader
                  value={formData.thumbnailUrl}
                  onChange={(url) => handleChange('thumbnailUrl', url)}
                  label="Thumbnail"
                />
              </div>

              {/* Category */}
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
                    {categories.map((cat) => (
                      <option key={cat.categoryContentId} value={cat.categoryContentId}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

            </div>

            {/* Actions */}
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

          {/* Right: Block Content */}
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

            {/* Block List */}
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
                    {/* Insert zone before the first block */}
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
                        {/* Insert zone after each block */}
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

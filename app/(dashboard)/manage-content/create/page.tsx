'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
  Trash2,
  GripVertical,
  Image as ImageIcon,
  Type,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Upload,
  X,
  Quote,
  Plus,
} from 'lucide-react';
import { create, getCategories, createBlock, CategoryResponse, ContentResponse } from '@/lib/api/content';
import { uploadImageToCloudinary } from '@/lib/api/cloudinary';

interface FormData {
  title: string;
  summary: string;
  thumbnailUrl: string;
  categoryId: number;
  isPublished: boolean;
}

interface LocalBlock {
  tempId: string;
  title: string;
  contentData: string;
  mediaUrl: string;
  caption: string;
  blockType: 'text' | 'image';
  sortOrder: number;
  isActive: boolean;
}

interface EditableBlockProps {
  block: LocalBlock;
  onUpdate: (tempId: string, updates: Partial<LocalBlock>) => void;
  onDelete: (tempId: string) => void;
  onRegisterEditor?: (id: string, getContent: () => string) => void;
}

function EditableTextBlock({ block, onUpdate, onDelete, onRegisterEditor }: EditableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.tempId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  const editorRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);

  const stripDirectionStyles = useCallback((html: string): string => {
    if (!html) return '';
    return html
      .replace(/dir="[^"]*"/gi, '')
      .replace(/style="[^"]*direction\s*:[^;]*;?/gi, '')
      .replace(/style="[^"]*text-align\s*:[^;]*;?/gi, '')
      .replace(/style=""/gi, '')
      .replace(/\s+style=""/g, '');
  }, []);

  const fixEditorDirection = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.style.direction = 'ltr';
      editorRef.current.style.textAlign = 'left';
    }
  }, []);

  useEffect(() => {
    fixEditorDirection();
  }, [fixEditorDirection]);

  const initializeEditor = useCallback(() => {
    if (editorRef.current && !isInitializedRef.current) {
      editorRef.current.innerHTML = block.contentData || '';
      isInitializedRef.current = true;
      fixEditorDirection();
    }
  }, [block.contentData, fixEditorDirection]);

  useEffect(() => {
    initializeEditor();
  }, [initializeEditor]);

  useEffect(() => {
    if (onRegisterEditor && editorRef.current) {
      const getContent = () => {
        if (editorRef.current) {
          return stripDirectionStyles(editorRef.current.innerHTML);
        }
        return block.contentData || '';
      };
      onRegisterEditor(block.tempId, getContent);
    }
  }, [block.tempId, onRegisterEditor, block.contentData, stripDirectionStyles]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(block.tempId, { title: e.target.value });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-[#222] border border-blue-500/50 rounded-lg overflow-hidden"
    >
      <div className="flex items-stretch">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="flex items-center px-2 bg-[#1a1a1a] border-r border-blue-500/30 cursor-grab active:cursor-grabbing hover:bg-[#252525]"
        >
          <GripVertical className="w-4 h-4 text-blue-400/50" />
        </div>

        <div className="flex-1 p-4 space-y-3">
          {/* Header with title and delete */}
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
              <Type className="w-3 h-3 inline mr-1" />
              Text
            </span>
            <input
              type="text"
              value={block.title}
              onChange={handleTitleChange}
              placeholder="Block title"
              className="flex-1 px-3 py-1.5 bg-[#1a1a1a] border border-[#333] rounded text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => onDelete(block.tempId)}
              className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
              title="Delete"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Inline Toolbar */}
          <div className="flex flex-wrap items-center gap-1 p-2 border border-[#333] rounded-lg bg-[#1a1a1a]">
            <button
              type="button"
              onClick={() => execCommand('undo')}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-[#333] rounded transition-colors"
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => execCommand('redo')}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-[#333] rounded transition-colors"
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-gray-700 mx-1" />

            <button
              type="button"
              onClick={() => execCommand('bold')}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-[#333] rounded transition-colors font-bold"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => execCommand('italic')}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-[#333] rounded transition-colors italic"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => execCommand('underline')}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-[#333] rounded transition-colors underline"
              title="Underline"
            >
              <Underline className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => execCommand('strikeThrough')}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-[#333] rounded transition-colors line-through"
              title="Strikethrough"
            >
              <Strikethrough className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-gray-700 mx-1" />

            <button
              type="button"
              onClick={() => execCommand('formatBlock', 'h1')}
              className="px-2 py-1 text-gray-400 hover:text-white hover:bg-[#333] rounded transition-colors text-xs font-bold"
              title="Heading 1"
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => execCommand('formatBlock', 'h2')}
              className="px-2 py-1 text-gray-400 hover:text-white hover:bg-[#333] rounded transition-colors text-xs font-bold"
              title="Heading 2"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => execCommand('formatBlock', 'h3')}
              className="px-2 py-1 text-gray-400 hover:text-white hover:bg-[#333] rounded transition-colors text-xs font-bold"
              title="Heading 3"
            >
              H3
            </button>

            <div className="w-px h-5 bg-gray-700 mx-1" />

            <button
              type="button"
              onClick={() => execCommand('justifyLeft')}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-[#333] rounded transition-colors"
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => execCommand('justifyCenter')}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-[#333] rounded transition-colors"
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => execCommand('justifyRight')}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-[#333] rounded transition-colors"
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-gray-700 mx-1" />

            <button
              type="button"
              onClick={() => execCommand('insertUnorderedList')}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-[#333] rounded transition-colors"
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => execCommand('insertOrderedList')}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-[#333] rounded transition-colors"
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>

          {/* Editor Area */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            style={{ direction: 'ltr', textAlign: 'left' }}
            className="min-h-[100px] p-4 bg-[#1a1a1a] border border-[#333] rounded-lg text-white outline-none focus:border-blue-500 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-500"
            data-placeholder="Nhập nội dung đoạn văn..."
          />
        </div>
      </div>
    </div>
  );
}

function EditableImageBlock({ block, onUpdate, onDelete }: EditableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.tempId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      const result = await uploadImageToCloudinary(file);
      onUpdate(block.tempId, { mediaUrl: result.secureUrl });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    await handleFileSelect(e.dataTransfer.files);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(block.tempId, { title: e.target.value });
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(block.tempId, { caption: e.target.value });
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
          className="flex items-center px-2 bg-[#1a1a1a] border-r border-purple-500/30 cursor-grab active:cursor-grabbing hover:bg-[#252525]"
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
              onClick={() => onDelete(block.tempId)}
              className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
              title="Delete"
            >
              <X className="w-4 h-4" />
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
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                  <p className="text-gray-400 text-sm">Uploading...</p>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Drag & drop or click to upload</p>
                </>
              )}
            </div>
          ) : (
            <div className="relative">
              <img src={block.mediaUrl} alt="Preview" className="w-full max-h-48 object-contain rounded-lg bg-[#111]" />
              <button
                type="button"
                onClick={() => onUpdate(block.tempId, { mediaUrl: '' })}
                className="absolute top-2 right-2 p-1.5 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Caption */}
          <input
            type="text"
            value={block.caption}
            onChange={handleCaptionChange}
            placeholder="Image caption (optional)"
            className="w-full px-3 py-1.5 bg-[#1a1a1a] border border-[#333] rounded text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>
    </div>
  );
}

interface ThumbnailUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

function ThumbnailUploader({ value, onChange }: ThumbnailUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      const result = await uploadImageToCloudinary(file);
      onChange(result.secureUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    await handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Thumbnail
      </label>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-2 rounded-lg text-sm mb-2">
          {error}
        </div>
      )}

      {!value ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => handleFileSelect((e.target as HTMLInputElement).files);
            input.click();
          }}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-[#ffc032] bg-[#ffc032]/10'
              : 'border-gray-600 hover:border-gray-500'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 text-[#ffc032] animate-spin" />
              <p className="text-gray-400 text-sm">Uploading...</p>
            </div>
          ) : (
            <>
              <ImageIcon className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Click or drag image here</p>
            </>
          )}
        </div>
      ) : (
        <div className="relative">
          <img src={value} alt="Thumbnail" className="w-full h-40 object-cover rounded-lg bg-[#111]" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1.5 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
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
              className="flex items-center gap-1 px-2.5 py-0.5 text-xs bg-blue-500/20 text-blue-400 border border-blue-500/40 rounded-full hover:bg-blue-500/30 transition-colors font-medium whitespace-nowrap"
            >
              <Type className="w-3 h-3" /> Text
            </button>
            <button
              type="button"
              onClick={onAddImage}
              className="flex items-center gap-1 px-2.5 py-0.5 text-xs bg-purple-500/20 text-purple-400 border border-purple-500/40 rounded-full hover:bg-purple-500/30 transition-colors font-medium whitespace-nowrap"
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

export default function CreateContentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [blocks, setBlocks] = useState<LocalBlock[]>([]);

  // Map to store getContent functions from editor children
  const editorContentGetters = useRef<Map<string, () => string>>(new Map());

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [formData, setFormData] = useState<FormData>({
    title: '',
    summary: '',
    thumbnailUrl: '',
    categoryId: 0,
    isPublished: false,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setFetchingCategories(true);
      const data = await getCategories();
      setCategories(data.filter((c) => c.isActive));
      if (data.length > 0) {
        setFormData((prev) => ({ ...prev, categoryId: data[0].categoryContentId }));
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setFetchingCategories(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.categoryId) {
      setError('Category is required');
      return;
    }

    try {
      setLoading(true);

      // 1. Collect latest text content from all editors
      const updatedBlocks = blocks.map(b => {
        const getContent = editorContentGetters.current.get(b.tempId);
        if (getContent) {
          return { ...b, contentData: getContent() };
        }
        return b;
      });

      // 2. Create the content first
      const content: ContentResponse = await create({
        title: formData.title,
        summary: formData.summary,
        thumbnailUrl: formData.thumbnailUrl || undefined,
        categoryId: formData.categoryId,
        isPublished: formData.isPublished,
      });

      // 3. Create all blocks after content is created
      for (let i = 0; i < updatedBlocks.length; i++) {
        const block = updatedBlocks[i];
        await createBlock({
          title: block.title,
          contentId: content.contentId,
          contentData: block.contentData || undefined,
          mediaUrl: block.mediaUrl || undefined,
          caption: block.caption || undefined,
          blockType: block.blockType,
          sortOrder: i + 1,
          isActive: block.isActive,
        });
      }

      router.push('/manage-content');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create content');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegisterEditor = useCallback((id: string, getContent: () => string) => {
    editorContentGetters.current.set(id, getContent);
  }, []);

  const handleInsertBlock = (type: 'text' | 'image', insertAtIndex: number) => {
    const newBlock: LocalBlock = {
      tempId: `temp-${Date.now()}`,
      title: type === 'text' ? 'New Text Block' : 'New Image Block',
      contentData: '',
      mediaUrl: '',
      caption: '',
      blockType: type,
      sortOrder: insertAtIndex + 1,
      isActive: true,
    };
    setBlocks((prev) => [
      ...prev.slice(0, insertAtIndex),
      newBlock,
      ...prev.slice(insertAtIndex),
    ]);
  };

  // Top-level buttons always append to the end
  const handleAddText = () => handleInsertBlock('text', blocks.length);
  const handleAddImage = () => handleInsertBlock('image', blocks.length);

  const handleUpdateBlock = (tempId: string, updates: Partial<LocalBlock>) => {
    setBlocks((prev) =>
      prev.map((b) => (b.tempId === tempId ? { ...b, ...updates } : b))
    );
  };

  const handleDeleteBlock = (tempId: string) => {
    setBlocks((prev) => prev.filter((b) => b.tempId !== tempId));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((item) => item.tempId === active.id);
        const newIndex = items.findIndex((item) => item.tempId === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#111] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/manage-content"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Content
          </Link>
          <h1 className="text-3xl font-bold text-white">Create New Content</h1>
          <p className="text-gray-400 mt-1">Add content info and blocks</p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Content Info */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-[#1a1a1a] rounded-lg p-6">
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
                  placeholder="Enter content title"
                  className="w-full px-4 py-2 bg-[#222] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#ffc032]"
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
                  placeholder="Brief description of the content"
                  rows={3}
                  className="w-full px-4 py-2 bg-[#222] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#ffc032] resize-none"
                />
              </div>

              {/* Thumbnail */}
              <div className="mb-4">
                <ThumbnailUploader
                  value={formData.thumbnailUrl}
                  onChange={(url) => handleChange('thumbnailUrl', url)}
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
                    {categories.length === 0 && <option value={0}>No categories available</option>}
                    {categories.map((cat) => (
                      <option key={cat.categoryContentId} value={cat.categoryContentId}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Checkboxes */}
              <div className="mb-6 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => handleChange('isPublished', e.target.checked)}
                    className="w-5 h-5 rounded border-[#333] bg-[#222] text-[#ffc032] focus:ring-[#ffc032] focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-300">Publish immediately</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-[#1a1a1a] rounded-lg p-6">
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={loading || fetchingCategories}
                  className="flex items-center gap-2 px-6 py-2 bg-[#ffc032] text-[#111] rounded-lg font-semibold hover:bg-[#e6ae2c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Content'
                  )}
                </button>
                <Link
                  href="/manage-content"
                  className="px-6 py-2 bg-[#333] text-white rounded-lg font-semibold hover:bg-[#444] transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </form>

          {/* Right: Block Content */}
          <div className="bg-[#1a1a1a] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Block Contents</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddText}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg font-medium hover:bg-blue-500/30 transition-colors text-sm"
                >
                  <Type className="w-4 h-4" />
                  Add Text
                </button>
                <button
                  onClick={handleAddImage}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg font-medium hover:bg-purple-500/30 transition-colors text-sm"
                >
                  <ImageIcon className="w-4 h-4" />
                  Add Image
                </button>
              </div>
            </div>

            {/* Block List */}
            {blocks.length === 0 ? (
              <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-700 rounded-lg">
                <Quote className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                <p>No blocks added yet.</p>
                <p className="text-sm mt-1">Click "Add Text" or "Add Image" to create content blocks.</p>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={blocks.map((b) => b.tempId)} strategy={verticalListSortingStrategy}>
                  <div>
                    {/* Insert zone before the first block */}
                    <InsertZone
                      onAddText={() => handleInsertBlock('text', 0)}
                      onAddImage={() => handleInsertBlock('image', 0)}
                    />
                    {blocks.map((block, index) => (
                      <div key={block.tempId}>
                        {block.blockType === 'text' ? (
                          <EditableTextBlock
                            block={block}
                            onUpdate={handleUpdateBlock}
                            onDelete={handleDeleteBlock}
                            onRegisterEditor={handleRegisterEditor}
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

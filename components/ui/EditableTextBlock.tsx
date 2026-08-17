'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { showConfirmAlert } from '@/lib/utils/swal';
import {
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
  X,
  GripVertical,
  Palette,
} from 'lucide-react';

export interface EditableTextBlockProps {
  id: string;
  contentData: string;
  onDelete: (id: string) => void;
  onRegisterEditor?: (id: string, getContent: () => string) => void;
  onUnregisterEditor?: (id: string) => void;
}

const BLOCK_TAGS = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'BLOCKQUOTE', 'PRE', 'LI']);
const ALIGNMENT_BLOCK_TAGS = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'LI', 'DIV']);

// Renders the editable text block reusable UI component.
// Features: applies customizable style variants and responsive CSS classes; binds user interaction event listeners.
// Returns the styled JSX element.
export default function EditableTextBlock({
  id,
  contentData,
  onDelete,
  onRegisterEditor,
  onUnregisterEditor,
}: EditableTextBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  // Helper function executing style.
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  const editorRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);

  const [activeStates, setActiveStates] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    block: '',
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
    unorderedList: false,
    orderedList: false,
  });

  const [showColorPicker, setShowColorPicker] = useState(false);  // Initialize boolean flag as inactive
  const [showFontSize, setShowFontSize] = useState(false);  // Initialize boolean flag as inactive
  const [selectedColor, setSelectedColor] = useState('#ffffff');

  const FONT_SIZES = [
    { label: 'S', value: '2', title: 'Small' },
    { label: 'M', value: '4', title: 'Medium' },
    { label: 'L', value: '6', title: 'Large' },
    { label: 'XL', value: '8', title: 'Extra Large' },
  ];

  const COLOR_PRESETS = [
    '#ffffff', '#f87171', '#fb923c', '#fbbf24',
    '#4ade80', '#34d399', '#22d3ee', '#60a5fa',
    '#a78bfa', '#f472b6', '#e5e5e5', '#737373',
  ];

  // Helper function executing toggle color.
  // Processes input parameters and returns the calculated result.
  const toggleColor = (color: string) => {
    document.execCommand('foreColor', false, color);
    setSelectedColor(color);
    setShowColorPicker(false);
    requestAnimationFrame(updateActiveStates);
  };

  // Helper function executing strip direction styles.
  // Processes input parameters and returns the calculated result.
  const stripDirectionStyles = useCallback((html: string): string => {
    if (!html) return '';
    return html
      .replace(/dir="[^"]*"/gi, '')
      .replace(/style="[^"]*direction\s*:[^;]*;?/gi, '')
      .replace(/style="[^"]*text-align\s*:[^;]*;?/gi, '')
      .replace(/style=""/gi, '')
      .replace(/\s+style=""/g, '');
  }, []);

  // Helper function executing fix editor direction.
  const fixEditorDirection = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.style.direction = 'ltr';
      editorRef.current.style.textAlign = 'left';
    }
  }, []);

  // Synchronize the derived component state whenever this effect's dependency values change.
  useEffect(() => {
    fixEditorDirection();
  }, [fixEditorDirection]);

  // Helper function executing initialize editor.
  const initializeEditor = useCallback(() => {
    if (editorRef.current && !isInitializedRef.current) {
      editorRef.current.innerHTML = contentData || '';
      isInitializedRef.current = true;
      fixEditorDirection();
    }
  }, [contentData, fixEditorDirection]);

  // Synchronize the derived component state whenever this effect's dependency values change.
  useEffect(() => {
    initializeEditor();
  }, [initializeEditor]);

  // Synchronize the derived component state whenever this effect's dependency values change.
  useEffect(() => {
    if (onRegisterEditor && editorRef.current) {
      // Helper function executing get content.
      // Processes input parameters and returns the calculated result.
      const getContent = () => {
        if (editorRef.current) {
          return stripDirectionStyles(editorRef.current.innerHTML);
        }
        return contentData || '';
      };
      onRegisterEditor(id, getContent);
    }
    return () => {
      onUnregisterEditor?.(id);
    };
  }, [id, onRegisterEditor, onUnregisterEditor, stripDirectionStyles]); // eslint-disable-line react-hooks/exhaustive-deps

  // Helper function executing get current block tag.
  // Processes input parameters and returns the calculated result.
  const getCurrentBlockTag = useCallback((): string => {
    const editor = editorRef.current;
    if (!editor) return '';
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return '';
    let node: Node | null = sel.anchorNode;
    if (!node) return '';
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentElement;
    }
    while (node && node !== editor) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        if (editor.contains(el) && BLOCK_TAGS.has(el.tagName)) {
          return el.tagName.toLowerCase();
        }
      }
      node = node.parentNode;
    }
    return '';
  }, []);

  // Helper function executing is command active.
  // Processes input parameters and returns the calculated result.
  const isCommandActive = useCallback((command: string): boolean => {
    const editor = editorRef.current;
    if (!editor) return false;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return false;

    const node: Node | null = sel.anchorNode;
    if (!node || !editor.contains(node)) return false;

    if (command === 'justifyLeft' || command === 'justifyCenter' || command === 'justifyRight') {
      let blockNode: Node | null = sel.anchorNode;
      if (blockNode && blockNode.nodeType === Node.TEXT_NODE) {
        blockNode = blockNode.parentElement;
      }
      while (blockNode && blockNode !== editor) {
        if (blockNode.nodeType === Node.ELEMENT_NODE) {
          const el = blockNode as HTMLElement;
          if (ALIGNMENT_BLOCK_TAGS.has(el.tagName) && editor.contains(el)) {
            const textAlign = window.getComputedStyle(el).textAlign;
            if (command === 'justifyLeft') return textAlign === 'left' || textAlign === 'start';
            if (command === 'justifyCenter') return textAlign === 'center';
            if (command === 'justifyRight') return textAlign === 'right' || textAlign === 'end';
            return false;
          }
        }
        blockNode = blockNode.parentNode;
      }
      return false;
    }

    if (command === 'insertUnorderedList' || command === 'insertOrderedList') {
      let listNode: Node | null = sel.anchorNode;
      if (listNode && listNode.nodeType === Node.TEXT_NODE) {
        listNode = listNode.parentElement;
      }
      while (listNode && listNode !== editor) {
        if (listNode.nodeType === Node.ELEMENT_NODE) {
          const el = listNode as HTMLElement;
          if (el.tagName === 'LI') {
            const parent = el.parentElement;
            if (parent) {
              if (command === 'insertUnorderedList' && parent.tagName === 'UL') return true;
              if (command === 'insertOrderedList' && parent.tagName === 'OL') return true;
            }
            return false;
          }
        }
        listNode = listNode.parentNode;
      }
      return false;
    }

    const tagMap: Record<string, string[]> = {
      bold: ['B', 'STRONG'],
      italic: ['I', 'EM'],
      underline: ['U'],
      strikeThrough: ['S', 'STRIKE', 'DEL'],
    };
    const targetTags = tagMap[command] || [];
    if (targetTags.length === 0) return false;

    let checkNode: Node | null = sel.anchorNode;
    if (checkNode && checkNode.nodeType === Node.TEXT_NODE) {
      checkNode = checkNode.parentElement;
    }

    if (checkNode && checkNode.nodeType === Node.ELEMENT_NODE) {
      const el = checkNode as HTMLElement;
      if (targetTags.includes(el.tagName)) return true;
      for (const tag of targetTags) {
        if (el.querySelector(tag.toLowerCase())) return true;
      }
    }

    while (checkNode && checkNode !== editor) {
      if (checkNode.nodeType === Node.ELEMENT_NODE) {
        const el = checkNode as HTMLElement;
        if (targetTags.includes(el.tagName)) return true;
      }
      checkNode = checkNode.parentNode;
    }

    return false;
  }, []);

  // Helper function executing update active states.
  // Processes input parameters and returns the calculated result.
  const updateActiveStates = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
      setActiveStates((prev) => (Object.values(prev).some(Boolean) ? {
        bold: false, italic: false, underline: false, strikeThrough: false,
        block: '', justifyLeft: false, justifyCenter: false, justifyRight: false,
        unorderedList: false, orderedList: false,
      } : prev));
      return;
    }
    const range = sel.getRangeAt(0);
    if (!editor.contains(range.commonAncestorContainer)) {
      return;
    }

    try {
      const block = getCurrentBlockTag();
      setActiveStates({
        bold: isCommandActive('bold'),
        italic: isCommandActive('italic'),
        underline: isCommandActive('underline'),
        strikeThrough: isCommandActive('strikeThrough'),
        block,
        justifyLeft: isCommandActive('justifyLeft'),
        justifyCenter: isCommandActive('justifyCenter'),
        justifyRight: isCommandActive('justifyRight'),
        unorderedList: isCommandActive('insertUnorderedList'),
        orderedList: isCommandActive('insertOrderedList'),
      });
    } catch {
    }
  }, [getCurrentBlockTag, isCommandActive]);

  // Subscribe the required browser or runtime event handlers when dependencies change and remove the same handlers during cleanup.
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    // Helper function executing schedule update.
    // Processes input parameters and returns the calculated result.
    const scheduleUpdate = () => requestAnimationFrame(updateActiveStates);

    document.addEventListener('selectionchange', scheduleUpdate);
    editor.addEventListener('keyup', scheduleUpdate);
    editor.addEventListener('mouseup', scheduleUpdate);
    editor.addEventListener('click', scheduleUpdate);
    editor.addEventListener('focus', scheduleUpdate);
    editor.addEventListener('input', scheduleUpdate);

    return () => {
      document.removeEventListener('selectionchange', scheduleUpdate);
      editor.removeEventListener('keyup', scheduleUpdate);
      editor.removeEventListener('mouseup', scheduleUpdate);
      editor.removeEventListener('click', scheduleUpdate);
      editor.removeEventListener('focus', scheduleUpdate);
      editor.removeEventListener('input', scheduleUpdate);
    };
  }, [updateActiveStates]);

  // Subscribe the required browser or runtime event handlers when dependencies change and remove the same handlers during cleanup.
  useEffect(() => {
    // Event handler for handle click outside.
    const handleClickOutside = () => {
      setShowColorPicker(false);
      setShowFontSize(false);
    };
    if (showColorPicker || showFontSize) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showColorPicker, showFontSize]);

  // Helper function executing exec command.
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    requestAnimationFrame(updateActiveStates);
  };

  // Helper function executing toggle block.
  // Processes input parameters and returns the calculated result.
  const toggleBlock = (tag: 'h1' | 'h2' | 'h3' | 'p') => {
    const current = getCurrentBlockTag();
    const next = current === tag ? 'p' : tag;
    document.execCommand('formatBlock', false, next);
    requestAnimationFrame(updateActiveStates);
  };

  const btnBase = 'p-1.5 rounded transition-colors cursor-pointer';
  const btnIdle = 'text-gray-400 hover:text-white hover:bg-[#333]';
  const btnActive = 'text-white bg-blue-500/30 hover:bg-blue-500/40';

  // Helper function executing toolbar btn class.
  const toolbarBtnClass = (isActive: boolean, extra = '') =>
    `${btnBase} ${isActive ? btnActive : btnIdle} ${extra}`;

  // Helper function executing h btn class.
  const hBtnClass = (tag: string, extra = '') =>
    `px-2 py-1 text-xs font-bold rounded transition-colors ${
      activeStates.block === tag
        ? 'text-white bg-blue-500/30 hover:bg-blue-500/40'
        : 'text-gray-400 hover:text-white hover:bg-[#333]'
    } ${extra}`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-[#222] border border-blue-500/50 rounded-lg overflow-hidden"
    >
      <div className="flex items-stretch">
        <div
          {...attributes}
          {...listeners}
          className="flex items-center px-2 bg-[#111111] border-r border-blue-500/30 cursor-grab active:cursor-grabbing hover:bg-[#252525]"
        >
          <GripVertical className="w-4 h-4 text-blue-400/50" />
        </div>

        <div className="flex-1 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
              <Type className="w-3 h-3 inline mr-1" />
              Text
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
                  onDelete(id);
                }
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 border border-red-500/30 rounded transition-colors cursor-pointer"
              title="Delete this block"
            >
              <X className="w-3.5 h-3.5" />
              Delete Block
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1 p-2 border border-[#333] rounded-lg bg-[#111111]">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}  // Prevent default HTML form submission and page reload
              onClick={() => execCommand('undo')}
              className={toolbarBtnClass(false)}
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}  // Prevent default HTML form submission and page reload
              onClick={() => execCommand('redo')}
              className={toolbarBtnClass(false)}
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-gray-700 mx-1" />

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}  // Prevent default HTML form submission and page reload
              onClick={() => execCommand('bold')}
              className={toolbarBtnClass(activeStates.bold, 'font-bold')}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}  // Prevent default HTML form submission and page reload
              onClick={() => execCommand('italic')}
              className={toolbarBtnClass(activeStates.italic, 'italic')}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}  // Prevent default HTML form submission and page reload
              onClick={() => execCommand('underline')}
              className={toolbarBtnClass(activeStates.underline, 'underline')}
              title="Underline"
            >
              <Underline className="w-4 h-4" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}  // Prevent default HTML form submission and page reload
              onClick={() => execCommand('strikeThrough')}
              className={toolbarBtnClass(activeStates.strikeThrough, 'line-through')}
              title="Strikethrough"
            >
              <Strikethrough className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-gray-700 mx-1" />

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}  // Prevent default HTML form submission and page reload
              onClick={() => toggleBlock('h1')}
              className={hBtnClass('h1')}
              title="Heading 1"
            >
              H1
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}  // Prevent default HTML form submission and page reload
              onClick={() => toggleBlock('h2')}
              className={hBtnClass('h2')}
              title="Heading 2"
            >
              H2
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}  // Prevent default HTML form submission and page reload
              onClick={() => toggleBlock('h3')}
              className={hBtnClass('h3')}
              title="Heading 3"
            >
              H3
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}  // Prevent default HTML form submission and page reload
              onClick={() => toggleBlock('p')}
              className={hBtnClass('p')}
              title="Paragraph"
            >
              P
            </button>

            <div className="w-px h-5 bg-gray-700 mx-1" />

            <div className="relative">
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); setShowFontSize((v) => !v); setShowColorPicker(false); }}  // Prevent default HTML form submission and page reload
                className={toolbarBtnClass(showFontSize)}
                title="Font Size"
              >
                <Type className="w-4 h-4" />
              </button>
              {showFontSize && (
                <div className="absolute top-full left-0 mt-1 bg-[#111111] border border-[#333] rounded-lg shadow-lg z-50 py-1 min-w-[60px]">
                  {FONT_SIZES.map((size) => (
                    <button
                      key={size.value}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}  // Prevent default HTML form submission and page reload
                      onClick={() => {
                        execCommand('fontSize', size.value);
                        setShowFontSize(false);
                      }}
                      className="w-full px-3 py-1 text-xs text-gray-300 hover:bg-[#333] hover:text-white text-left"
                      title={size.title}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); setShowColorPicker((v) => !v); setShowFontSize(false); }}  // Prevent default HTML form submission and page reload
                className={`${toolbarBtnClass(showColorPicker)} flex items-center gap-1`}
                title="Text Color"
              >
                <Palette className="w-4 h-4" />
                <span
                  className="w-4 h-4 rounded border border-gray-600"
                  style={{ backgroundColor: selectedColor }}
                />
              </button>
              {showColorPicker && (
                <div className="absolute top-full left-0 mt-1 bg-[#111111] border border-[#333] rounded-lg shadow-lg z-50 p-2 grid grid-cols-4 gap-1">
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}  // Prevent default HTML form submission and page reload
                      onClick={() => toggleColor(color)}
                      className="w-6 h-6 rounded border border-gray-600 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                  <div className="col-span-4 mt-1">
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => toggleColor(e.target.value)}
                      className="w-full h-7 rounded cursor-pointer border border-[#333]"
                      title="Custom color"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="w-px h-5 bg-gray-700 mx-1" />

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}  // Prevent default HTML form submission and page reload
              onClick={() => execCommand('justifyLeft')}
              className={toolbarBtnClass(activeStates.justifyLeft)}
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}  // Prevent default HTML form submission and page reload
              onClick={() => execCommand('justifyCenter')}
              className={toolbarBtnClass(activeStates.justifyCenter)}
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}  // Prevent default HTML form submission and page reload
              onClick={() => execCommand('justifyRight')}
              className={toolbarBtnClass(activeStates.justifyRight)}
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-gray-700 mx-1" />

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}  // Prevent default HTML form submission and page reload
              onClick={() => execCommand('insertUnorderedList')}
              className={toolbarBtnClass(activeStates.unorderedList)}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}  // Prevent default HTML form submission and page reload
              onClick={() => execCommand('insertOrderedList')}
              className={toolbarBtnClass(activeStates.orderedList)}
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>

          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            style={{ direction: 'ltr', textAlign: 'left' }}
            className="rendered-html min-h-[100px] p-4 bg-[#111111] border border-[#333] rounded-lg text-white outline-none focus:border-blue-500 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-500 [&_h1]:!border-0 [&_h1]:!border-none [&_h1]:!border-l-0 [&_h2]:!border-0 [&_h2]:!border-none [&_h2]:!border-l-0 [&_h3]:!border-0 [&_h3]:!border-none [&_h3]:!border-l-0 [&_h4]:!border-0 [&_h4]:!border-none [&_h4]:!border-l-0 [&_h5]:!border-0 [&_h5]:!border-none [&_h5]:!border-l-0 [&_h6]:!border-0 [&_h6]:!border-none [&_h6]:!border-l-0 [&_h1]:!pl-0 [&_h2]:!pl-0 [&_h3]:!pl-0 [&_p]:!border-0 [&_p]:!border-none [&_p]:!border-l-0 [&_p]:!pl-0"
            data-placeholder="Nhập nội dung đoạn văn..."
          />
        </div>
      </div>
    </div>
  );
}

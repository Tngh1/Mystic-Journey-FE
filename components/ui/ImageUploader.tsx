import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';

interface ImageUploaderProps {
  value: string | File | null;
  onChange: (value: string | File | null) => void;
  label?: string;
  className?: string;
}

export default function ImageUploader({ value, onChange, label, className = "" }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Generate object URL for File values to display as preview
  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;
    let nextPreviewUrl: string | null = null;

    if (value instanceof File) {
      objectUrl = URL.createObjectURL(value);
      nextPreviewUrl = objectUrl;
    } else if (typeof value === 'string') {
      nextPreviewUrl = value;
    }

    void Promise.resolve().then(() => {
      if (!cancelled) {
        setPreviewUrl(nextPreviewUrl);
      }
    });

    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [value]);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setError(null);
    onChange(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-2 rounded-lg text-sm mb-2">
          {error}
        </div>
      )}

      {!previewUrl ? (
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
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging
              ? 'border-[#ffc032] bg-[#ffc032]/10'
              : 'border-gray-600 hover:border-gray-500 bg-white/5'
            }`}
        >
          <ImageIcon className="w-8 h-8 text-gray-500 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Click or drag image here</p>
        </div>
      ) : (
        <div className="relative">
          <img src={previewUrl} alt="Uploaded preview" className="w-full max-h-120 object-contain rounded-lg bg-[#111] border border-gray-800" />
          <button
            type="button"
            onClick={() => {
              setError(null);
              onChange(null);
            }}
            className="absolute top-2 right-2 p-1.5 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

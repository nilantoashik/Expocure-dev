import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import type { ProjectFormData } from './ProjectFormStepper';

interface StepImagesProps {
  data: ProjectFormData;
  onChange: (updates: Partial<ProjectFormData>) => void;
}

export function StepImages({ data, onChange }: StepImagesProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setIsUploading(true);
    setError('');
    try {
      const newImages = [...data.imageUrls];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('image', file);
        const result = await api.upload<{ url: string }>('/uploads/image', formData);
        newImages.push({ url: result.url, caption: '' });
      }
      onChange({ imageUrls: newImages });
      if (!data.thumbnailUrl && newImages.length > 0) {
        onChange({ thumbnailUrl: newImages[0].url, imageUrls: newImages });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    const updated = data.imageUrls.filter((_, i) => i !== index);
    onChange({ imageUrls: updated });
  };

  const setThumbnail = (url: string) => {
    onChange({ thumbnailUrl: url });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Project Images</h2>
      {error && <Alert type="error" onClose={() => setError('')}>{error}</Alert>}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          <svg className="h-10 w-10 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-gray-500">Click to upload images</p>
        </label>
        {isUploading && <p className="text-sm text-brand-blue mt-2">Uploading...</p>}
      </div>

      {data.imageUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {data.imageUrls.map((img, i) => (
            <div key={i} className="relative group">
              <img src={img.url} alt="" className="w-full h-32 object-cover rounded-lg" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                <Button size="sm" variant="secondary" onClick={() => setThumbnail(img.url)}>
                  {data.thumbnailUrl === img.url ? 'Thumbnail' : 'Set Thumb'}
                </Button>
                <Button size="sm" variant="danger" onClick={() => removeImage(i)}>
                  Remove
                </Button>
              </div>
              {data.thumbnailUrl === img.url && (
                <span className="absolute top-1 left-1 bg-brand-green text-white text-xs px-1.5 py-0.5 rounded">
                  Thumbnail
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

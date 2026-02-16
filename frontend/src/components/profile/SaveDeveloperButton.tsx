import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface SaveDeveloperButtonProps {
  developerId: string;
}

export function SaveDeveloperButton({ developerId }: SaveDeveloperButtonProps) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ saved: boolean }>(`/saved-developers/${developerId}/status`)
      .then((res) => setSaved(res.saved))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [developerId]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (saved) {
        await api.delete(`/saved-developers/${developerId}`);
        setSaved(false);
      } else {
        await api.post(`/saved-developers/${developerId}`);
        setSaved(true);
      }
    } catch {
      // ignore
    }
  };

  if (loading) return null;

  return (
    <button
      onClick={toggle}
      className="p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
      title={saved ? 'Unsave developer' : 'Save developer'}
    >
      <svg
        className={`w-5 h-5 ${saved ? 'text-red-500 fill-current' : 'text-gray-400'}`}
        fill={saved ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}

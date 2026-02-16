import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState } from '@/components/ui/EmptyState';
import { SaveDeveloperButton } from '@/components/profile/SaveDeveloperButton';
import { useAuth } from '@/hooks/useAuth';

interface DeveloperItem {
  id: string;
  fullName: string;
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  location: string | null;
  role: string;
  projectCount: number;
}

export default function BrowseDevelopersPage() {
  const { user } = useAuth();
  const [developers, setDevelopers] = useState<DeveloperItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setIsLoading(true);
    const params = debouncedSearch ? `?search=${encodeURIComponent(debouncedSearch)}` : '';
    api.get<DeveloperItem[]>(`/users/developers${params}`)
      .then(setDevelopers)
      .catch(() => setDevelopers([]))
      .finally(() => setIsLoading(false));
  }, [debouncedSearch]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Browse Developers</h1>
        <p className="text-gray-500 mt-1">Discover talented developers and designers</p>
      </div>

      <div className="mb-6">
        <Input
          label=""
          placeholder="Search by name, username, or bio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : developers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {developers.map((dev) => (
            <div
              key={dev.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:border-brand-blue hover:shadow-sm transition-all relative"
            >
              {user?.role === 'recruiter' && (
                <div className="absolute top-4 right-4">
                  <SaveDeveloperButton developerId={dev.id} />
                </div>
              )}
              <Link to={`/${dev.username}`} className="block">
                <div className="flex items-center gap-4 mb-3">
                  <Avatar src={dev.avatarUrl} name={dev.fullName} size="md" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{dev.fullName}</h3>
                    <p className="text-sm text-gray-500">@{dev.username}</p>
                  </div>
                </div>
                {dev.bio && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{dev.bio}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  {dev.location && (
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {dev.location}
                    </span>
                  )}
                  <span>{dev.projectCount} project{dev.projectCount !== 1 ? 's' : ''}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No developers found"
          description={search ? 'Try a different search term.' : 'No verified developers yet.'}
        />
      )}
    </div>
  );
}

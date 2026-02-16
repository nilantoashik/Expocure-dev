import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '@/lib/api';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProjectGrid } from '@/components/profile/ProjectGrid';
import { SaveDeveloperButton } from '@/components/profile/SaveDeveloperButton';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@/types/user';
import type { Project } from '@/types/project';

interface PublicUserProfile extends User {
  projects: Project[];
}

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await api.get<PublicUserProfile>(`/users/${username}`);
        setProfile(data);
      } catch {
        setError('User not found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">User not found</h2>
        <p className="text-gray-500">The profile you are looking for does not exist or may have been removed.</p>
      </div>
    );
  }

  const showSaveButton = currentUser?.role === 'recruiter' && profile.role === 'developer' && currentUser.id !== profile.id;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <ProfileHeader
        user={profile}
        isOwn={false}
        actionButton={showSaveButton ? <SaveDeveloperButton developerId={profile.id} /> : undefined}
      />

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Projects</h2>
        <ProjectGrid projects={profile.projects} showActions={false} />
      </div>
    </div>
  );
}

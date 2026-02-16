import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';
import { api } from '@/lib/api';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileEditForm } from '@/components/profile/ProfileEditForm';
import { ProjectGrid } from '@/components/profile/ProjectGrid';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import type { User } from '@/types/user';

export default function ProfilePage() {
  const { user, updateUser, isLoading: authLoading } = useAuth();
  const { projects, isLoading: projectsLoading, refetch } = useProjects();
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (updatedUser: User) => {
    updateUser(updatedUser);
    setIsEditing(false);
  };

  const handlePublish = async (id: string) => {
    try {
      await api.patch(`/projects/${id}/publish`);
      refetch();
    } catch {
      // Error handled silently; could add toast notification
    }
  };

  const handleUnpublish = async (id: string) => {
    try {
      await api.patch(`/projects/${id}/unpublish`);
      refetch();
    } catch {
      // Error handled silently
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      refetch();
    } catch {
      // Error handled silently
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <ProfileHeader user={user} isOwn onEdit={() => setIsEditing(true)} />

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">My Projects</h2>
        {projectsLoading ? (
          <div className="py-12">
            <Spinner />
          </div>
        ) : (
          <ProjectGrid
            projects={projects}
            showActions
            onPublish={handlePublish}
            onUnpublish={handleUnpublish}
            onDelete={handleDelete}
          />
        )}
      </div>

      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Profile">
        <ProfileEditForm
          user={user}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      </Modal>
    </div>
  );
}
